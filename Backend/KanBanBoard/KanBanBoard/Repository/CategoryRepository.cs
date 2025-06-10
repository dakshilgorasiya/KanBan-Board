using KanBanBoard.Data;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CategoriesModel> AddCategory(CategoriesModel category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<CategoriesModel?> DeleteCategory(int id)
        {
            CategoriesModel? categoryToDelete = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == id && c.IsDeleted == false);

            if (categoryToDelete != null)
            {
                categoryToDelete.IsDeleted = true;
                await _context.SaveChangesAsync();
                return categoryToDelete;
            }
            else
            {
                return null;
            }
        }

        public async Task<List<CategoriesModel>> GetAllCategories()
        {
            List<CategoriesModel> categories = await _context.Categories.Where(c => c.IsDeleted == false).ToListAsync();
            return categories;
        }

        public async Task<bool> IsCategoryExists(int id)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryId == id && c.IsDeleted == false);
        }
    }
}
