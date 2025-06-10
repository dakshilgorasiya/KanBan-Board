using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KanBanBoard.Model
{
    public class TaskModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TaskId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Id of Task Assign Employee is required")]
        [ForeignKey(nameof(AssignedUser))]
        public int AssignTo { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string? Description { get; set; }

        public bool IsDeleted { get; set; } = false;

        [Required(ErrorMessage = "Current Category of Task is required")]
        [ForeignKey(nameof(CurrentCategory))]
        public int CurrentCategoryId { get; set; }

        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public UserModel? AssignedUser { get; set; }
        public CategoriesModel? CurrentCategory { get; set; }
        public ICollection<TasklogModel>? TaskLogs { get; set; }
    }

}
