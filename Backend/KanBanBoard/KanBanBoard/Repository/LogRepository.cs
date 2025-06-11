using KanBanBoard.Data;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;

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
    }
}
