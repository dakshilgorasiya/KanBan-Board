using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UserController(IAuthService authService)
        {
            _authService = authService;
        }

        [Authorize]
        [HttpGet("Get-CurrentUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new ApiError(401, "Invalid token or user ID not found"));
                }

                var user = await _authService.GetCurrentUserAsync(userId);

                return Ok(new ApiResponse<UserResponseDTO>(200, user, "Current user retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Remove-Employee/{employeeId}")]
        public async Task<IActionResult> RemoveEmployee(int employeeId)
        {
            try
            {
                var result = await _authService.RemoveEmployeeAsync(employeeId);

                if (!result)
                {
                    return NotFound(new ApiError(404, "Employee not found or already removed"));
                }

                return Ok(new ApiResponse<bool>(200, true, "Employee removed successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("Get-All-Employees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            try
            {
                var employees = await _authService.GetAllEmployeesAsync();

                return Ok(new ApiResponse<List<EmployeeListDTO>>(200, employees, "Employees retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }
    }
}
