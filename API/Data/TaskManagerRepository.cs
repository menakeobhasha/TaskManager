using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class TaskManagerRepository : ITaskManagerRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public TaskManagerRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void AddTaskAsync(TaskDataDTO taskData)
    {
        var task = _mapper.Map<TaskData>(taskData);
        _context.Add(task);
    }

    public void DeleteTaskAsync(TaskData taskData)
    {
        _context.TaskData.Remove(taskData);
    }

    public async Task<IEnumerable<TaskDataDTO>> GetTaskAsync()
    {
        return await _context.TaskData
            .ProjectTo<TaskDataDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<TaskData> GetTaskByIdAsync(int id)
    {
        return await _context.TaskData.FindAsync(id);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
