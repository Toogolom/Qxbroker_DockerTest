using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Hangfire;
using Hangfire.Redis.StackExchange;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using Qxbroker.API.HubConfig;
using Qxbroker.API.Middleware;
using Qxbroker.Domain.Config;
using Qxbroker.Domain.Currency;
using Qxbroker.Domain.HubConfig;
using Qxbroker.Domain.Token.Blacklist;
using Qxbroker.Domain.User;
using Qxbroker.Infrastructure.Models;
using Qxbroker.Infrastructure.Repository;
using Qxbroker.Service.Auth;
using Qxbroker.Service.Bet;
using Qxbroker.Service.BinanceWebSocket;
using Qxbroker.Service.Config;
using Qxbroker.Service.Currency;
using Qxbroker.Service.Email;
using Qxbroker.Service.Redis;
using Qxbroker.Service.Session;
using Qxbroker.Service.Token;
using Qxbroker.Service.Token.BlackList;
using Qxbroker.Service.User;
using Qxbroker.Service.VipStatus;
using Serilog;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDBSettingsModel>(builder.Configuration.GetSection("MongoDB"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<IConfigRepository, ConfigRepository>();
builder.Services.AddSingleton<ITokenBlacklistRepository, TokenBlacklistRepository>();

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<IBinanceWebSocketService, BinanceWebSocketService>();
builder.Services.AddScoped<IBetService, BetService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();
builder.Services.AddScoped<IVipStatusService, VipStatusService>();
builder.Services.AddScoped<IConfigService, ConfigService>();

var redis = ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis"));
builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
builder.Services.AddScoped<IRedisService, RedisService>();

builder.Services.AddSingleton<ITokenBlacklistService, TokenBlacklistService>();
builder.Services.AddSingleton<IHostedService>(sp => (TokenBlacklistService)sp.GetRequiredService<ITokenBlacklistService>());
builder.Services.AddSingleton<IHostedService, BlacklistCleanupService>();

builder.Services.AddHangfire(configuration =>
{
    configuration.UseRedisStorage(builder.Configuration.GetConnectionString("Redis"), new RedisStorageOptions
    {
        Db = 0,
        Prefix = "hangfire:",
        ExpiryCheckInterval = TimeSpan.FromMinutes(2),
        FetchTimeout = TimeSpan.FromSeconds(10),
    })
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_170);
});

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = Environment.ProcessorCount * 4;
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var tokenBlacklistService = context.HttpContext.RequestServices.GetRequiredService<ITokenBlacklistService>();
            var token = context.HttpContext.Request.Headers["Authorization"].ToString().Split(" ").Last();
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            if (await tokenBlacklistService.IsTokenBlacklisted(token))
            {
                context.Fail("Token is blacklisted");
            }

            var email = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (!string.IsNullOrEmpty(email))
            {
                context.HttpContext.Items["email"] = email;
            }
        },
    };
});

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API",
        Version = "v1",
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                },
            },
            new string[] { }
        },
    });
    options.EnableAnnotations();
});

builder.Logging.ClearProviders();
Log.Logger = new LoggerConfiguration()
    .WriteTo.File(
        path: "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: 10 * 1024 * 1024,
        retainedFileCountLimit: 7,
        rollOnFileSizeLimit: true)
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        options.AddPolicy("CorsPolicy", builder => builder
                    .WithOrigins("http://localhost", "http://localhost:80", "http://83.217.214.137")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
    });
});

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseDefaultFiles();

app.UseCors("CorsPolicy");

app.UseRouting();

app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

// app.UseHttpsRedirection();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<MiddlewareHandler>();
app.UseHangfireDashboard();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<DataHub>("/data");
    endpoints.MapHub<BetHub>("/betHub");
});

var staticFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(staticFilesPath),
    RequestPath = "/StaticFiles",
});
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();