using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface ITaskManagerRepository
{
    Task<bool> SaveAllAsync();
    Task<IEnumerable<TaskDataDTO>> GetTaskAsync();
    Task<TaskData> GetTaskByIdAsync(int id);
    void AddTaskAsync(TaskDataDTO taskData);
    void DeleteTaskAsync(TaskData taskData);
}
