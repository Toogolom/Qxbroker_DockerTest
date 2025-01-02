namespace Qxbroker.API.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Qxbroker.API.Models;
    using Qxbroker.Domain.Token;
    using Qxbroker.Domain.User;
    using Qxbroker.Service.Auth;
    using Qxbroker.Service.User;
    using Swashbuckle.AspNetCore.Annotations;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(IAuthService authService, IUserService userService, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("send-confirm-email")]
        [SwaggerOperation(Summary = "Отправка на почту ссылки для подтверждения")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(409, "Conflict")]
        public async Task<IActionResult> SendConfirmationEmail([FromBody] RegModel model)
        {
            User user = new User
            {
                Email = model.Email,
                Password = model.Password,
                Country = model.Country,
                Currency = model.Currency,
                UID = await _userService.GenerateUID(),
            };

            await _authService.SendConfirmationEmail(user);

            return Ok();
        }

        [HttpPost("confirm-email")]
        [Authorize]
        [SwaggerOperation(Summary = "Получить токен при подтверждение почты")]
        [SwaggerResponse(401, "Invalid token")]
        public async Task<IActionResult> ConfirmEmail()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var authHeader = httpContext.Request.Headers["Authorization"].ToString();
            var tokenAuth = authHeader.StartsWith("Bearer ") ? authHeader.Substring("Bearer ".Length).Trim() : authHeader;
            var token = await _authService.ConfirmEmail(tokenAuth);
            return Ok(token);
        }

        [HttpPost("login")]
        [SwaggerOperation(Summary = "Аутентификация пользователя")]
        [SwaggerResponse(401, "Invalid credentials")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var token = await _authService.Authentication(model.Email, model.Password);
            return Ok(token);
        }

        [HttpPost("refresh")]
        [SwaggerOperation(Summary = "Обновление токена")]
        [SwaggerResponse(401, "Invalid token")]
        public IActionResult Refresh([FromBody] RefreshTokenRequest request)
        {
            var newToken = _authService.RefreshToken(request.RefreshToken);
            return Ok(newToken);
        }

        [HttpPost("send-recovery-password-email")]
        [SwaggerOperation(Summary = "Отправка на почту ссылки для сброса пароля")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(404, "User not found")]
        public async Task<IActionResult> SendRecoveryPasswordEmail([FromBody] SendRecoveryPasswordRequestModel request)
        {
            await _authService.SendRecoveryPasswordEmail(request.Email);
            return Ok();
        }

        [HttpPost("recovery-password")]
        [SwaggerOperation(Summary = "Смена пароля после сброса")]
        [SwaggerResponse(200, "Success.")]
        [SwaggerResponse(404, "User not found")]
        public async Task<IActionResult> RecoveryPassword(RecoveryPasswordRequest request)
        {
            await _authService.RecoveryPassword(request.Token, request.Password);
            return Ok();
        }

        [HttpPost("logout")]
        [Authorize]
        [SwaggerOperation(Summary = "Завершение сессии")]
        [SwaggerResponse(200, "Success.")]
        public async Task<IActionResult> Logout(Token token)
        {
            await _authService.Logout(token);
            return Ok();
        }
    }
}
