namespace Qxbroker.Domain.User
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class Verification
    {
        public string? Name { get; set; }

        public string? Surname { get; set; }

        public string? MobileNumber { get; set; }

        public string? UrlForDocumentImage { get; set; }

        public string? WalletAddress { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public VerificationStatus? Status { get; set; } = VerificationStatus.Unverified;
    }
}
