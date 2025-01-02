namespace Qxbroker.Service.Currency
{
    using Qxbroker.Domain.Currency;

    public interface ICurrencyService
    {
        public Task AddCurrency(Currency currency);

        public Task<List<Currency>> GetAllCurrencies();

        public Task<int> GetProcent(string code, int duration);

        public Task UpdateCurrency(string id, int procentForMin, int procentForFiveMin);

        public Task ChangeVisibilities(string id);
    }
}
