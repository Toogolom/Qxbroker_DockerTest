namespace Qxbroker.Domain.VipStatus
{
    public enum Status
    {
        None = 0,
        Start = 1,
        Standart = 2,
        Premium = 3,
        Vip = 4,
    }

    public class VipStatus
    {
        public Status Key { get; set; }

        public required string Name { get; set; }

        // Greater value -> More important VipStatus
        public int Importance { get; set; }

        public decimal DepositBalanceFrom { get; set; }

        public decimal DepositBalanceTo { get; set; }

        // TODO: Может и не нужно
        public List<Advantage> Advantages { get; set; } = [];
    }
}
