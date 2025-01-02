namespace Qxbroker.Service.VipStatus
{
    using Qxbroker.Domain.Config;
    using Qxbroker.Domain.VipStatus;
    using Qxbroker.Service.Redis;

    public class VipStatusService : IVipStatusService
    {
        private readonly IConfigRepository _configRepository;
        private IRedisService _redisService;

        public VipStatusService(IConfigRepository configRepository, IRedisService redisService)
        {
            _configRepository = configRepository;
            _redisService = redisService;
        }

        public async Task AddVipStatus(VipStatus vipStatus)
        {
            var vipStatusesList = await GetStatuses();
            vipStatusesList.Add(vipStatus);
            var redisKey = "config";
            var config = await _redisService.GetData<Config>(redisKey);
            config.VipStatuses = vipStatusesList;
            await _redisService.SetData(redisKey, config);
            await _configRepository.UpdateConfig(config);
        }

        public async Task DeleteVipStatus(Status status)
        {
            var vipStatusesList = await GetStatuses();

            var statusToRemove = vipStatusesList.FirstOrDefault(vs => vs.Key == status);
            if (statusToRemove != null)
            {
                vipStatusesList.Remove(statusToRemove);
                var redisKey = "config";
                var config = await _configRepository.GetConfig();
                config.VipStatuses = vipStatusesList;

                await _redisService.SetData(redisKey, config);
                await _configRepository.UpdateConfig(config);
            }
        }

        public async Task<List<VipStatus>> GetStatuses()
        {
            var redisKey = "config";
            var cachedConfig = await _redisService.GetData<Config>(redisKey);
            if (cachedConfig != null)
            {
                return cachedConfig.VipStatuses;
            }

            var config = await _configRepository.GetConfig();
            await _redisService.SetData(redisKey, config);

            return config.VipStatuses;
        }

        public async Task UpdateVipStatusRange(Status key, decimal newDepositFrom, decimal newDepositTo)
        {
            if (newDepositFrom < 0 || newDepositTo < 0 || newDepositFrom >= newDepositTo)
            {
                throw new ArgumentException("Invalid deposit range values.");
            }

            var vipStatuses = await GetStatuses();

            var vipStatus = vipStatuses.FirstOrDefault(s => s.Key == key);

            var config = await _configRepository.GetConfig();

            if (vipStatus == null)
            {
                throw new KeyNotFoundException($"VIP status with key '{key}' not found.");
            }

            foreach (var status in config.VipStatuses)
            {
                if (status.Key != key)
                {
                    if (!(newDepositTo <= status.DepositBalanceFrom || newDepositFrom >= status.DepositBalanceTo))
                    {
                        throw new InvalidOperationException(
                            $"New range ({newDepositFrom} - {newDepositTo}) overlaps with the range of '{status.Name}' ({status.DepositBalanceFrom} - {status.DepositBalanceTo}).");
                    }
                }
            }

            vipStatus.DepositBalanceFrom = newDepositFrom;
            vipStatus.DepositBalanceTo = newDepositTo;

            await _configRepository.UpdateConfig(config);

            var redisKey = "config";
            await _redisService.SetData(redisKey, config);
        }
    }
}
