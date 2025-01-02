namespace Qxbroker.Service.Session
{
    public interface ISessionService
    {
        void Set<T>(string key, T value);

        T Get<T>(string key);

        void Remove(string key);
    }
}
