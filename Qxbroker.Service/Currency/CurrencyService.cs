namespace Qxbroker.Service.Currency
{
    using Qxbroker.Domain.Currency;
    using Qxbroker.Service.Redis;

    public class CurrencyService : ICurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;
        private readonly IRedisService _redisService;

        public CurrencyService(ICurrencyRepository currencyRepository, IRedisService redisService)
        {
            _currencyRepository = currencyRepository;
            _redisService = redisService;
        }

        public async Task AddCurrency(Currency currency)
        {
            await _currencyRepository.AddCurrency(currency);
        }

        public async Task ChangeVisibilities(string id)
        {
            await _currencyRepository.ChangeVisibilities(id);
        }

        public async Task<List<Currency>> GetAllCurrencies()
        {
            string redisKey = "allCurrencies";
            var currencies = await _redisService.GetListData<Currency>(redisKey);

            if (currencies != null && currencies.Any())
            {
                return currencies;
            }

            currencies = await _currencyRepository.GetAllCurrency();

            await _redisService.SetListData(redisKey, currencies, TimeSpan.FromHours(1));

            return currencies;
        }

        public async Task<int> GetProcent(string code, int duration)
        {
            var currency = await GetCurrencyByCode(code);
            if (duration > 300)
            {
                return currency.ProcentForFiveMin;
            }

            return currency.ProcentForMin;
        }

        public async Task UpdateCurrency(string id, int procentForMin, int procentForFiveMin)
        {
            await _currencyRepository.UpdateCurrency(id, procentForMin, procentForFiveMin);
        }

        public async Task<Currency> GetCurrencyByCode(string code)
        {
            var allCurrencies = await GetAllCurrencies();

            return allCurrencies.FirstOrDefault(c => c.Code == code);
        }
    }
}
