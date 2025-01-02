namespace Qxbroker.Service.Auth
{
    using Qxbroker.Domain.Token;
    using Qxbroker.Domain.User;

    public interface IAuthService
    {
        public Task<Token> Authentication(string email, string password);

        public Task SendConfirmationEmail(User user);

        public Task<Token> ConfirmEmail(string token);

        public Task SendRecoveryPasswordEmail(string email);

        public Task RecoveryPassword(string token, string password);

        public Token RefreshToken(string refreshToken);

        public bool VerifyPassword(string oldPassword, string newPassword);

        public Task Logout(Token token);
    }
}
