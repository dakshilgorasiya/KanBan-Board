using KanBanBoard.DTO;

namespace KanBanBoard.Interfaces
{
    public interface ICategoryService
    {
        Task<AddCategoryResponseDTO> AddCategory(AddCategoryRequestDTO categoryDTO);
        Task<DeleteCategoryResponseDTO?> DeleteCategory(int CategoryId);
    }
}
