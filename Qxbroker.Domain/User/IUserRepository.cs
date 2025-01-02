namespace Qxbroker.Domain.User
{
    using Qxbroker.Domain.Bet;

    public interface IUserRepository
    {
        public Task<List<User>> GetAllUsers();

        public Task<User> GetByUserId(string id);

        public Task<User> GetUserByEmail(string email);

        public Task<List<Bet>> GetHistoryBet(string email);

        public Task AddUser(User user);

        public Task AddReferal(string referalEmail, string promocode);

        public Task UpdateUser(User user);

        public Task UpdateUserImage(string email, string imageUrl);

        public Task UpdateUserData(string email, string name, string surname, DateOnly dateOfBirth, string country, string address);

        public Task ChangePassword(string email,  string password);

        public Task ChangeUsertoRefavod(string email, string promokode);

        public Task UpdateUserBalance(string email, decimal balance);

        public Task UpdateUserDemoBalance(string email, decimal demobalance);

        public Task<bool> EmailIsEnable(string email);

        public Task<bool> UIDIsEnable(string uid);

        public Task DeleteUser(string email);
    }
}
