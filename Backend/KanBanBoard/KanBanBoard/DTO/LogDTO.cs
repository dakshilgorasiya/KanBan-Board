namespace KanBanBoard.DTO
{
    // Response DTOs for GetAllLogs
    public class GetAllLogsResponseDTO
    {
        public List<TaskLogSummaryDTO> TaskLogs { get; set; } = new List<TaskLogSummaryDTO>();
    }

    public class TaskLogSummaryDTO
    {
        public string? TaskName { get; set; }
        public string? MovedFrom { get; set; }
        public string? MovedTo { get; set; }
        public string? MovedBy { get; set; }
        public DateTime? MovedAt { get; set; }
    }

    // Response DTOs for GetLogByTaskId
    public class GetLogByTaskIdResponseDTO
    {
        public string? TaskName { get; set; }
        public string? CurrentCategory { get; set; }
        public List<TaskLogDetailDTO> LogHistory { get; set; } = new List<TaskLogDetailDTO>();
    }

    public class TaskLogDetailDTO
    {
        public string? MovedBy { get; set; }
        public string? From { get; set; }
        public string? To { get; set; }
        public DateTime? At { get; set; }
    }
}
