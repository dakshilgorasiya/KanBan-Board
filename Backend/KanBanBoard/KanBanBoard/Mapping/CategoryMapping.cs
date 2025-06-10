using AutoMapper;
using KanBanBoard.Model;
using KanBanBoard.DTO;

namespace KanBanBoard.Mapping
{
    public class CategoryMapping : Profile
    {
        public CategoryMapping() 
        {
            CreateMap<AddCategoryRequestDTO, CategoriesModel>();
            CreateMap<CategoriesModel, AddCategoryResponseDTO>();
            CreateMap<CategoriesModel, DeleteCategoryResponseDTO>();
        }
    }
}
