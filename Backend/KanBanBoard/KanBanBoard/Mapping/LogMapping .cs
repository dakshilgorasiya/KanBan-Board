using AutoMapper;
using KanBanBoard.DTO;
using KanBanBoard.Model;

namespace KanBanBoard.Mapping
{
    public class LogMapping : Profile
    {
        public LogMapping()
        {
            // TasklogModel to TaskLogSummaryDTO mapping
            CreateMap<TasklogModel, TaskLogSummaryDTO>()
                .ForMember(dest => dest.TaskName, opt => opt.MapFrom(src => src.Task != null ? src.Task.Title : "Unknown Task"))
                .ForMember(dest => dest.MovedFrom, opt => opt.MapFrom(src => src.FromCategory != null ? src.FromCategory.CategoryName : "Created"))
                .ForMember(dest => dest.MovedTo, opt => opt.MapFrom(src => src.ToCategory != null ? src.ToCategory.CategoryName : "Deleted"))
                .ForMember(dest => dest.MovedBy, opt => opt.MapFrom(src => src.User != null ? src.User.UserName : "Unknown User"))
                .ForMember(dest => dest.MovedAt, opt => opt.MapFrom(src => src.MovedAt));

            // TasklogModel to TaskLogDetailDTO mapping
            CreateMap<TasklogModel, TaskLogDetailDTO>()
                .ForMember(dest => dest.MovedBy, opt => opt.MapFrom(src => src.User != null ? src.User.UserName : "Unknown User"))
                .ForMember(dest => dest.From, opt => opt.MapFrom(src => src.FromCategory != null ? src.FromCategory.CategoryName : "Created"))
                .ForMember(dest => dest.To, opt => opt.MapFrom(src => src.ToCategory != null ? src.ToCategory.CategoryName : "Deleted"))
                .ForMember(dest => dest.At, opt => opt.MapFrom(src => src.MovedAt));
        }
    }
}