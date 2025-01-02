namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.User;
    using Qxbroker.Service.Bet;
    using Qxbroker.Service.Token;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/[controller]")]
    public class BetController : Controller
    {
        private readonly IBetService _betService;

        public BetController(IBetService betService)
        {
            _betService = betService;
        }

        [HttpPost("open-bet")]
        [Authorize]
        [SwaggerOperation(Summary = "Открыть сделку")]
        [SwaggerResponse(401, "Invalid token")]
        [SwaggerResponse(402, "Insufficient funds")]
        public async Task<IActionResult> OpenBet([FromBody] BetRequestModel betReq)
        {
            var email = HttpContext.Items["email"]?.ToString();

            DateTime currentDate = DateTime.Now;

            Bet bet = new Bet
            {
                Id = Guid.NewGuid().ToString(),
                Amount = betReq.Amount,
                BetType = betReq.BetType,
                Status = BetStatus.InProceed,
                Pair = betReq.Pair,
                OpenTime = currentDate,
                CloseTime = currentDate.AddSeconds((double)betReq.Time),
                Duration = betReq.Time,
                IsDemo = betReq.IsDemo,
            };
            await _betService.OpenBet(bet, email);
            return Ok();
        }

        [HttpGet("get-history")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение истории всех сделок")]
        [SwaggerResponse(401, "Invalid token")]
        public async Task<IActionResult> GetHistoryBet(bool isDemo)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var history = await _betService.GetAllBetByEmail(email, isDemo);
            history.Reverse();

            return Ok(history);
        }

        [HttpGet("get-history-sort-date")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение истории всех сделок во временной промежуток")]
        [SwaggerResponse(401, "Invalid token")]
        public async Task<IActionResult> GetHistoryBetRangeDate(bool isDemo, DateOnly startDate, DateOnly endDate)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var history = await _betService.GetAllBetByDate(email, startDate, endDate, isDemo);
            history.Reverse();

            return Ok(history);
        }

        [HttpGet("get-inProceed")]
        [Authorize]
        [SwaggerOperation(Summary = "Получение истории всех акитивных сделок")]
        [SwaggerResponse(401, "Invalid token")]
        public async Task<IActionResult> GetInProceedBet(bool isDemo)
        {
            var email = HttpContext.Items["email"]?.ToString();
            var history = await _betService.GetAllInProceedBetByEmail(email, isDemo);
            return Ok(history);
        }
    }
}
