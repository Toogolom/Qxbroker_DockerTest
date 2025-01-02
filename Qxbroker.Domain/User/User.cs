namespace Qxbroker.Domain.User
{
    using System.Text.Json.Serialization;
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.Transactions;
    using Qxbroker.Domain.VipStatus;

    public class User
    {
        private decimal _demoBalance;

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? UID { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public string? Name { get; set; }

        public string? Surname { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string? Country { get; set; }

        public string? Currency { get; set; } = "USD";

        public string? Address { get; set; }

        public decimal TotalBalance { get; set; }

        public decimal DemoBalance
        {
            get => _demoBalance;
            set => _demoBalance = value <= 0 ? 10000 : value;
        }

        public decimal CashOutAmount { get; set; }

        public List<Bet> BetHistory { get; set; } = new List<Bet>();

        public HashSet<string> Referals { get; set; } = new HashSet<string>();

        public string? PromoCode { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public Role Role { get; set; } = Role.User;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        [BsonRepresentation(BsonType.String)]
        public Status VipStatus { get; set; } = Status.Standart;

        public string? URLProfileImage { get; set; }

        public List<Transaction> Transactions { get; set; } = new List<Transaction> { };

        public Verification Verification { get; set; } = new Verification();
    }
}
