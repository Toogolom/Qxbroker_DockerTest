namespace Qxbroker.Domain.HubConfig
{
    using Microsoft.AspNetCore.SignalR;
    using Qxbroker.Domain.Bet;

    public class BetHub : Hub
    {
        public async Task SendBetOpen(Bet bet, string email)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("BetOpened", bet);
        }

        public async Task SendBetClose(Bet bet, string email)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("BetClosed", bet);
        }

        public async Task SendBalance(decimal balance, string email)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("BalanceUpdate", balance);
        }
    }
}
