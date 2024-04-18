﻿using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API;

[ApiController]
[Route("api/user")]
public class AuthController : ControllerBase
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
        _context = context;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
    {
        if (await UserExists(registerDTO.Username)) return BadRequest("Username is taken");

        var user = _mapper.Map<AppUser>(registerDTO);

        using var hmac = new HMACSHA512();

        user.UserName = registerDTO.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
        user.PasswordSalt = hmac.Key;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDTO
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
    {
        var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDTO.Username.ToLower());

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return new UserDTO
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}
