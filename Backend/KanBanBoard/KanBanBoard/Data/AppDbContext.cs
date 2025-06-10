using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; }

        public DbSet<TaskModel> Tasks { get; set; }

        public DbSet<CategoriesModel> Categories { get; set; }

        public DbSet<TasklogModel> Tasklog { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CategoriesModel>().HasQueryFilter(c => !c.IsDeleted);

            modelBuilder.Entity<TaskModel>().HasQueryFilter(t => !t.IsDeleted);
        }
    }
}
