using KanBanBoard.DTO;
using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface IAuthService
    {
        public Task<UserResponseDTO> SignUpService(SignUpDto signUpModel);

        public Task<(UserResponseDTO, string)> LoginService(LoginDTO user);

        public Task<UserModel?> AuthenticateUserAsync(string email, string password);

        public string GenerateJwtToken(UserModel user);

        public Task<UserResponseDTO> GetCurrentUserAsync(int userId);

        public Task<bool> RemoveEmployeeAsync(int userId);

        public Task<List<EmployeeListDTO>> GetAllEmployeesAsync();
    }
}
