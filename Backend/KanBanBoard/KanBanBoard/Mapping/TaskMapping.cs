using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Model;

namespace KanBanBoard.Mapping
{
    public class TaskMapping : Profile
    {
        public TaskMapping()
        {
            CreateMap<AddTaskRequestDTO, TaskModel>();
            CreateMap<TaskModel, AddTaskResponseDTO>();
            CreateMap<TaskModel, MoveTaskResponseDTO>();
            CreateMap<TaskModel, DeleteTaskResponseDTO>();
        }
    }
}
