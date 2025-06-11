using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;

namespace KanBanBoard.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly ILogRepository _logRepository;
        private readonly IAuthRepository _authRepository;
        private readonly IMapper _mapper;

        public TaskService(ITaskRepository taskRepository, IMapper mapper, ILogRepository logRepository, IAuthRepository authRepository)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
            _logRepository = logRepository;
            _authRepository = authRepository;
        }

        public async Task<AddTaskResponseDTO> AddTask(AddTaskRequestDTO requestDTO, int UserId)
        {
            TaskModel taskModel = _mapper.Map<TaskModel>(requestDTO);
            var result = await _taskRepository.AddTask(taskModel);

            TasklogModel log = new TasklogModel()
            {
                TaskID = taskModel.TaskId,
                MovedBy = UserId,
                FromCategoryId = null,
                ToCategoryId = taskModel.CurrentCategoryId,
            };

            await _logRepository.AddLog(log);

            return _mapper.Map<AddTaskResponseDTO>(result);
        }

        public async Task<DeleteTaskResponseDTO?> DeleteTask(int TaskId, int UserId)
        {
            bool IsTaskExits = await _taskRepository.IsTaskExits(TaskId);

            if(IsTaskExits)
            {
                TaskModel? taskToDelete = await _taskRepository.DeleteTask(TaskId);

                TasklogModel log = new TasklogModel()
                {
                    TaskID = TaskId,
                    MovedBy = UserId,
                    FromCategoryId = taskToDelete.CurrentCategoryId,
                    ToCategoryId = null,
                };

                await _logRepository.AddLog(log);

                return _mapper.Map<DeleteTaskResponseDTO>(taskToDelete);
            }
            else
            {
                return null;
            }
        }

        public async Task<GetAllTaskResponseDTO> GetAllTask()
        {
            var categories = await _taskRepository.GetAllTasks();

            GetAllTaskResponseDTO result = new GetAllTaskResponseDTO();

            result.categoryWiseTask = new List<CategorywiseTaskDTO>();

            foreach(var category in categories)
            {
                CategorywiseTaskDTO categorywiseTaskDTO = new CategorywiseTaskDTO();
                categorywiseTaskDTO.Title = category.CategoryName;
                categorywiseTaskDTO.Tasks = new List<TaskDTO>();

                foreach(var task in category.Tasks)
                {
                    //var employee = await _authRepository.GetUserByIdAsync(task.AssignTo);
                    TaskDTO taskDTO = new TaskDTO()
                    {
                        TaskId = task.TaskId,
                        Title = task.Title,
                        Description = task.Description,
                        EmployeeName = task.AssignedUser.UserName,
                        CurrentCategoryId = task.CurrentCategoryId,
                    };
                    categorywiseTaskDTO.Tasks.Add(taskDTO);
                }

                result.categoryWiseTask.Add(categorywiseTaskDTO);
            }

            return result;
        }

        public async Task<MoveTaskResponseDTO?> MoveTask(MoveTaskRequestDTO requestDTO, int UserId)
        {
            TaskModel? task = await _taskRepository.GetTask(requestDTO.TaskId);

            if(task == null)
            {
                return null;
            }

            TasklogModel log = new TasklogModel()
            {
                TaskID = requestDTO.TaskId,
                MovedBy = UserId,
                FromCategoryId = requestDTO.FromCategoryId,
                ToCategoryId = requestDTO.ToCategoryId,
            };

            await _logRepository.AddLog(log);

            task.CurrentCategoryId = requestDTO.ToCategoryId;

            TaskModel? result = await _taskRepository.UpdateTask(task);

            return _mapper.Map<MoveTaskResponseDTO>(result);
        }
    }
}
