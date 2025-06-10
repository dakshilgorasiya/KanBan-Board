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
            CreateMap<UserModel, UserResponseDTO>();

            CreateMap<SignUpDto, UserModel>();
        }
    }
}
