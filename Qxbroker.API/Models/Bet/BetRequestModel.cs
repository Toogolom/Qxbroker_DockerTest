namespace Qxbroker.API.Models;

using System.Text.Json.Serialization;
using Qxbroker.Domain.Bet;

public class BetRequestModel
{
    public decimal Amount { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BetType BetType { get; set; }

    public string Pair { get; set; }

    public decimal Time { get; set; }

    public bool IsDemo { get; set; }
}