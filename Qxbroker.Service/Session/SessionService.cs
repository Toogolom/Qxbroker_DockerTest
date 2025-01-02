namespace Qxbroker.Service.Session
{
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;

    public class SessionService : ISessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SessionService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void Set<T>(string key, T value)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public T Get<T>(string key)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            var value = session.GetString(key);

            return value == null ? default : JsonConvert.DeserializeObject<T>(value);
        }

        public void Remove(string key)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            session.Remove(key);
        }
    }
}
