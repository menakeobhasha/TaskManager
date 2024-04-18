using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<TaskData> TaskData { get; set; }
    public DbSet<AppUser> Users { get; set; }
}
