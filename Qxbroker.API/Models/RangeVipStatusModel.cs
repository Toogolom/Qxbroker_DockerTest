namespace Qxbroker.API.Models
{
    using Qxbroker.Domain.VipStatus;

    public class RangeVipStatusModel
    {
        public Status Key { get; set; }

        public decimal NewDepositFrom { get; set; }

        public decimal NewDepositTo { get; set; }
    }
}
