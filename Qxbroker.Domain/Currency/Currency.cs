namespace Qxbroker.Domain.Currency
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class Currency
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Name { get; set; }

        public string? Code { get; set; }

        public int ProcentForMin { get; set; }

        public int ProcentForFiveMin { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public CurrencyType CurrencyType { get; set; }

        public bool IsVisible { get; set; } = true;
    }
}
