namespace Qxbroker.Service.Bet
{
    using Qxbroker.Domain.Bet;

    public interface IBetService
    {
        public Task<List<Bet>> GetAllBetByEmail(string email, bool isDemo);

        public Task<List<Bet>> GetAllBetByDate(string email, DateOnly startdate, DateOnly endDate, bool isDemo);

        public Task<List<Bet>> GetAllInProceedBetByEmail(string email, bool isDemo);

        public Task OpenBet(Bet bet, string email);
    }
}
