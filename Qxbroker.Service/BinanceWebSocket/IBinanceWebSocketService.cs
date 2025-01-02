namespace Qxbroker.Service.BinanceWebSocket;

public interface IBinanceWebSocketService
{
    public Task ConnectAsync(string symbol, string timeFrame);

    public Task ReceiveMessagesAsync();

    public Task DisconnectAsync();
}