using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Model;

namespace KanBanBoard.Mapping
{
    public class AuthMapping : Profile
    {
        public AuthMapping()
        {
            // UserModel map to -> UserResponseDTO
            CreateMap<UserModel, UserResponseDTO>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.Value));
                

            CreateMap<SignUpDto, UserModel>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role == UserRole.Admin.ToString() ? UserRole.Admin : UserRole.Employee));
        }
    }
}
