using KanBanBoard.DTO;

namespace KanBanBoard.Interfaces
{
    public interface ITaskService
    {
        Task<AddTaskResponseDTO> AddTask(AddTaskRequestDTO requestDTO, int UserId);
        Task<MoveTaskResponseDTO?> MoveTask(MoveTaskRequestDTO requestDTO, int UserId);
        Task<DeleteTaskResponseDTO?> DeleteTask(int TaskId, int UserId);
        Task<GetAllTaskResponseDTO> GetAllTask();
    }
}
