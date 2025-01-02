namespace Qxbroker.Infrastructure.Repository
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Options;
    using MongoDB.Bson;
    using MongoDB.Driver;
    using Qxbroker.Domain.Bet;
    using Qxbroker.Domain.Exception;
    using Qxbroker.Domain.User;
    using Qxbroker.Infrastructure.Models;

    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UserRepository(IOptions<MongoDBSettingsModel> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DataBaseName);
            _usersCollection = database.GetCollection<User>(mongoDBSettings.Value.UsersCollection);
        }

        public async Task AddUser(User user)
        {
            await _usersCollection.InsertOneAsync(user);
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _usersCollection.Find(new BsonDocument()).ToListAsync();
        }

        public async Task<User> GetByUserId(string id)
        {
            var user = await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new NotFoundException();
            }

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();

            return user;
        }

        public async Task UpdateUserData(string email, string name, string surname, DateOnly dateOfBirth, string country, string address)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            var update = Builders<User>.Update
                .Set(u => u.Name, name)
                .Set(u => u.Surname, surname)
                .Set(u => u.DateOfBirth, dateOfBirth)
                .Set(u => u.Country, country)
                .Set(u => u.Address, address);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task ChangePassword(string email, string password)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            var update = Builders<User>.Update
                .Set(u => u.Password, password);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task DeleteUser(string email)
        {
            var result = await _usersCollection.DeleteOneAsync(u => u.Email == email);
            if (result.DeletedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task UpdateUser(User user)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, user.Email);
            var result = await _usersCollection.ReplaceOneAsync(filter, user);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task UpdateUserImage(string email, string imageUrl)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);
            var update = Builders<User>.Update
                .Set(u => u.URLProfileImage, imageUrl);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task ChangeUsertoRefavod(string email, string promokode)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);

            var update = Builders<User>.Update
                .Set(u => u.Role, Role.Refavod)
                .Set(u => u.PromoCode, promokode);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task UpdateUserBalance(string email, decimal totalBalance)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);

            var update = Builders<User>.Update
                .Set(u => u.TotalBalance, totalBalance);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task UpdateUserDemoBalance(string email, decimal demoBalance)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Email, email);

            var update = Builders<User>.Update
                .Set(u => u.DemoBalance, demoBalance);

            var result = await _usersCollection.UpdateOneAsync(filter, update);
            if (result.MatchedCount == 0)
            {
                throw new NotFoundException();
            }
        }

        public async Task<bool> EmailIsEnable(string email)
        {
            var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync();

            return user == null;
        }

        public async Task AddReferal(string referalEmail, string promocode)
        {
            var refavod = await _usersCollection.Find(u => u.PromoCode == promocode).FirstOrDefaultAsync();

            if (refavod == null)
            {
                throw new NotFoundException();
            }

            if (refavod.Referals.Any())
            {
                refavod.Referals = new HashSet<string>();
            }

            refavod.Referals.Add(referalEmail);

            await UpdateUser(refavod);
        }

        public async Task<bool> UIDIsEnable(string uid)
        {
            return await _usersCollection.Find(u => u.UID == uid).AnyAsync();
        }

        public async Task<List<Bet>> GetHistoryBet(string email)
        {
            var user = await GetUserByEmail(email);

            if (user == null)
            {
                throw new NotFoundException();
            }

            return user.BetHistory;
        }
    }
}
