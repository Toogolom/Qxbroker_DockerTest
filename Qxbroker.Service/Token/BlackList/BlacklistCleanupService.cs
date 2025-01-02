namespace Qxbroker.Service.Token.BlackList
{
    using Microsoft.Extensions.Hosting;

    public class BlacklistCleanupService : BackgroundService
    {
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromMinutes(10);
        private readonly ITokenBlacklistService _blacklistService;

        public BlacklistCleanupService(ITokenBlacklistService blacklistService)
        {
            _blacklistService = blacklistService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await _blacklistService.CleanupBlacklist();
                await Task.Delay(_cleanupInterval, stoppingToken);
            }
        }
    }
}
