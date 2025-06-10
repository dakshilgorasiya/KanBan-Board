using KanBanBoard.Data;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _db;

        public AuthRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddUserAsync(UserModel user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task<UserModel?> GetUSerByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
