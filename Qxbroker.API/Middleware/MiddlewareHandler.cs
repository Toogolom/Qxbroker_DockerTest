namespace Qxbroker.API.Middleware
{
    using System.Net;
    using Newtonsoft.Json;
    using Qxbroker.Domain.Exception;

    public class MiddlewareHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<MiddlewareHandler> _logger;

        public MiddlewareHandler(RequestDelegate next, ILogger<MiddlewareHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            switch (exception)
            {
                case InvalidCredentialsException:
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = exception.Message,
                    }));

                case EmailAlreadyExistsException:
                    context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = exception.Message,
                    }));

                case NotFoundException:
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = exception.Message,
                    }));

                case InsufficientFundsException:
                    context.Response.StatusCode = (int)HttpStatusCode.PaymentRequired;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = exception.Message,
                    }));

                case InvalidImageException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = exception.Message,
                    }));

                default:
                    _logger.LogError(exception, "An unexpected error occurred");
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    return context.Response.WriteAsync(JsonConvert.SerializeObject(new
                    {
                        error = "An unexpected error occurred. Please try again later.",
                    }));
            }
        }
    }
}
