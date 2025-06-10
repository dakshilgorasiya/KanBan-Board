using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KanBanBoard.Model
{
    public class TasklogModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LogId { get; set; }

        [Required(ErrorMessage = "Task ID is required.")]
        [ForeignKey(nameof(Task))]
        public int TaskID { get; set; }

        [Required(ErrorMessage = "MovedBy (user ID) is required.")]
        [ForeignKey(nameof(User))]
        public int MovedBy { get; set; }

        [Required(ErrorMessage = "From category is required.")]
        [ForeignKey(nameof(FromCategory))]
        public int FromCategoryId { get; set; }

        [Required(ErrorMessage = "To category is required.")]
        [ForeignKey(nameof(ToCategory))]
        public int ToCategoryId { get; set; }

        public DateTime? MovedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public TaskModel? Task { get; set; }
        public UserModel? User { get; set; }
        public CategoriesModel? FromCategory { get; set; }
        public CategoriesModel? ToCategory { get; set; }
    }

}
