using System.Linq;
using Microsoft.AspNetCore.Mvc;
using DotnetQueryBuilder.API.Models;
using DotnetQueryBuilder.Core;
using DotnetQueryBuilder.API.Data;

namespace DotnetQueryBuilder.API.Controllers;
[ApiController]
[Route("[controller]")]
public class ConnectionSchemaController : ControllerBase
{
    private readonly ConnectionContext _context;

    public ConnectionSchemaController(ConnectionContext context)
    {
        _context = context;
    }

    [Route("{id}")]
    [HttpGet]
    public IActionResult GetOne(string id)
    {
        var connection = _context.GetConnection(id);
        if (connection != null)
            return Ok(connection.GetConnectionSchema(id));
        return BadRequest($"Connection does not exist: {id}");
    }
}

