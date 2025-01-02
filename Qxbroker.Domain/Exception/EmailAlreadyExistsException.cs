namespace Qxbroker.Domain.Exception
{
    using System;

    public class EmailAlreadyExistsException : Exception
    {
        public EmailAlreadyExistsException()
            : base("Email is already in use.")
        {
        }
    }
}
