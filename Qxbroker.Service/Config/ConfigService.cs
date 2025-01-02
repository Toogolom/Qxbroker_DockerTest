namespace Qxbroker.Service.Config
{
    using Microsoft.IdentityModel.Tokens;
    using QRCoder;
    using Qxbroker.Domain.Config;
    using Qxbroker.Service.Redis;
    using Qxbroker.Service.User;

    public class ConfigService : IConfigService
    {
        private readonly IConfigRepository _configRepository;
        private readonly IRedisService _redisService;
        private readonly IUserService _userService;

        public ConfigService(IConfigRepository configRepository, IRedisService redisService, IUserService userService)
        {
            _configRepository = configRepository;
            _redisService = redisService;
            _userService = userService;
        }

        public async Task<bool> GetIsDepositAgregator()
        {
            var config = await GetConfig();
            return config.IsDepositAgregator;
        }

        public async Task<decimal> GetMinDeposit()
        {
            var config = await GetConfig();
            return config.MinDeposit;
        }

        public async Task<decimal> GetMinWithdrawal()
        {
            var config = await GetConfig();
            return config.MinWithdrawal;
        }

        public async Task<decimal> GetMaxDeposit()
        {
            var config = await GetConfig();
            return config.MaxDeposit;
        }

        public async Task<decimal> GetMaxWithdrawal()
        {
            var config = await GetConfig();
            return config.MaxWithdrawal;
        }

        public async Task<List<Bonus>> GetAllBonuses()
        {
            var config = await GetConfig();
            return config.Bonuses;
        }

        public async Task<Bonus?> GetFirstDepBonus(string email)
        {
            var transaction = await _userService.GetTransactionsByEmail(email);
            if (transaction.IsNullOrEmpty())
            {
                return null;
            }

            var bonuses = await GetAllBonuses();
            var bonus = bonuses.Where(b => b.Code == "BonusForFirstDep").FirstOrDefault();
            return bonus;
        }

        public async Task<Dictionary<string, string>> GetWallets()
        {
            var config = await GetConfig();
            return config.Wallets;
        }

        public async Task<string> GetWalletAddress(string currency)
        {
            var wallets = await GetWallets();
            return wallets[currency.ToUpper()];
        }

        public string GenerateQrCode(string walletAddress)
        {
            using (var qrGenerator = new QRCodeGenerator())
            {
                var qrCodeData = qrGenerator.CreateQrCode(walletAddress, QRCodeGenerator.ECCLevel.Q);
                using (var qrCode = new PngByteQRCode(qrCodeData))
                {
                    byte[] qrCodeImage = qrCode.GetGraphic(20);
                    return "data:image/png;base64," + Convert.ToBase64String(qrCodeImage);
                }
            }
        }

        private async Task<Config> GetConfig()
        {
            var redisKey = "config";
            var cachedConfig = await _redisService.GetData<Config>(redisKey);
            if (cachedConfig != null)
            {
                return cachedConfig;
            }

            var config = await _configRepository.GetConfig();
            await _redisService.SetData(redisKey, config);
            return config;
        }
    }
}
