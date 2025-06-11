using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface ILogRepository
    {
        Task<TasklogModel> AddLog(TasklogModel log);
        Task<List<TasklogModel>> GetAllLogs();
        Task<List<TasklogModel>> GetLogsByTaskId(int taskId);
        Task<TaskModel?> GetTaskById(int taskId);
    }
}
