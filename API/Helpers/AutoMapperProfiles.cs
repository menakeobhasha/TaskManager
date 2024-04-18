using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<TaskData, TaskDataDTO>();
        CreateMap<TaskDataDTO, TaskData>();
        CreateMap<TaskDataUpdateDTO, TaskData>();
        CreateMap<TaskData, TaskDataUpdateDTO>();
        CreateMap<RegisterDTO, AppUser>();
    }
}
