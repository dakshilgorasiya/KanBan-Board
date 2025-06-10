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
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<UserModel?> GetUserByIdAsync(int userId)
        {
            return await _db.Users
                .Where(u => u.UserId == userId && !u.IsDeleted)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> SoftDeleteUserAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user != null && !user.IsDeleted)
            {
                user.IsDeleted = true;
                await _db.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task<List<UserModel>> GetAllEmployeesAsync()
        {
            return await _db.Users
                .Where(u => !u.IsDeleted && u.Role == UserRole.Employee)
                .OrderBy(u => u.UserId)
                .ToListAsync();
        }
    }
}
