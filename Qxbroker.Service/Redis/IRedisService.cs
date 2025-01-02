namespace Qxbroker.Service.Redis
{
    public interface IRedisService
    {
        public Task SetData<T>(string key, T data, TimeSpan? expiration = null);

        public Task SetListData<T>(string key, List<T> list, TimeSpan? expiration = null);

        public Task AddToList<T>(string key, T data);

        public Task<T> GetData<T>(string key);

        public Task<List<T>> GetListData<T>(string key);

        public Task RemoveData(string key);

        public Task RemoveItemFromList<T>(string key, T item);
    }
}
