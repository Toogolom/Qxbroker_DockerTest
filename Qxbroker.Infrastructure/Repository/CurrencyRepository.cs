namespace Qxbroker.Infrastructure.Repository
{
    using Microsoft.Extensions.Options;
    using MongoDB.Driver;
    using Qxbroker.Domain.Currency;
    using Qxbroker.Infrastructure.Models;

    public class CurrencyRepository : ICurrencyRepository
    {
        private readonly IMongoCollection<Currency> _currenciesCollection;

        public CurrencyRepository(IOptions<MongoDBSettingsModel> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DataBaseName);
            _currenciesCollection = database.GetCollection<Currency>(mongoDBSettings.Value.CurrenciesCollection);
        }

        public async Task AddCurrency(Currency currency)
        {
            await _currenciesCollection.InsertOneAsync(currency);
        }

        public async Task ChangeVisibilities(string id)
        {
            var filter = Builders<Currency>.Filter.Eq(c => c.Id, id);

            var currentCurrency = await _currenciesCollection.Find(filter).FirstOrDefaultAsync();
            var newVisibility = !currentCurrency.IsVisible;
            var update = Builders<Currency>.Update.Set(c => c.IsVisible, newVisibility);

            await _currenciesCollection.UpdateOneAsync(filter, update);
        }

        public async Task<List<Currency>> GetAllCurrency()
        {
            return await _currenciesCollection.Find(_ => true).ToListAsync();
        }

        public async Task UpdateCurrency(string id, int procentForMin, int procentForFiveMin)
        {
            var filter = Builders<Currency>.Filter.Eq(c => c.Id, id);
            var update = Builders<Currency>.Update
                .Set(c => c.ProcentForMin, procentForMin)
                .Set(c => c.ProcentForFiveMin, procentForFiveMin);

            await _currenciesCollection.UpdateOneAsync(filter, update);
        }
    }
}
