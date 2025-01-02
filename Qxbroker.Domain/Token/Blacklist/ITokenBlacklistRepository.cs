namespace Qxbroker.Domain.Token.Blacklist
{
    public interface ITokenBlacklistRepository
    {
        public Task<HashSet<string>> GetAll();

        public Task UpdateBlackList(HashSet<string> blackList);
    }
}
