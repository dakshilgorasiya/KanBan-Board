using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet("GetAllLogs")]
        public async Task<IActionResult> GetAllLogs()
        {
            try
            {
                var result = await _logService.GetAllLogs();
                return Ok(new ApiResponse<GetAllLogsResponseDTO>(200, result, "All logs fetched successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [HttpGet("GetLogByTaskId/{taskId}")]
        public async Task<IActionResult> GetLogByTaskId(int taskId)
        {
            try
            {
                var result = await _logService.GetLogByTaskId(taskId);

                if (result == null)
                {
                    return NotFound(new ApiError(404, "Task not found"));
                }

                return Ok(new ApiResponse<GetLogByTaskIdResponseDTO>(200, result, "Task logs fetched successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }
    }
}