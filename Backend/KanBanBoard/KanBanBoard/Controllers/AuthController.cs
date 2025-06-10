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

        //[Authorize]
        //[HttpGet("Get-CurrentUser")]
        //public async Task<IActionResult> GetUser()
        //{
        //    try
        //    {
        //        // Get user ID from JWT token claims
        //        var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

        //        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        //        {
        //            return Unauthorized(new ApiError(401, "Invalid token or user ID not found"));
        //        }

        //        var user = await _authService.GetCurrentUserAsync(userId);

        //        return Ok(new ApiResponse<UserResponseDTO>(200, user, "Current user retrieved successfully"));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new ApiError(400, ex.Message));
        //    }
        //}

        //[Authorize(Roles = "Admin")]
        //[HttpPut("Remove-Employee/{employeeId}")]
        //public async Task<IActionResult> RemoveEmployee(int employeeId)
        //{
        //    try
        //    {
        //        var result = await _authService.RemoveEmployeeAsync(employeeId);

        //        if (!result)
        //        {
        //            return NotFound(new ApiError(404, "Employee not found or already removed"));
        //        }

        //        return Ok(new ApiResponse<bool>(200, true, "Employee removed successfully"));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new ApiError(400, ex.Message));
        //    }
        //}

        //[Authorize(Roles = "Admin")]
        //[HttpGet("Get-All-Employees")]
        //public async Task<IActionResult> GetAllEmployees()
        //{
        //    try
        //    {
        //        var employees = await _authService.GetAllEmployeesAsync();

        //        return Ok(new ApiResponse<List<EmployeeListDTO>>(200, employees, "Employees retrieved successfully"));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new ApiError(400, ex.Message));
        //    }
        //}
    }
}
