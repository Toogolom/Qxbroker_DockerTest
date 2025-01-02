namespace Qxbroker.Domain.Exception
{
    using System;

    public class InsufficientFundsException : Exception
    {
        public InsufficientFundsException()
            : base("Insufficient funds.")
        {
        }
    }
}
