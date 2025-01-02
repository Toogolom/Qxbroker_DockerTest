namespace Qxbroker.Infrastructure.Provider;

using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

public class EmailBasedUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        var user = connection.User;

        return user?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
    }
}