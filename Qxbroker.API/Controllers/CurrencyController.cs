namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Domain.Currency;
    using Qxbroker.Service.Currency;
    using Swashbuckle.AspNetCore.Annotations;

    public class CurrencyController : Controller
    {
        private readonly ICurrencyService _currencyService;

        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet("/AllCurrencies")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение всех валют")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetAllCurrencies()
        {
            var currencies = await _currencyService.GetAllCurrencies();
            return Ok(currencies);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Добавление новой валюты")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> AddCurrency([FromBody] CurrencyModel model)
        {
            Currency currency = new Currency
            {
                Name = model.Name,
                ProcentForMin = model.ProcentForMin,
                ProcentForFiveMin = model.ProcentForFiveMin,
                CurrencyType = model.CurrencyType,
                IsVisible = model.IsVisible,
            };
            await _currencyService.AddCurrency(currency);
            return Ok();
        }

        [HttpPut("/UpdateProcent")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Изменение процента")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> UpdateCurrency(string id, int procentForMin, int procentForFiveMin)
        {
            await _currencyService.UpdateCurrency(id, procentForMin, procentForFiveMin);
            return Ok();
        }

        [HttpPut("/ChangeVisibilities")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Изменение видимости валюты")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> ChangeVisibility(string id)
        {
            await _currencyService.ChangeVisibilities(id);
            return Ok();
        }
    }
}
