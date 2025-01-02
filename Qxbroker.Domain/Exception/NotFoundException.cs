namespace Qxbroker.Domain.Exception
{
    using System;

    public class NotFoundException : Exception
    {
        public NotFoundException()
            : base("Not found.")
        {
        }
    }
}
