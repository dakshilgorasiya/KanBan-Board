using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface ILogRepository
    {
        Task<TasklogModel> AddLog(TasklogModel log);
    }
}
