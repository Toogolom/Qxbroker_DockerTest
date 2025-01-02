namespace Qxbroker.Domain.Exception
{
    using System;

    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException()
            : base("Invalid email or password.")
        {
        }
    }
}
