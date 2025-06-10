using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KanBanBoard.Model
{
    public class CategoriesModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Category Name is Required")]
        public string? CategoryName { get; set; }

        public bool IsDeleted { get; set; } = false;

        // Navigation Properties
        public ICollection<TaskModel>? Tasks { get; set; }
        public ICollection<TasklogModel>? FromLogs { get; set; }
        public ICollection<TasklogModel>? ToLogs { get; set; }
    }

}
