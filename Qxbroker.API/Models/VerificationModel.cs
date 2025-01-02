namespace Qxbroker.API.Models
{
    public class VerificationModel
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string WalletAddress { get; set; }

        public string MobileNumber { get; set; }

        public IFormFile File { get; set; }
    }
}
