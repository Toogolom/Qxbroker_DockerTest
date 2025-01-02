namespace Qxbroker.Service.Token.BlackList
{
    using System.IdentityModel.Tokens.Jwt;
    using System.Threading;
    using Microsoft.Extensions.Hosting;
    using Microsoft.IdentityModel.Tokens;
    using Qxbroker.Domain.Token;
    using Qxbroker.Domain.Token.Blacklist;

    public class TokenBlacklistService : ITokenBlacklistService, IHostedService
    {
        private readonly ITokenBlacklistRepository _tokenBlacklistRepository;
        private HashSet<string> _blacklist = new HashSet<string>();

        public TokenBlacklistService(ITokenBlacklistRepository tokenBlacklistRepository)
        {
            _tokenBlacklistRepository = tokenBlacklistRepository;
        }

        public async Task Initialize()
        {
            _blacklist = await _tokenBlacklistRepository.GetAll();
        }

        public async Task AddToBlacklist(Token token)
        {
            if (token.AccessToken != null)
            {
                _blacklist.Add(token.AccessToken);
            }

            if (token.RefreshToken != null)
            {
                _blacklist.Add(token.RefreshToken);
            }

            await _tokenBlacklistRepository.UpdateBlackList(_blacklist);
            await Task.CompletedTask;
        }

        public async Task<bool> IsTokenBlacklisted(string token)
        {
            if (_blacklist.Contains(token))
            {
                return true;
            }

            return false;
        }

        public async Task CleanupBlacklist()
        {
            foreach (var token in _blacklist)
            {
                if (token.IsNullOrEmpty())
                {
                    continue;
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                if (jwtToken == null)
                {
                    continue;
                }

                var expiryDateUnix = long.Parse(jwtToken.Claims.First(x => x.Type == "exp").Value);
                var expiryDateTime = DateTimeOffset.FromUnixTimeSeconds(expiryDateUnix).UtcDateTime;

                if (expiryDateTime <= DateTime.UtcNow)
                {
                    _blacklist.Remove(token);
                }
            }

            await _tokenBlacklistRepository.UpdateBlackList(_blacklist);
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Initialize();
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await _tokenBlacklistRepository.UpdateBlackList(_blacklist);
        }
    }
}
