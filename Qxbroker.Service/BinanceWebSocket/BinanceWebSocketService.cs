namespace Qxbroker.Service.BinanceWebSocket;

using System.Net.WebSockets;
using System.Text;

public class BinanceWebSocketService : IBinanceWebSocketService
{
    private readonly ClientWebSocket _webSocket;
    private readonly string _connectionUri = "wss://stream.binance.com:9443/ws/";

    public BinanceWebSocketService()
    {
        _webSocket = new ClientWebSocket();
    }

    public async Task ConnectAsync(string symbol, string timeFrame)
    {
        Uri serverUri = new Uri(_connectionUri + symbol + "@kline_" + timeFrame);
        await _webSocket.ConnectAsync(serverUri, CancellationToken.None);
        Console.WriteLine("WebSocket connection established");

        await ReceiveMessagesAsync();
    }

    public async Task ReceiveMessagesAsync()
    {
        var buffer = new byte[1024 * 4];
        while (_webSocket.State == WebSocketState.Open)
        {
            var result = await _webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine($"Received: {message}");
            }
            else if (result.MessageType == WebSocketMessageType.Close)
            {
                await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                Console.WriteLine("WebSocket connection closed");
            }
        }
    }

    // TODO: disconnect dont work
    public async Task DisconnectAsync()
    {
        if (_webSocket.State == WebSocketState.Open)
        {
            await _webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
            Console.WriteLine("WebSocket connection closed by client");
        }
    }
}