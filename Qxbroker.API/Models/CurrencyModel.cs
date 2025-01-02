namespace Qxbroker.API.Models
{
    using Qxbroker.Domain.Currency;

    public class CurrencyModel
    {
        public string? Name { get; set; }

        public int ProcentForMin { get; set; }

        public int ProcentForFiveMin { get; set; }

        public CurrencyType CurrencyType { get; set; }

        public bool IsVisible { get; set; }
    }
}