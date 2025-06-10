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

            // TaskModel -> UserModel (AssignTo)
            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.AssignedUser)
                .WithMany(u => u.AssignedTasks)
                .HasForeignKey(t => t.AssignTo)
                .OnDelete(DeleteBehavior.Restrict);

            // TaskModel -> CategoriesModel (CurrentCategory)
            modelBuilder.Entity<TaskModel>()
                .HasOne(t => t.CurrentCategory)
                .WithMany(c => c.Tasks)
                .HasForeignKey(t => t.CurrentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // TasklogModel -> TaskModel
            modelBuilder.Entity<TasklogModel>()
                .HasOne(tl => tl.Task)
                .WithMany(t => t.TaskLogs)
                .HasForeignKey(tl => tl.TaskID)
                .OnDelete(DeleteBehavior.Cascade);

            // TasklogModel -> UserModel (MovedBy)
            modelBuilder.Entity<TasklogModel>()
                .HasOne(tl => tl.User)
                .WithMany(u => u.MovedLogs)
                .HasForeignKey(tl => tl.MovedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // TasklogModel -> CategoriesModel (FromCategory)
            modelBuilder.Entity<TasklogModel>()
                .HasOne(tl => tl.FromCategory)
                .WithMany(c => c.FromLogs)
                .HasForeignKey(tl => tl.FromCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // TasklogModel -> CategoriesModel (ToCategory)
            modelBuilder.Entity<TasklogModel>()
                .HasOne(tl => tl.ToCategory)
                .WithMany(c => c.ToLogs)
                .HasForeignKey(tl => tl.ToCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
