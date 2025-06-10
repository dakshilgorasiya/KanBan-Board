using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface ICategoryRepository
    {
        Task<CategoriesModel> AddCategory(CategoriesModel category);
        Task<CategoriesModel?> DeleteCategory(int id);
        Task<List<CategoriesModel>> GetAllCategories();
        Task<bool> IsCategoryExists(int id);
    }
}
