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

            // Seed admin user
            if(!context.Users.Any(u => u.UserName == "admin"))
            {
                string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword("admin");

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

            // seed first three category
            if(!context.Categories.Any(c => c.CategoryName == "Todo"))
            {
                var category = new CategoriesModel
                {
                    CategoryName = "Todo"
                };
                context.Categories.Add(category);
                context.SaveChanges();
            }
            if (!context.Categories.Any(c => c.CategoryName == "In Progress"))
            {
                var category = new CategoriesModel
                {
                    CategoryName = "In Progress"
                };
                context.Categories.Add(category);
                context.SaveChanges();
            }
            if (!context.Categories.Any(c => c.CategoryName == "Done"))
            {
                var category = new CategoriesModel
                {
                    CategoryName = "Done"
                };
                context.Categories.Add(category);
                context.SaveChanges();
            }
        }
    }
}
