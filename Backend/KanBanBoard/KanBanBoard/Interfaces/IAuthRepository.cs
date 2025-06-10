using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface IAuthRepository
    {
        public Task<UserModel?> GetUSerByEmailAsync(string email);

        public Task AddUserAsync(UserModel user);

        public Task<UserModel?> GetUserByIdAsync(int userId);

        public Task<bool> SoftDeleteUserAsync(int userId);

        public Task SaveChangesAsync();

        public Task<List<UserModel>> GetAllEmployeesAsync();
    }
}
