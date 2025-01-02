namespace Qxbroker.Domain.Currency
{
    public interface ICurrencyRepository
    {
        public Task<List<Currency>> GetAllCurrency();

        public Task AddCurrency(Currency currency);

        public Task UpdateCurrency(string id, int procentForMin, int procentForFiveMin);

        public Task ChangeVisibilities(string id);
    }
}
