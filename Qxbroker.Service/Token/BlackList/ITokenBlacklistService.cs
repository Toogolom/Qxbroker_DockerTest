namespace Qxbroker.Service.Token.BlackList
{
    using Qxbroker.Domain.Token;

    public interface ITokenBlacklistService
    {
        public Task AddToBlacklist(Token token);

        public Task<bool> IsTokenBlacklisted(string token);

        public Task CleanupBlacklist();
    }
}
