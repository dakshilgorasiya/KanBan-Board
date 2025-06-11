using KanBanBoard.Model;

namespace KanBanBoard.Interfaces
{
    public interface ITaskRepository
    {
        Task<TaskModel> AddTask(TaskModel task);
        Task<TaskModel?> UpdateTask(TaskModel task);
        Task<TaskModel?> DeleteTask(int id);
        Task<List<CategoriesModel>> GetAllTasks();
        Task<bool> IsTaskExits(int id);
        Task<TaskModel?> GetTask(int id);
    }
}
