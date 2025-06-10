using System.ComponentModel.DataAnnotations;

namespace KanBanBoard.DTO
{
    public class AddCategoryRequestDTO
    {
        [Required(ErrorMessage = "Category name is required")]
        public string? CategoryName { get; set; }
    }
    
    public class AddCategoryResponseDTO
    {
        public int CategoryId { get; set; }

        public string? CategoryName { get; set; }
    }

    public class DeleteCategoryResponseDTO
    {
        public int CategoryId { get; set; }

        public string? CategoryName { get; set; }
    }
}
