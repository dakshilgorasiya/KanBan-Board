using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KanBanBoard.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _userRepository;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthService(IAuthRepository userRepository, IConfiguration config, IMapper mapper)
        {
            _userRepository = userRepository;
            _config = config;
            _mapper = mapper;
        }
        public async Task<UserModel?> AuthenticateUserAsync(string email, string password)
        {
            var user = await _userRepository.GetUSerByEmailAsync(email);
            if (user != null && BCrypt.Net.BCrypt.EnhancedVerify(password, user.Password))
            {
                return user;
            }
            return null;
        }

        public string GenerateJwtToken(UserModel user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.UserId.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<(UserResponseDTO, string)> LoginService(LoginDTO user)
        {
            var authenticatedUser = await AuthenticateUserAsync(user.Email, user.Password);
            if (authenticatedUser == null)
            {
                throw new InvalidOperationException("Invalid Email or Password");
            }

            var tokenString = GenerateJwtToken(authenticatedUser);

            var responseDTO = _mapper.Map<UserResponseDTO>(authenticatedUser);

            return (responseDTO, tokenString);
        }

        public async Task<UserResponseDTO> SignUpService(SignUpDto signUpModel)
        {
            var findUser = await _userRepository.GetUSerByEmailAsync(signUpModel.Email);
            if (findUser != null)
            {
                throw new ArgumentException("User with given Email ID is already exists");
            }

            var userModel = _mapper.Map<UserModel>(signUpModel);

            userModel.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(userModel.Password);

            await _userRepository.AddUserAsync(userModel);

            return _mapper.Map<UserResponseDTO>(userModel);
        }
    }
}
