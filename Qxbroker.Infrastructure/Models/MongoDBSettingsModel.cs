namespace Qxbroker.Infrastructure.Models
{
    public class MongoDBSettingsModel
    {
        public string ConnectionURI { get; set; } = null!;

        public string DataBaseName { get; set; } = null!;

        public string UsersCollection { get; set; } = null!;

        public string CurrenciesCollection { get; set; } = null!;

        public string BlacklistCollection { get; set; } = null!;

        public string ConfigCollection { get; set; } = null!;
    }
}
