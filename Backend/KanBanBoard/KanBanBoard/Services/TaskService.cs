using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Interfaces;
using KanBanBoard.Model;
using Microsoft.AspNetCore.Mvc;

namespace KanBanBoard.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly ILogRepository _logRepository;
        private readonly IAuthRepository _authRepository;
        private readonly IMapper _mapper;

        // Main category IDs for validation
        private const int TODO_CATEGORY_ID = 1;
        private const int IN_PROGRESS_CATEGORY_ID = 2;
        private const int DONE_CATEGORY_ID = 3;

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

            var temp = _mapper.Map<AddTaskResponseDTO>(result);

            var user = await _authRepository.GetUserByIdAsync(requestDTO.AssignTo);

            temp.EmployeeName = user.UserName;

            return temp;
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
                categorywiseTaskDTO.CategoryId = category.CategoryId;
                categorywiseTaskDTO.Tasks = new List<TaskDTO>();

                foreach(var task in category.Tasks)
                {
                    TaskDTO taskDTO = new TaskDTO()
                    {
                        TaskId = task.TaskId,
                        Title = task.Title,
                        Description = task.Description,
                        EmployeeName = task.AssignedUser.UserName,
                        CurrentCategoryId = task.CurrentCategoryId,
                        EmployeeId = task.AssignedUser.UserId,
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

        // Employee Methods

        public async Task<EmployeeMoveTaskResult?> MoveTaskByEmployee(MoveTaskRequestDTO requestDTO, int employeeId)
        {
            TaskModel? task = await _taskRepository.GetTask(requestDTO.TaskId);

            if (task == null)
            {
                return null;
            }

            // Check if the task is assigned to the current employee
            if (task.AssignTo != employeeId)
            {
                return null; // Employee can only move their own tasks
            }

            // Validate employee move restrictions for main categories
            if (!IsValidEmployeeMove(requestDTO.FromCategoryId, requestDTO.ToCategoryId))
            {
                return new EmployeeMoveTaskResult
                {
                    IsSuccess = false,
                    ErrorMessage = GetMoveRestrictionMessage(requestDTO.FromCategoryId, requestDTO.ToCategoryId),
                    Data = null
                };
            }

            // Verify the task is actually in the FromCategory
            if (task.CurrentCategoryId != requestDTO.FromCategoryId)
            {
                return new EmployeeMoveTaskResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Task is not in the specified source category",
                    Data = null
                };
            }

            // Log the move
            TasklogModel log = new TasklogModel()
            {
                TaskID = requestDTO.TaskId,
                MovedBy = employeeId,
                FromCategoryId = requestDTO.FromCategoryId,
                ToCategoryId = requestDTO.ToCategoryId,
            };

            await _logRepository.AddLog(log);

            // Update task category
            task.CurrentCategoryId = requestDTO.ToCategoryId;
            TaskModel? result = await _taskRepository.UpdateTask(task);

            return new EmployeeMoveTaskResult
            {
                IsSuccess = true,
                ErrorMessage = null,
                Data = _mapper.Map<MoveTaskResponseDTO>(result)
            };
        }

        public async Task<GetAllTaskResponseDTO> GetAllTaskByEmployeeId(int employeeId)
        {
            var categories = await _taskRepository.GetAllTasks();

            GetAllTaskResponseDTO result = new GetAllTaskResponseDTO();
            result.categoryWiseTask = new List<CategorywiseTaskDTO>();

            foreach (var category in categories)
            {
                CategorywiseTaskDTO categorywiseTaskDTO = new CategorywiseTaskDTO();
                categorywiseTaskDTO.Title = category.CategoryName;
                categorywiseTaskDTO.Tasks = new List<TaskDTO>();

                // Filter tasks assigned to the specific employee
                var employeeTasks = category.Tasks.Where(t => t.AssignTo == employeeId && t.IsDeleted == false);

                foreach (var task in employeeTasks)
                {
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

        // Helper methods for employee move validation
        private bool IsValidEmployeeMove(int fromCategoryId, int toCategoryId)
        {
            // For non-main categories (custom categories added by admin), allow all moves
            if (!IsMainCategory(fromCategoryId) || !IsMainCategory(toCategoryId))
            {
                return true;
            }

            // Define invalid moves for main categories
            var invalidMoves = new Dictionary<int, List<int>>
            {
                { IN_PROGRESS_CATEGORY_ID, new List<int> { TODO_CATEGORY_ID } }, // Can't move from In Progress to Todo
                { DONE_CATEGORY_ID, new List<int> { TODO_CATEGORY_ID, IN_PROGRESS_CATEGORY_ID } } // Can't move from Done to Todo or In Progress
            };

            if (invalidMoves.ContainsKey(fromCategoryId))
            {
                return !invalidMoves[fromCategoryId].Contains(toCategoryId);
            }

            return true; // All other moves are valid
        }

        private bool IsMainCategory(int categoryId)
        {
            return categoryId == TODO_CATEGORY_ID ||
                   categoryId == IN_PROGRESS_CATEGORY_ID ||
                   categoryId == DONE_CATEGORY_ID;
        }

        private string GetMoveRestrictionMessage(int fromCategoryId, int toCategoryId)
        {
            if (fromCategoryId == IN_PROGRESS_CATEGORY_ID && toCategoryId == TODO_CATEGORY_ID)
            {
                return "Cannot move task from 'In Progress' back to 'Todo'";
            }
            else if (fromCategoryId == DONE_CATEGORY_ID && toCategoryId == IN_PROGRESS_CATEGORY_ID)
            {
                return "Cannot move task from 'Done' back to 'In Progress'";
            }
            else if (fromCategoryId == DONE_CATEGORY_ID && toCategoryId == TODO_CATEGORY_ID)
            {
                return "Cannot move task from 'Done' back to 'Todo'";
            }

            return "This move is not allowed";
        }
    }

    
}
