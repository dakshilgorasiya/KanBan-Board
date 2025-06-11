using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using KanBanBoard.Services;
using KanBanBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("Add-Employee")]
        public async Task<IActionResult> CreateUser([FromBody] SignUpDto userModel)
        {
            try
            {
                var responseDTO = await _authService.SignUpService(userModel);

                return Ok(new ApiResponse<UserResponseDTO>(201, responseDTO, "Employee Added Successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO user)
        {
            try
            {
                var (responseDTO, tokenString) = await _authService.LoginService(user);

                // Store token in HttpOnly cookie
                Response.Cookies.Append("AccessToken", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new ApiResponse<UserResponseDTO>(200, responseDTO, "Login successful, token set in cookies"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }


        [HttpPost("Logout")]
        public async Task<IActionResult> logout()
        {
            Response.Cookies.Delete("AccessToken");
            return Ok(new ApiResponse<string>(200, "Logout successful"));
        }

    }
}
