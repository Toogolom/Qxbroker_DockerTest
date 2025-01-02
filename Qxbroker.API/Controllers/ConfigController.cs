namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Service.Config;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : Controller
    {
        private readonly IConfigService _configService;

        public ConfigController(IConfigService configService)
        {
            _configService = configService;
        }

        [HttpGet("min-deposit")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение минимальной суммы пополнения")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetMinDeposit()
        {
            var minDep = await _configService.GetMinDeposit();
            return Ok(minDep);
        }

        [HttpGet("max-deposit")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение максимальной суммы пополнения")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetMaxDeposit()
        {
            var maxDep = await _configService.GetMaxDeposit();
            return Ok(maxDep);
        }

        [HttpGet("min-withdrawal")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение минимальной суммы вывода")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetMinWithdrawal()
        {
            var minWithdrawal = await _configService.GetMinWithdrawal();
            return Ok(minWithdrawal);
        }

        [HttpGet("max-withdrawal")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение максимальной суммы вывода")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetMaxWithdrawal()
        {
            var maxWithdrawal = await _configService.GetMaxWithdrawal();
            return Ok(maxWithdrawal);
        }

        [HttpGet("all-bonuses")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение всех бонусов")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetAllBonuses()
        {
            var bonuses = await _configService.GetAllBonuses();
            return Ok(bonuses);
        }

        [HttpGet("first-dep-bonus")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение бонуса для первого депозита")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(204, "Not first deposit.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetBonusForFirstDep()
        {
            var email = HttpContext.Items["email"]?.ToString();
            var bonus = await _configService.GetFirstDepBonus(email);
            return Ok(bonus);
        }

        [HttpGet("wallets")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение кошельков для пополнения")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetWallets()
        {
            var wallets = await _configService.GetWallets();
            var listCurrency = new List<string>();
            foreach (var key in wallets.Keys)
            {
                listCurrency.Add(key);
            }

            return Ok(listCurrency);
        }

        [HttpGet("wallet-address/{currency}")]
        [SwaggerOperation(Summary = "Получение адреса и qr-кода для пополения")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetWallets(string currency)
        {
            var address = await _configService.GetWalletAddress(currency);
            var qrCode = _configService.GenerateQrCode(address);
            var model = new WalletModel
            {
                Currency = currency,
                WalletAddress = address,
                QRCode = qrCode,
            };

            return Ok(model);
        }
    }
}