using System.ComponentModel.DataAnnotations;

namespace KanBanBoard.DTO
{
    public class AddTaskRequestDTO
    {
        [Required(ErrorMessage = "Task title is required")]
        public string? Title { get; set; }

        public string? Description { get; set; }

        [Required(ErrorMessage = "EmployeeId is required")]
        public int AssignTo { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        public int? CurrentCategoryId { get; set; }
    }

    public class AddTaskResponseDTO
    {
        public int? TaskId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? AssignTo { get; set; }
        public string? EmployeeName { get; set; }
        public int? CurrentCategoryId { get; set; }
    }

    public class MoveTaskRequestDTO
    {
        [Required(ErrorMessage = "TaskId is required")]
        public int TaskId {  get; set; }

        [Required(ErrorMessage = "FromCategoryId is required")]
        public int FromCategoryId { get; set; }

        [Required(ErrorMessage = "ToCategoryId is required")]
        public int ToCategoryId { get; set; }
    }

    public class MoveTaskResponseDTO
    {
        public int? TaskId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? AssignTo { get; set; }
        public int? CurrentCategoryId { get; set; }
    }

    public class DeleteTaskResponseDTO
    {
        public int? TaskId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? AssignTo { get; set; }
        public int? CurrentCategoryId { get; set; }
    }

    public class GetAllTaskResponseDTO
    {
        public List<CategorywiseTaskDTO> categoryWiseTask { get; set; }
    }

    public class CategorywiseTaskDTO
    {
        public string? Title { get; set; }
        public List<TaskDTO>? Tasks { get; set; }
        public int CategoryId { get; set; }
    }

    public class TaskDTO
    {
        public int? TaskId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? EmployeeName { get; set; }
        public int? EmployeeId { get; set; }
        public int? CurrentCategoryId { get; set; }
    }
}
