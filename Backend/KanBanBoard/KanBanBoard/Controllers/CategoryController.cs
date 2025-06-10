using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using KanBanBoard.Utils;

namespace KanBanBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("AddCategory")]
        public async Task<IActionResult> AddCategory([FromBody] AddCategoryRequestDTO requestDTO)
        {
            try
            {
                if(!ModelState.IsValid)
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

                AddCategoryResponseDTO result = await _categoryService.AddCategory(requestDTO);

                return StatusCode(StatusCodes.Status201Created, new ApiResponse<AddCategoryResponseDTO>(201, result, "Category added successfully"));
            }
            catch(Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiError(500, "Something went wrong"));
            }
        }

        [HttpDelete("DeleteCategory")]
        public async Task<IActionResult> DeleteCategory([FromQuery] int id)
        {
            if (id <= 0)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new ApiError(400, "Category Id is required"));
            }

            try
            {
                var result = await _categoryService.DeleteCategory(id);
                if(result == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new ApiError(404, "Category not found"));
                }
                return StatusCode(StatusCodes.Status200OK, new ApiResponse<DeleteCategoryResponseDTO>(200, result, "Category deleted successfully"));
            }
            catch(Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiError(500, "Something went wrong"));
            }
        }
    }
}
