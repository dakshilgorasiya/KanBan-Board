using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;

namespace KanBanBoard.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(IMapper mapper, ICategoryRepository categoryRepository)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
        }

        public async Task<AddCategoryResponseDTO> AddCategory(AddCategoryRequestDTO categoryDTO)
        {
            CategoriesModel newCategory = _mapper.Map<CategoriesModel>(categoryDTO);
            CategoriesModel result = await _categoryRepository.AddCategory(newCategory);
            return _mapper.Map<AddCategoryResponseDTO>(result);
        }

        public async Task<DeleteCategoryResponseDTO?> DeleteCategory(int CategoryId)
        {
            bool isCategoryExits = await _categoryRepository.IsCategoryExists(CategoryId);

            if (isCategoryExits)
            {
                CategoriesModel? deletedCategory = await _categoryRepository.DeleteCategory(CategoryId);
                return _mapper.Map<DeleteCategoryResponseDTO>(deletedCategory);
            }
            else
            {
                return null;
            }
        }
    }
}
