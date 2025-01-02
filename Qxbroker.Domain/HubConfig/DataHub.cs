namespace Qxbroker.API.HubConfig;

using Microsoft.AspNetCore.SignalR;

public class DataHub : Hub
{
    public async Task AskServer(string text)
    {
        string temp;

        if (text == "hey")
        {
            temp = "hi";
        }
        else
        {
            temp = "anus";
        }

        await Clients.Clients(Context.ConnectionId).SendAsync("AskServerResponse", temp);
    }
}
