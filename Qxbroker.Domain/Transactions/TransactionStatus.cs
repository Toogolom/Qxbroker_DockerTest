namespace Qxbroker.Domain.Transactions
{
    public enum TransactionStatus
    {
        Waiting = 0,
        Confirmation = 1,
        Success = 2,
        Failed = 3,
        Cancel = 4,
    }
}
