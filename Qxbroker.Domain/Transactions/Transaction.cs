namespace Qxbroker.Domain.Transactions
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class Transaction
    {
        public string? Id { get; set; }

        public DateTime DateAndTime { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public TransactionStatus Status { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public TransactionType Type { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public PaymentSystem? PaymentSystem { get; set; }

        public decimal Amount { get; set; }

        public string? ConfirmationPaymentUrl { get; set; }

        public string? JobId { get; set; }
    }
}
