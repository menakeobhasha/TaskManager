using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/tasks")]
public class TaskManagerController : ControllerBase
{
    private readonly ITaskManagerRepository _taskManager;
    private readonly IMapper _mapper;

    public TaskManagerController(ITaskManagerRepository taskManager, IMapper mapper)
    {
        _taskManager = taskManager;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDataDTO>>> GetTasks()
    {
        return Ok(await _taskManager.GetTaskAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDataDTO>> GetTaskById(int id)
    {
        var task = await _taskManager.GetTaskByIdAsync(id);
        if (task == null) return NotFound();
        return _mapper.Map<TaskDataDTO>(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDataDTO>> CreateTask(TaskDataDTO taskDataDTO)
    {
        _taskManager.AddTaskAsync(taskDataDTO);
        var result = await _taskManager.SaveAllAsync();
        if (!result) return BadRequest("Could not save changes to the DB");
        return Ok(taskDataDTO);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(int id, TaskDataUpdateDTO taskDataDTO)
    {
        var task = await _taskManager.GetTaskByIdAsync(id);
        if (task == null) return NotFound();

        _mapper.Map(taskDataDTO, task);

        if (await _taskManager.SaveAllAsync()) return Ok();

        return BadRequest("Problem saving changes");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        var task = await _taskManager.GetTaskByIdAsync(id);
        if (task == null) return NotFound();

        _taskManager.DeleteTaskAsync(task);

        if (await _taskManager.SaveAllAsync()) return Ok();

        return BadRequest("Could not update DB");
    }
}
