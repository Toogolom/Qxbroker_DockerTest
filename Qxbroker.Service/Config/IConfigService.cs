namespace Qxbroker.Service.Config
{
    using Qxbroker.Domain.Config;

    public interface IConfigService
    {
        public Task<decimal> GetMinDeposit();

        public Task<decimal> GetMinWithdrawal();

        public Task<decimal> GetMaxDeposit();

        public Task<decimal> GetMaxWithdrawal();

        public Task<List<Bonus>> GetAllBonuses();

        public Task<Bonus?> GetFirstDepBonus(string email);

        public Task<bool> GetIsDepositAgregator();

        public Task<Dictionary<string, string>> GetWallets();

        public Task<string> GetWalletAddress(string currency);

        public string GenerateQrCode(string walletAddress);
    }
}
