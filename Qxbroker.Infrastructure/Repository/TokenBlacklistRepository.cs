namespace Qxbroker.Infrastructure.Repository
{
    using Microsoft.Extensions.Options;
    using MongoDB.Driver;
    using Qxbroker.Domain.Token.Blacklist;
    using Qxbroker.Infrastructure.Models;

    public class TokenBlacklistRepository : ITokenBlacklistRepository
    {
        private readonly IMongoCollection<TokenBlacklist> _blacklistCollection;

        public TokenBlacklistRepository(IOptions<MongoDBSettingsModel> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DataBaseName);
            _blacklistCollection = database.GetCollection<TokenBlacklist>(mongoDBSettings.Value.BlacklistCollection);
        }

        public async Task<HashSet<string>> GetAll()
        {
            var blacklistDocument = await _blacklistCollection.Find(_ => true).FirstOrDefaultAsync();
            return blacklistDocument != null ? new HashSet<string>(blacklistDocument.Tokens) : new HashSet<string>();
        }

        public async Task UpdateBlackList(HashSet<string> blackList)
        {
            var blacklistDocument = await _blacklistCollection.Find(_ => true).FirstOrDefaultAsync();

            if (blacklistDocument != null)
            {
                blacklistDocument.Tokens = blackList.ToList();
                await _blacklistCollection.ReplaceOneAsync(
                    filter: Builders<TokenBlacklist>.Filter.Eq(x => x.Id, blacklistDocument.Id),
                    replacement: blacklistDocument);
            }
            else
            {
                blacklistDocument = new TokenBlacklist { Tokens = blackList.ToList() };
                await _blacklistCollection.InsertOneAsync(blacklistDocument);
            }
        }
    }
}
