namespace Qxbroker.Infrastructure.Repository
{
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using MongoDB.Bson;
    using MongoDB.Driver;
    using Qxbroker.Domain.Config;
    using Qxbroker.Infrastructure.Models;

    public class ConfigRepository : IConfigRepository
    {
        private readonly IMongoCollection<Config> _configCollection;

        public ConfigRepository(IOptions<MongoDBSettingsModel> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DataBaseName);
            _configCollection = database.GetCollection<Config>(mongoDBSettings.Value.ConfigCollection);
        }

        public async Task<Config> GetConfig()
        {
            return await _configCollection.Find(new BsonDocument()).FirstOrDefaultAsync();
        }

        public async Task UpdateConfig(Config config)
        {
            var filter = Builders<Config>.Filter.Empty;
            await _configCollection.ReplaceOneAsync(filter, config, new ReplaceOptions { IsUpsert = true });
        }
    }
}
