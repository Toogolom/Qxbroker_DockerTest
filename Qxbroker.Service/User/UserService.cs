namespace Qxbroker.Service.User
{
    using Hangfire;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.SignalR;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.Exception;
    using Qxbroker.Domain.HubConfig;
    using Qxbroker.Domain.Transactions;
    using Qxbroker.Domain.User;
    using Qxbroker.Service.Auth;
    using Qxbroker.Service.Redis;
    using Qxbroker.Service.VipStatus;

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        private readonly IRedisService _redisService;
        private readonly IVipStatusService _vipStatusService;
        private readonly IHubContext<BetHub> _hubContext;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public UserService(IUserRepository userRepository, IAuthService authService, IRedisService redisService, IVipStatusService vipStatusService, IHubContext<BetHub> hubContext, IBackgroundJobClient backgroundJobClient)
        {
            _userRepository = userRepository;
            _authService = authService;
            _redisService = redisService;
            _vipStatusService = vipStatusService;
            _hubContext = hubContext;
            _backgroundJobClient = backgroundJobClient;
        }

        public async Task AddUser(User user)
        {
            await _userRepository.AddUser(user);
        }

        public async Task DeleteUser(string email)
        {
            await _userRepository.DeleteUser(email);
            await _redisService.RemoveData($"user:{email}");
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _userRepository.GetAllUsers();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var redisKey = $"user:{email}";
            var cachedUser = await _redisService.GetData<User>(redisKey);

            if (cachedUser != null)
            {
                return cachedUser;
            }

            var userFromDb = await _userRepository.GetUserByEmail(email);

            if (userFromDb != null)
            {
                await _redisService.SetData(redisKey, userFromDb, TimeSpan.FromHours(1));
            }

            return userFromDb;
        }

        public async Task<decimal> GetBalance(string email)
        {
            var user = await GetUserByEmail(email);

            return user.TotalBalance;
        }

        public async Task<decimal> GetDemoBalance(string email)
        {
            var user = await GetUserByEmail(email);

            return user.DemoBalance;
        }

        public async Task<string> GetVerificationStatus(string email)
        {
            var user = await GetUserByEmail(email);
            var status = user.Verification.Status;

            return status.ToString();
        }

        public async Task AddVerification(string email, Verification verification, IFormFile file)
        {
            var user = await GetUserByEmail(email);

            var profilePictureUrl = await SaveImage(file, "verification-document");

            verification.UrlForDocumentImage = profilePictureUrl;

            user.Verification = verification;

            await UpdateUser(user);
        }

        public async Task UpdateVerificationStatus(string email, VerificationStatus verificationStatus)
        {
            var user = await GetUserByEmail(email);

            user.Verification.Status = verificationStatus;

            await UpdateUser(user);
        }

        public async Task ChangePassword(string email, string oldPassword, string password)
        {
            var user = await GetUserByEmail(email);

            if (user == null || _authService.VerifyPassword(oldPassword, password))
            {
                throw new InvalidCredentialsException();
            }

            var hashPassword = BCrypt.Net.BCrypt.HashPassword(password);
            await _userRepository.ChangePassword(email, hashPassword);
            var redisKey = $"user:{email}";
            await _redisService.RemoveData(redisKey);
        }

        public async Task UpdateUserData(string email, string name, string surname, DateOnly dateOfBirth, string country, string address)
        {
            var redisKey = $"user:{email}";
            var user = await GetUserByEmail(email);
            user.Name = name;
            user.Surname = surname;
            user.DateOfBirth = dateOfBirth;
            user.Country = country;
            user.Address = address;
            await _redisService.SetData(redisKey, user);
            BackgroundJob.Enqueue(() => _userRepository.UpdateUserData(email, name, surname, dateOfBirth, country, address));
        }

        public async Task<string> UpdateUserImage(string email, IFormFile file)
        {
            var profilePictureUrl = await SaveImage(file, "profile-pictures");
            await _userRepository.UpdateUserImage(email, profilePictureUrl);
            var redisKey = $"user:{email}";
            await _redisService.RemoveData(redisKey);
            return profilePictureUrl;
        }

        public async Task<bool> DeleteUserImage(string email)
        {
            var user = await GetUserByEmail(email);
            if (user == null || string.IsNullOrEmpty(user.URLProfileImage))
            {
                return false;
            }

            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), user.URLProfileImage);

            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }

            user.URLProfileImage = null;
            await UpdateUser(user);

            return true;
        }

        public async Task UpdateUserVipStatus(string email, decimal depositBalance)
        {
            var vipStatuses = await _vipStatusService.GetStatuses();
            var applicableStatus = vipStatuses
                .Where(status => depositBalance >= status.DepositBalanceFrom && depositBalance <= status.DepositBalanceTo)
                .OrderByDescending(status => status.Importance)
                .FirstOrDefault();

            if (applicableStatus == null)
            {
                return;
            }

            var user = await GetUserByEmail(email);
            if (user == null)
            {
                throw new NotFoundException();
            }

            var vipStatus = vipStatuses.FirstOrDefault(vs => vs.Key == user.VipStatus);

            if (user.VipStatus == null || vipStatus.Importance < applicableStatus.Importance)
            {
                user.VipStatus = applicableStatus.Key;
                await UpdateUser(user);
            }
        }

        public async Task ChangeUsertoRefavod(string email, string promokode)
        {
            await _userRepository.ChangeUsertoRefavod(email, promokode);
        }

        public async Task UpdateUserBalance(string email, decimal balance)
        {
            var redisKey = $"user:{email}";
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                throw new NotFoundException();
            }

            var newBalance = user.TotalBalance + balance;
            user.TotalBalance = newBalance;
            await _redisService.SetData(redisKey, user, TimeSpan.FromHours(1));

            await _hubContext.Clients.All.SendAsync("BalanceUpdate", newBalance);
            BackgroundJob.Enqueue(() => _userRepository.UpdateUserBalance(email, newBalance));
        }

        public async Task UpdateUserDemoBalance(string email, decimal demoBalance)
        {
            var redisKey = $"user:{email}";
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                throw new NotFoundException();
            }

            var newBalance = user.DemoBalance + demoBalance;
            user.DemoBalance = newBalance;
            await _redisService.SetData(redisKey, user, TimeSpan.FromHours(1));
            await _hubContext.Clients.All.SendAsync("DemoBalanceUpdate", newBalance);

            BackgroundJob.Enqueue(() => _userRepository.UpdateUserDemoBalance(email, newBalance));
        }

        public async Task<bool> EmailIsEnable(string email)
        {
            var user = await GetUserByEmail(email);
            return user == null;
        }

        public async Task UpdateUser(User user)
        {
            var redisKey = $"user:{user.Email}";
            await _redisService.SetData(redisKey, user);
            BackgroundJob.Enqueue(() => _userRepository.UpdateUser(user));
        }

        public async Task AddReferal(string referalEmail, string promocode)
        {
            await _userRepository.AddReferal(referalEmail, promocode);
        }

        public async Task<string> GenerateUID()
        {
            string id;
            bool exists;

            do
            {
                var userId = new Random().Next(100000, 999999);
                id = userId.ToString();
                exists = await _userRepository.UIDIsEnable(id);
            }
            while (exists);

            return id;
        }

        public async Task<List<Bet>> GetHistoryBetByEmail(string email, bool isDemo)
        {
            var user = await GetUserByEmail(email);
            var historyList = user.BetHistory;
            var activeList = await _redisService.GetListData<Bet>($"activeBets:{email}");
            var combinedList = historyList.Concat(activeList).Where(bet => bet.IsDemo == isDemo).ToList();

            return combinedList;
        }

        public async Task<List<Transaction>> GetTransactionsByEmail(string email)
        {
            var user = await GetUserByEmail(email);
            return user.Transactions;
        }

        public async Task<Transaction> GetTransactionsById(string email, string id)
        {
            var user = await GetUserByEmail(email);
            return user.Transactions.Where(t => t.Id == id).FirstOrDefault();
        }

        public async Task<string> AddTransaction(string email, Transaction transaction)
        {
            var user = await GetUserByEmail(email);
            var redisKey = $"user:{user.Email}";
            transaction.Id = GenerateTransactionId();

            user.Transactions.Add(transaction);
            await _redisService.SetData(redisKey, user, TimeSpan.FromHours(1));
            await UpdateUser(user);
            var jobId = _backgroundJobClient.Schedule(() => UpdateStatusTransaction(email, transaction.Id, TransactionStatus.Cancel), TimeSpan.FromHours(24));
            return transaction.Id;
        }

        public async Task AddTransactionPaymentImage(IFormFile file, string id, string email)
        {
            var picture = await SaveImage(file, "transaction-confirm");
            var user = await GetUserByEmail(email);
            var transaction = user.Transactions.Where(tr => tr.Id == id).FirstOrDefault();
            transaction.ConfirmationPaymentUrl = picture;
            transaction.Status = TransactionStatus.Confirmation;
            await UpdateUser(user);

            await _redisService.SetData(id, picture);
        }

        public async Task UpdateStatusTransaction(string email, string id, TransactionStatus status)
        {
            var user = await GetUserByEmail(email);
            var redisKey = $"user:{user.Email}";

            var transaction = user.Transactions.Where(tr => tr.Id == id).FirstOrDefault();
            if (transaction == null)
            {
                throw new NotFoundException();
            }

            if (!string.IsNullOrEmpty(transaction.JobId))
            {
                _backgroundJobClient.Delete(transaction.JobId);
                transaction.JobId = null;
            }

            transaction.Status = status;
            await UpdateUser(user);
            if (status == TransactionStatus.Success)
            {
                await UpdateUserBalance(email, transaction.Amount);
            }
        }

        public async Task UpdateBetHistory(Bet bet, string email)
        {
            var user = await GetUserByEmail(email);
            var redisKey = $"user:{user.Email}";

            if (user.BetHistory == null)
            {
                user.BetHistory = new List<Bet>();
            }

            user.BetHistory.Add(bet);

            await _redisService.SetData(redisKey, user, TimeSpan.FromHours(1));

            await UpdateUser(user);
        }

        private string GenerateTransactionId()
        {
            return $"{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N").Substring(0, 8)}";
        }

        private async Task<string> SaveImage(IFormFile file, string nameFolder)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                throw new InvalidImageException();
            }

            var maxFileSize = 5 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                throw new InvalidOperationException();
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles", $"{nameFolder}");
            Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var pictureUrl = $"/StaticFiles/{nameFolder}/{uniqueFileName}";

            return pictureUrl;
        }
    }
}