namespace Qxbroker.Domain.Config
{
    using MongoDB.Bson;
    using MongoDB.Bson.Serialization.Attributes;
    using Qxbroker.Domain.VipStatus;

    public class Config
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public List<VipStatus> VipStatuses { get; set; }

        public int MinWithdrawal { get; set; }

        public int MaxWithdrawal { get; set; }

        public int MinDeposit { get; set; }

        public int MaxDeposit { get; set; }

        public bool IsDepositAgregator { get; set; }

        public List<Bonus> Bonuses { get; set; }

        public Dictionary<string, string> Wallets { get; set; }
    }
}
