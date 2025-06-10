using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface IAuthRepository
    {
        public Task<UserModel?> GetUSerByEmailAsync(string email);

        public Task AddUserAsync(UserModel user);
    }
}
