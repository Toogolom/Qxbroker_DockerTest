namespace Qxbroker.Service.Auth
{
    using Qxbroker.Domain.Exception;
    using Qxbroker.Domain.Token;
    using Qxbroker.Domain.User;
    using Qxbroker.Service.Email;
    using Qxbroker.Service.Session;
    using Qxbroker.Service.Token;
    using Qxbroker.Service.Token.BlackList;

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly ITokenBlacklistService _blacklistService;
        private readonly IEmailService _emailService;
        private readonly ISessionService _sessionService;

        public AuthService(IUserRepository userRepository, ITokenService tokenService, IEmailService emailService, ISessionService sessionService, ITokenBlacklistService blacklistService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _emailService = emailService;
            _sessionService = sessionService;
            _blacklistService = blacklistService;
        }

        public async Task<Token> Authentication(string email, string password)
        {
            var user = await _userRepository.GetUserByEmail(email);

            if (user == null || !VerifyPassword(password, user.Password))
            {
                throw new InvalidCredentialsException();
            }

            return _tokenService.GetToken(user);
        }

        public async Task<Token> ConfirmEmail(string token)
        {
            var email = _tokenService.GetEmailByToken(token);
            var user = _sessionService.Get<User>($"PasswordFor{email}");

            await _userRepository.AddUser(user);
            Token token1 = new Token()
            {
                AccessToken = token,
            };
            await _blacklistService.AddToBlacklist(token1);

            return _tokenService.GetToken(user);
        }

        public async Task RecoveryPassword(string token, string password)
        {
            var email = _tokenService.GetEmailByToken(token);

            string hashPass = HashPassword(password);

            await _userRepository.ChangePassword(email, hashPass);

            Token token1 = new Token()
            {
                AccessToken = token,
            };
            await _blacklistService.AddToBlacklist(token1);
        }

        public Token RefreshToken(string refreshToken)
        {
            return _tokenService.RefreshToken(refreshToken);
        }

        public async Task SendConfirmationEmail(User user)
        {
            if (!await _userRepository.EmailIsEnable(user.Email))
            {
                throw new EmailAlreadyExistsException();
            }

            user.Password = HashPassword(user.Password);

            _sessionService.Set<User>($"PasswordFor{user.Email}", user);

            var token = _tokenService.GetToken(user);
            await _emailService.SendConfirmationEmail(user.Email, token.AccessToken);
        }

        public async Task SendRecoveryPasswordEmail(string email)
        {
            if (await _userRepository.EmailIsEnable(email))
            {
                throw new NotFoundException();
            }

            User user = new User()
            {
                Email = email,
            };

            var token = _tokenService.GetToken(user);

            await _emailService.SendRecoveryPasswordEmail(user.Email, token.AccessToken);
        }

        public bool VerifyPassword(string password, string hashPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashPassword);
        }

        public async Task Logout(Token token)
        {
            await _blacklistService.AddToBlacklist(token);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
