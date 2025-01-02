namespace Qxbroker.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using Qxbroker.API.Models;
using Qxbroker.Service.BinanceWebSocket;

[ApiController]
[Route("api/[controller]")]
public class ChartDataWebSocketController : Controller
{
    private readonly IBinanceWebSocketService _binanceWebSocketService;

    public ChartDataWebSocketController(IBinanceWebSocketService webSocketService)
    {
        _binanceWebSocketService = webSocketService;
    }

    [HttpPost("connect-chart-data-web-socket")]
    public async Task<IActionResult> ConnectToDataWebSocket([FromBody] ChartDataRequestModel dataRequest)
    {
        await _binanceWebSocketService.ConnectAsync(dataRequest.Symbol, dataRequest.TimeFrame);
        return Ok("Connected to Binance WebSocket");
    }

    [HttpGet("disconnect-chart-data-web-socket")]
    public async Task<IActionResult> DisconnectFromDataWebSocket()
    {
        await _binanceWebSocketService.DisconnectAsync();
        return Ok("Disconnected from Binance WebSocket");
    }
}