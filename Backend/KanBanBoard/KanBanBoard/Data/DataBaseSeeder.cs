using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Data
{
    public class DatabaseSeeder
    {
        public static void Seed(AppDbContext context)
        {
            // Ensure db is created
            context.Database.Migrate();

            if(!context.Users.Any(u => u.UserName == "admin"))
            {
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword("admin");

                var adminUser = new UserModel
                {
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    Password = hashedPassword,
                    Role = UserRole.Admin,
                };

                context.Users.Add(adminUser);
                context.SaveChanges();
            }
        }
    }
}
