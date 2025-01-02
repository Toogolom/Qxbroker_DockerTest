namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Domain.Transactions;
    using Qxbroker.Domain.User;
    using Qxbroker.Service.Config;
    using Qxbroker.Service.User;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfigService _configService;

        public UserController(IUserService userService, IConfigService config)
        {
            _userService = userService;
            _configService = config;
        }

        [HttpGet("/AllUsers")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Получение всех пользователей")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet]
        [Authorize]
        [SwaggerOperation(Summary = "Получение пользователя")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetUserByEmail()
        {
            var email = HttpContext.Items["email"]?.ToString();
            var user = await _userService.GetUserByEmail(email);

            return Ok(user);
        }

        [HttpGet("status-verification")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение статуса верификации")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetVerificationStatus()
        {
            var email = HttpContext.Items["email"]?.ToString();
            var status = await _userService.GetVerificationStatus(email);

            return Ok(status);
        }

        [HttpGet("transaction/{id}")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение транзакции по id")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetTransactionById(string id)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var transaction = await _userService.GetTransactionsById(email, id);

            return Ok(transaction);
        }

        [HttpPost]
        [SwaggerOperation(Summary = "Добавление пользователя")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> AddUser([FromBody] RegModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid user data");
            }

            var user = new User
            {
                Email = model.Email,
                Password = model.Password,
                Currency = model.Currency,
                Country = model.Country,
                UID = await _userService.GenerateUID(),
            };

            await _userService.AddUser(user);
            return Ok();
        }

        [HttpPost("AddTransaction")]
        [Authorize]
        [SwaggerOperation(Summary = "Добавление транзакции")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> AddTransaction([FromBody] TransactionModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid transaction data");
            }

            var email = HttpContext.Items["email"]?.ToString();
            var transaction = new Transaction
            {
                DateAndTime = DateTime.Now,
                Status = TransactionStatus.Waiting,
                Type = model.Type,
                PaymentSystem = model.PaymentSystem,
                Amount = model.Amount,
            };
            var id = await _userService.AddTransaction(email, transaction);
            return Ok(new { id });
        }

        [HttpPost("add-confirm-transaction-image")]
        [Authorize]
        [SwaggerOperation(Summary = "Добавление фото для подтверждение транзакции")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> AddImageForConfirmTransaction(IFormFile file, [FromForm] string id)
        {
            var email = HttpContext.Items["email"]?.ToString();
            await _userService.AddTransactionPaymentImage(file, id, email);
            return Ok();
        }

        [HttpPost("Verification")]
        [Authorize]
        [SwaggerOperation(Summary = "Добавление верификации")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> Verification([FromForm] VerificationModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid verification data");
            }

            var email = HttpContext.Items["email"]?.ToString();
            var verification = new Verification
            {
                Name = model.Name,
                Surname = model.Surname,
                MobileNumber = model.MobileNumber,
                WalletAddress = model.WalletAddress,
                Status = VerificationStatus.OnVerification,
            };

            await _userService.AddVerification(email, verification, model.File);
            return Ok();
        }

        [HttpPost("AddReferal")]
        [SwaggerOperation(Summary = "Добавление реферала при вводе промокода")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> AddReferal(string referalEmail, string promocode)
        {
            await _userService.AddReferal(referalEmail, promocode);
            return Ok();
        }

        [HttpPut("ChangeUsertoRefavod")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Добавление рефавода")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> ChangeUsertoRefavod(string email, string promokode)
        {
            await _userService.ChangeUsertoRefavod(email, promokode);
            return Ok();
        }

        [HttpPut("updateData")]
        [Authorize]
        [SwaggerOperation(Summary = "Обновление общих данных пользователя")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> UpdateUserData([FromBody] UserDataModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid user data");
            }

            var email = HttpContext.Items["email"]?.ToString();

            await _userService.UpdateUserData(email, model.Name, model.Surname, model.DateOfBirth, model.Country, model.Address);
            return Ok();
        }

        // It's put, but i set post for CORS fix
        [HttpPost("upload-profile-picture")]
        [Authorize]
        [SwaggerOperation(Summary = "Обновление фотографии")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var email = HttpContext.Items["email"]?.ToString();
            string url = await _userService.UpdateUserImage(email, file);

            return Ok(new User() { URLProfileImage = url });
        }

        [HttpDelete("delete-profile-picture")]
        [Authorize]
        [SwaggerOperation(Summary = "Удаление фотографии")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> DeleteProfilePicture()
        {
            var email = HttpContext.Items["email"]?.ToString();

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email not found.");
            }

            var result = await _userService.DeleteUserImage(email);
            if (result)
            {
                return Ok();
            }

            return StatusCode(500, "Error deleting profile picture.");
        }

        [HttpPut("deposit")]
        [Authorize]
        [SwaggerOperation(Summary = "Обновление общего баланса пользователя")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> UpdateBalance(decimal deposit)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var minDeposit = await _configService.GetMinDeposit();
            if (deposit < minDeposit)
            {
                return BadRequest($"Deposit amount must be at least {minDeposit}.");
            }

            await _userService.UpdateUserBalance(email, deposit);
            await _userService.UpdateUserVipStatus(email, deposit);
            return Ok();
        }

        [HttpPut("updateDemoBalance")]
        [Authorize]
        [SwaggerOperation(Summary = "Обновление демо баланса")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> UpdateDemoBalance(decimal demoBalance)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var user = await _userService.GetUserByEmail(email);
            await _userService.UpdateUserDemoBalance(email, demoBalance + user.DemoBalance);
            return Ok();
        }

        [HttpPut("change-password")]
        [Authorize]
        [SwaggerOperation(Summary = "Обновление пароля")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid creditals.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> ChangePassword(string oldPassword, string newPassword)
        {
            var email = HttpContext.Items["email"]?.ToString();

            await _userService.ChangePassword(email, oldPassword, newPassword);
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Удаление пользователя")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(404, "Not found user.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            await _userService.DeleteUser(email);
            return Ok();
        }
    }
}
