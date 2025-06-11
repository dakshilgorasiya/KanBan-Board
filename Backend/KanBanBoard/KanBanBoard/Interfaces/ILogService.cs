using KanBanBoard.DTO;

namespace KanBanBoard.Interfaces
{
    public interface ILogService
    {
        Task<GetAllLogsResponseDTO> GetAllLogs();
        Task<GetLogByTaskIdResponseDTO?> GetLogByTaskId(int taskId);
    }
}
