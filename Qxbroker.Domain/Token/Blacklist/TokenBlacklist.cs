namespace Qxbroker.Domain.Token.Blacklist
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;

    public class TokenBlacklist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public List<string> Tokens { get; set; }
    }
}
