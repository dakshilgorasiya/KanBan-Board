using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KanBanBoard.Model
{
    public class UserModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "User name is required.")]
        public string? UserName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        public UserRole? Role { get; set; }

        public bool IsDeleted { get; set; } = false;

        // Navigation Properties
        public ICollection<TaskModel>? AssignedTasks { get; set; } // 1 user -> many tasks
        public ICollection<TasklogModel>? MovedLogs { get; set; }  // 1 user -> many tasklogs
    }


    public enum UserRole
    {
        Employee,
        Admin
    }
}
