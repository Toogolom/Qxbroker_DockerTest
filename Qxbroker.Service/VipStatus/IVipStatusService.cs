namespace Qxbroker.Service.VipStatus
{
    using Qxbroker.Domain.VipStatus;

    public interface IVipStatusService
    {
        public Task<List<VipStatus>> GetStatuses();

        public Task AddVipStatus(VipStatus vipStatus);

        public Task UpdateVipStatusRange(Status key, decimal newDepositFrom, decimal newDepositTo);

        public Task DeleteVipStatus(Status status);
    }
}
