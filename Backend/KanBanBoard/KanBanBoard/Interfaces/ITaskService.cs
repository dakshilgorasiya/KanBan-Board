using KanBanBoard.DTO;
using KanBanBoard.Services;

namespace KanBanBoard.Interfaces
{
    public interface ITaskService
    {
        // Admin methods
        Task<AddTaskResponseDTO> AddTask(AddTaskRequestDTO requestDTO, int UserId);
        Task<MoveTaskResponseDTO?> MoveTask(MoveTaskRequestDTO requestDTO, int UserId);
        Task<DeleteTaskResponseDTO?> DeleteTask(int TaskId, int UserId);
        Task<GetAllTaskResponseDTO> GetAllTask();

        // Employee methods
        Task<EmployeeMoveTaskResult?> MoveTaskByEmployee(MoveTaskRequestDTO requestDTO, int employeeId);
        Task<GetAllTaskResponseDTO> GetAllTaskByEmployeeId(int employeeId);
    }
}
