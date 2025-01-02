namespace Qxbroker.Service.Token
{
    using Qxbroker.Domain.Token;
    using Qxbroker.Domain.User;

    public interface ITokenService
    {
        public Token GetToken(User user);

        public string GetEmailByToken(string token);

        public Token RefreshToken(string refreshToken);
    }
}
