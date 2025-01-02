namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Service.VipStatus;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/[controller]")]
    public class VipStatusController : Controller
    {
        private readonly IVipStatusService _vipStatusService;

        public VipStatusController(IVipStatusService vipStatusService)
        {
            _vipStatusService = vipStatusService;
        }

        [HttpGet("GetAll")]
        [SwaggerOperation(Summary = "Получение всех випстатусов")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> GetStatuses()
        {
            var statuses = await _vipStatusService.GetStatuses();
            return Ok(statuses);
        }

        [HttpGet("change-range")]
        [Authorize(Roles = "Admin")]
        [SwaggerOperation(Summary = "Изменение диапозонов")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(401, "Invalid Token.")]
        [SwaggerResponse(500, "Server error.")]
        public async Task<IActionResult> ChangeRangeVipStatus([FromBody] RangeVipStatusModel model)
        {
            await _vipStatusService.UpdateVipStatusRange(model.Key, model.NewDepositFrom, model.NewDepositTo);
            return Ok();
        }
    }
}