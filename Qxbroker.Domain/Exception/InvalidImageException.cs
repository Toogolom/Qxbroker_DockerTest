namespace Qxbroker.Domain.Exception
{
    using System;

    public class InvalidImageException : Exception
    {
        public InvalidImageException()
            : base("Invalid file type or File size exceeds the 5 MB limit.")
        {
        }
    }
}
