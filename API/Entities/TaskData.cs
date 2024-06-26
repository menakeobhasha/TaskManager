﻿namespace API.Entities;

public class TaskData
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public bool Completed { get; set; }
}
