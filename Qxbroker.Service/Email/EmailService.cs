namespace Qxbroker.Service.Email
{
    using System.Net;
    using System.Net.Mail;
    using Microsoft.Extensions.Options;

    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;

        public EmailService(IOptions<SmtpSettings> smtpSettings)
        {
            _smtpSettings = smtpSettings.Value;
        }

        public async Task SendConfirmationEmail(string toEmail, string token)
        {
            var link = GenerateLink(token, "confirm-email");

            var message = new MailMessage();
            message.From = new MailAddress(_smtpSettings.SenderEmail, "Qxbroker");
            message.To.Add(new MailAddress(toEmail));
            message.Subject = "Confirm your registration";
            message.Body = $@"
        <html>
        <body>
            <p>Please confirm your registration by clicking the button below:</p>
            <a href='{link}' style='
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 5px;
                font-size: 16px;
                '>
                Confirm Registration
            </a>
            <p>If the button doesn't work, please click this link: <a href='{link}'>ссылка</a></p>
        </body>
        </html>";

            message.IsBodyHtml = true;

            using (var client = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port))
            {
                client.Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.SenderPassword);
                client.EnableSsl = true;

                await client.SendMailAsync(message);
            }
        }

        public async Task SendRecoveryPasswordEmail(string toEmail, string token)
        {
            var link = GenerateLink(token, "recovery-password-confirm");

            var message = new MailMessage();
            message.From = new MailAddress(_smtpSettings.SenderEmail, "Qxbroker");
            message.To.Add(new MailAddress(toEmail));
            message.Subject = "Recovery password";

            message.Body = $@"
        <html>
        <body>
            <p>For recovery password by clicking the button below:</p>
            <a href='{link}' style='
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                border-radius: 5px;
                font-size: 16px;
                '>
                Confirm Registration
            </a>
            <p>If the button doesn't work, please click this link: <a href='{link}'>ссылка</a></p>
        </body>
        </html>";

            message.IsBodyHtml = true;

            using (var client = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port))
            {
                client.Credentials = new NetworkCredential(_smtpSettings.SenderEmail, _smtpSettings.SenderPassword);
                client.EnableSsl = true;

                await client.SendMailAsync(message);
            }
        }

        private string GenerateLink(string token, string route)
        {
            var confirmationUrl = $"http://localhost/{route}?&token={token}";

            return confirmationUrl;
        }
    }
}
