namespace Qxbroker.Service.Email
{
    public interface IEmailService
    {
        public Task SendConfirmationEmail(string toEmail, string token);

        public Task SendRecoveryPasswordEmail(string toEmail, string token);
    }
}
