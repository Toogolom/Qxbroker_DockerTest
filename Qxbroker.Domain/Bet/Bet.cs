namespace Qxbroker.Domain.Bet
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class Bet
    {
        public string? Id { get; set; }

        public decimal Amount { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public BetType BetType { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public BetStatus Status { get; set; }

        public string? Pair { get; set; }

        public int? Percent { get; set; }

        public DateTime OpenTime { get; set; }

        public DateTime CloseTime { get; set; }

        public decimal OpenPrice { get; set; }

        public decimal? ClosePrice { get; set; }

        public decimal Income { get; set; }

        public decimal Duration { get; set; }

        public bool IsDemo { get; set; }
    }
}
