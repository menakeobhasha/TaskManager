using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDTO
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Address { get; set; }

    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string Password { get; set; }
}
