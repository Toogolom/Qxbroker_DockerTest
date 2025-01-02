namespace Qxbroker.Service.Redis
{
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using StackExchange.Redis;

    public class RedisService : IRedisService
    {
        private readonly IDatabase _database;

        public RedisService(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task SetData<T>(string key, T data, TimeSpan? expiration = null)
        {
            var jsonData = JsonConvert.SerializeObject(data);
            await _database.StringSetAsync(key, jsonData, expiration);
        }

        public async Task SetListData<T>(string key, List<T> list, TimeSpan? expiration = null)
        {
            if (list == null || !list.Any())
            {
                return;
            }

            var serializedData = list.Select(item => JsonConvert.SerializeObject(item)).ToList();

            foreach (var data in serializedData)
            {
                await _database.ListRightPushAsync(key, data);
            }
        }

        public async Task AddToList<T>(string key, T data)
        {
            var jsonData = JsonConvert.SerializeObject(data);
            await _database.ListRightPushAsync(key, jsonData);
        }

        public async Task<T> GetData<T>(string key)
        {
            var jsonData = await _database.StringGetAsync(key);
            return jsonData.IsNullOrEmpty ? default : JsonConvert.DeserializeObject<T>(jsonData);
        }

        public async Task<List<T>> GetListData<T>(string key)
        {
            var data = await _database.ListRangeAsync(key);
            var list = data
                .Select(x => JsonConvert.DeserializeObject<T>(x))
                .Where(x => x != null)
                .ToList();

            return list;
        }

        public async Task RemoveData(string key)
        {
            await _database.KeyDeleteAsync(key);
        }

        public async Task RemoveItemFromList<T>(string key, T item)
        {
            var jsonItem = JsonConvert.SerializeObject(item);

            await _database.ListRemoveAsync(key, jsonItem);
        }
    }
}
