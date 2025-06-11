using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;

namespace KanBanBoard.Services
{
    public class LogService : ILogService
    {
        private readonly ILogRepository _logRepository;
        private readonly IMapper _mapper;

        public LogService(ILogRepository logRepository, IMapper mapper)
        {
            _logRepository = logRepository;
            _mapper = mapper;
        }

        public async Task<GetAllLogsResponseDTO> GetAllLogs()
        {
            var logs = await _logRepository.GetAllLogs();

            var response = new GetAllLogsResponseDTO();
            response.TaskLogs = _mapper.Map<List<TaskLogSummaryDTO>>(logs);

            return response;
        }

        public async Task<GetLogByTaskIdResponseDTO?> GetLogByTaskId(int taskId)
        {
            // Get task details
            var task = await _logRepository.GetTaskById(taskId);
            if (task == null)
            {
                return null;
            }

            // Get all logs for this task
            var logs = await _logRepository.GetLogsByTaskId(taskId);

            var response = new GetLogByTaskIdResponseDTO
            {
                TaskName = task.Title,
                CurrentCategory = task.CurrentCategory?.CategoryName ?? "Unknown Category",
                LogHistory = _mapper.Map<List<TaskLogDetailDTO>>(logs)
            };

            return response;
        }
    }
}