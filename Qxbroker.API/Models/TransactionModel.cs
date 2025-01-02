namespace Qxbroker.API.Models
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    using Qxbroker.Domain.Transactions;

    public class TransactionModel
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public TransactionType Type { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public PaymentSystem? PaymentSystem { get; set; }

        public decimal Amount { get; set; }
    }
}
