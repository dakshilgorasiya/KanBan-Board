using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost("AddTask")]
        public async Task<IActionResult> AddTask(AddTaskRequestDTO addTaskRequestDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    string errorMessage = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .FirstOrDefault() ?? "Invalid request";

                    List<string> allErrors = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .ToList();

                    return StatusCode(StatusCodes.Status400BadRequest, new ApiError(400, errorMessage, allErrors));
                }

                var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new ApiError(401, "Invalid token or user ID not found"));
                }

                var result = await _taskService.AddTask(addTaskRequestDTO, userId);

                return Ok(new ApiResponse<AddTaskResponseDTO>(200, result, "Task added"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [HttpDelete("DeleteTask")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new ApiError(401, "Invalid token or user ID not found"));
                }

                var result = await _taskService.DeleteTask(id, userId);

                if(result == null)
                {
                    return NotFound();
                }

                return Ok(new ApiResponse<DeleteTaskResponseDTO>(200, result, "Task added"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [HttpPut("MoveTask")]
        public async Task<IActionResult> MoveTask(MoveTaskRequestDTO moveTaskRequestDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    string errorMessage = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .FirstOrDefault() ?? "Invalid request";

                    List<string> allErrors = ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .ToList();

                    return StatusCode(StatusCodes.Status400BadRequest, new ApiError(400, errorMessage, allErrors));
                }

                var userIdClaim = User.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new ApiError(401, "Invalid token or user ID not found"));
                }

                var result = await _taskService.MoveTask(moveTaskRequestDTO, userId);

                if(result == null)
                {
                    return NotFound();
                }

                return Ok(new ApiResponse<MoveTaskResponseDTO>(200, result, "Task added"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }

        [HttpGet("GetAllTaskAdmin")]
        public async Task<IActionResult> GetAllTask()
        {
            try
            { 
                var result = await _taskService.GetAllTask();
                return Ok(new ApiResponse<GetAllTaskResponseDTO>(200, result, "Task fetched"));
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiError(400, ex.Message));
            }
        }
    }
}
