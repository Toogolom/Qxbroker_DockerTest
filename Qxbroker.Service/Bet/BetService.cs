namespace Qxbroker.Service.Bet
{
    using System.Net.Http;
    using Hangfire;
    using Microsoft.AspNetCore.SignalR;
    using Newtonsoft.Json.Linq;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.Exception;
    using Qxbroker.Domain.HubConfig;
    using Qxbroker.Service.Currency;
    using Qxbroker.Service.Redis;
    using Qxbroker.Service.User;

    public class BetService : IBetService
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private readonly IUserService _userService;
        private readonly IRedisService _redisService;
        private readonly ICurrencyService _currencyService;
        private readonly IHubContext<BetHub> _hubContext;
        private readonly IBackgroundJobClient _backgroundJobClient;

        public BetService(IUserService userService, IRedisService redisService, IHubContext<BetHub> hubContext, IBackgroundJobClient backgroundJobClient, ICurrencyService currency)
        {
            _userService = userService;
            _redisService = redisService;
            _hubContext = hubContext;
            _backgroundJobClient = backgroundJobClient;
            _currencyService = currency;
        }

        public async Task<List<Bet>> GetAllBetByEmail(string email, bool isDemo)
        {
            return await _userService.GetHistoryBetByEmail(email, isDemo);
        }

        public async Task<List<Bet>> GetAllInProceedBetByEmail(string email, bool isDemo)
        {
            string key = $"activeBets:{email}";

            var bets = await _redisService.GetListData<Bet>(key);

            var inProceedBets = bets.Where(bet => bet.Status == BetStatus.InProceed && bet.IsDemo == isDemo).ToList();

            return inProceedBets;
        }

        public async Task OpenBet(Bet bet, string email)
        {
            bet.OpenPrice = await GetPriceFromBinanceApi(bet.Pair, bet.OpenTime);
            var balance = bet.IsDemo ? await _userService.GetDemoBalance(email) : await _userService.GetBalance(email);

            if (bet.Amount > balance)
            {
                throw new InsufficientFundsException();
            }

            var timeToClose = bet.CloseTime - DateTime.Now;

            if (timeToClose <= TimeSpan.Zero)
            {
                await CloseBet(bet, email);
            }
            else
            {
                _backgroundJobClient.Schedule(() => CloseBet(bet, email), timeToClose);
            }

            await AddActiveBet(bet, email);
            await _hubContext.Clients.All.SendAsync("BetOpened", bet);

            await UpdateBalance(email, bet.IsDemo, -1 * bet.Amount);
        }

        public async Task CloseBet(Bet bet, string email)
        {
            if (bet == null)
            {
                throw new InvalidOperationException("Bet not found");
            }

            await RemoveBetFromActiveList(bet, email);
            await SuccessChecker(bet);
            var updateBetHistoryTask = _userService.UpdateBetHistory(bet, email);
            var updateBalanceTask = UpdateBalance(email, bet.IsDemo, bet.Income);

            await Task.WhenAll(updateBetHistoryTask, updateBalanceTask);

            await _hubContext.Clients.All.SendAsync("BetClosed", bet);

            await UpdateBalance(email, bet.IsDemo, bet.Income);
        }

        public async Task<List<Bet>> GetAllBetByDate(string email, DateOnly startDate, DateOnly endDate, bool isDemo)
        {
            var bets = await GetAllBetByEmail(email, isDemo);
            var betsInRange = bets
                            .Where(bet =>
                            {
                                var betDate = DateOnly.FromDateTime(bet.OpenTime);
                                return betDate >= startDate && betDate <= endDate;
                            })
                            .ToList();

            return betsInRange;
        }

        private async Task<decimal> GetPriceFromBinanceApi(string currencyPair, DateTime time)
        {
            var url = $"https://api.binance.com/api/v3/klines?symbol={currencyPair}&interval=1m&endTime={new DateTimeOffset(time).ToUnixTimeMilliseconds()}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var data = await response.Content.ReadAsStringAsync();
            var json = JArray.Parse(data);
            var price = decimal.Parse((string)json.Last[4]);

            return price;
        }

        private async Task UpdateBalance(string email, bool isDemo, decimal income)
        {
            if (isDemo)
            {
                await _userService.UpdateUserDemoBalance(email, income);
                return;
            }

            await _userService.UpdateUserBalance(email, income);
        }

        private async Task SuccessChecker(Bet bet)
        {
            bet.ClosePrice = await GetPriceFromBinanceApi(bet.Pair, bet.CloseTime);
            var duration = (int)bet.Duration;

            if ((bet.BetType == BetType.Up && bet.ClosePrice > bet.OpenPrice) ||
                (bet.BetType == BetType.Down && bet.ClosePrice < bet.OpenPrice))
            {
                bet.Status = BetStatus.Success;
                bet.Income = await CalculateIncome(bet.Amount, true, bet.Pair, duration);
            }
            else
            {
                bet.Status = BetStatus.Failed;
                bet.Income = await CalculateIncome(bet.Amount, false, bet.Pair, duration);
            }
        }

        private async Task AddActiveBet(Bet bet, string email)
        {
            string key = $"activeBets:{email}";
            await _redisService.AddToList(key, bet);
        }

        private async Task RemoveBetFromActiveList(Bet bet, string email)
        {
            string key = $"activeBets:{email}";

            await _redisService.RemoveItemFromList(key, bet);
        }

        private async Task<decimal> CalculateIncome(decimal amount, bool check, string pair, int duaration)
        {
            if (check)
            {
                var proc = await _currencyService.GetProcent(pair, duaration);
                return amount * ((decimal)proc / 100m);
            }
            else
            {
                return 0;
            }
        }
    }
}
