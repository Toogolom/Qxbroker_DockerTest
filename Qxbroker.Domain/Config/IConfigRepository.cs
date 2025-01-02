namespace Qxbroker.Domain.Config
{
    public interface IConfigRepository
    {
        public Task<Config> GetConfig();

        public Task UpdateConfig(Config config);
    }
}
