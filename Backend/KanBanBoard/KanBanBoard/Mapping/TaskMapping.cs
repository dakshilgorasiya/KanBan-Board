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
            CreateMap<TaskModel, GetDeletedTasksResponseDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.TaskId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Title));
        }
    }
}
