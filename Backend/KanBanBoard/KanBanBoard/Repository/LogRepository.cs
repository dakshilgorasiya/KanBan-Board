using KanBanBoard.Data;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.EntityFrameworkCore;

namespace KanBanBoard.Repository
{
    public class LogRepository : ILogRepository
    {
        private readonly AppDbContext _context;

        public LogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TasklogModel> AddLog(TasklogModel log)
        {
            _context.Tasklog.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<List<TasklogModel>> GetAllLogs()
        {
            return await _context.Tasklog
                .Include(l => l.Task)
                .Include(l => l.User)
                .Include(l => l.FromCategory)
                .Include(l => l.ToCategory)
                .OrderByDescending(l => l.MovedAt)
                .ToListAsync();
        }

        public async Task<List<TasklogModel>> GetLogsByTaskId(int taskId)
        {
            return await _context.Tasklog
                .Where(l => l.TaskID == taskId)
                .Include(l => l.Task)
                .Include(l => l.User)
                .Include(l => l.FromCategory)
                .Include(l => l.ToCategory)
                .OrderBy(l => l.MovedAt)
                .ToListAsync();
        }

        public async Task<TaskModel?> GetTaskById(int taskId)
        {
            return await _context.Tasks
                .Include(t => t.CurrentCategory)
                .FirstOrDefaultAsync(t => t.TaskId == taskId && t.IsDeleted == false);
        }
    }
}
