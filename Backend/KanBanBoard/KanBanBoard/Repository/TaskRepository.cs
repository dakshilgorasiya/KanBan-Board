using KanBanBoard.Data;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Repository
{
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TaskModel> AddTask(TaskModel task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskModel?> DeleteTask(int id)
        {
            TaskModel? taskToDelete = await _context.Tasks.FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted == false);

            if (taskToDelete != null)
            {
                taskToDelete.IsDeleted = true;
                await _context.SaveChangesAsync();
                return taskToDelete;
            }
            else
            {
                return null;
            }
        }

        public async Task<List<CategoriesModel>> GetAllTasks()
        {
            var tasks = await _context.Categories
                .Where(c => c.IsDeleted == false)
                .Include(c => c.Tasks.Where(t => t.IsDeleted == false))
                .ThenInclude(c => c.AssignedUser)
                .ToListAsync();

            return tasks;
        }

        public async Task<TaskModel?> GetTask(int id)
        {
            return await _context.Tasks.FirstOrDefaultAsync(t => t.TaskId == id && t.IsDeleted == false);
        }

        public async Task<bool> IsTaskExits(int id)
        {
            return await _context.Tasks.AnyAsync(t => t.TaskId == id && t.IsDeleted == false);
        }

        public async Task<TaskModel?> UpdateTask(TaskModel task)
        {
            TaskModel? taskToUpdate = await _context.Tasks.FirstOrDefaultAsync(task => task.TaskId == task.TaskId && task.IsDeleted == false);

            if (taskToUpdate != null)
            {
                taskToUpdate = task;
                await _context.SaveChangesAsync();
                return taskToUpdate;
            }
            else
            {
                return null;
            }
        }

        public async Task<List<CategoriesModel>> GetTasksByEmployeeId(int employeeId)
        {
            var tasks = await _context.Categories
                .Where(c => c.IsDeleted == false)
                .Include(c => c.Tasks.Where(t => t.IsDeleted == false && t.AssignTo == employeeId))
                .ThenInclude(t => t.AssignedUser)
                .Where(c => c.Tasks.Any()) // Only include categories that have tasks for this employee
                .ToListAsync();
            return tasks;
        }
    }
}
