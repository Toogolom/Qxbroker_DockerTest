namespace Qxbroker.API.Models
{
    public class UserDataModel
    {
        public string? Name { get; set; }

        public string? Surname { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string? Country { get; set; }

        public string? Address { get; set; }
    }
}
