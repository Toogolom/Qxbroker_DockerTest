namespace Qxbroker.Service.User
{
    using Microsoft.AspNetCore.Http;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.Transactions;
    using Qxbroker.Domain.User;

    public interface IUserService
    {
        public Task<List<User>> GetAllUsers();

        public Task<User> GetUserByEmail(string email);

        public Task<List<Bet>> GetHistoryBetByEmail(string email, bool isDemo);

        public Task<List<Transaction>> GetTransactionsByEmail(string email);

        public Task<Transaction> GetTransactionsById(string email, string id);

        public Task<decimal> GetBalance(string email);

        public Task<decimal> GetDemoBalance(string email);

        public Task<string> GetVerificationStatus(string email);

        public Task AddUser(User user);

        public Task<string> AddTransaction(string email, Transaction transaction);

        public Task AddTransactionPaymentImage(IFormFile file, string id, string email);

        public Task AddReferal(string referalEmail, string promocode);

        public Task AddVerification(string email, Verification verification, IFormFile file);

        public Task UpdateUser(User user);

        public Task<string> UpdateUserImage(string email, IFormFile file);

        public Task UpdateVerificationStatus(string email, VerificationStatus verificationStatus);

        public Task<bool> DeleteUserImage(string email);

        public Task UpdateUserData(string email, string name, string surname, DateOnly dateOfBirth, string country, string address);

        public Task UpdateUserBalance(string email, decimal balance);

        public Task UpdateUserVipStatus(string email, decimal depositBalance);

        public Task UpdateUserDemoBalance(string email, decimal demoBalance);

        public Task UpdateStatusTransaction(string email, string id, TransactionStatus status);

        public Task UpdateBetHistory(Bet bet, string email);

        public Task ChangePassword(string email, string oldPassword, string password);

        public Task ChangeUsertoRefavod(string email, string promokode);

        public Task<bool> EmailIsEnable(string email);

        public Task<string> GenerateUID();

        public Task DeleteUser(string email);
    }
}
