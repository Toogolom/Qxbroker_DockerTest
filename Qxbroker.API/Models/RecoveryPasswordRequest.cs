namespace Qxbroker.API.Models
{
    public class RecoveryPasswordRequest
    {
        public required string Password { get; set; }

        public required string Token { get; set; }
    }
}
