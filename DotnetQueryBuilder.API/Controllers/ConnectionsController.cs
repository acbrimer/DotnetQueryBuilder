using System.Linq;
using Microsoft.AspNetCore.Mvc;
using DotnetQueryBuilder.API.Models;
using DotnetQueryBuilder.Core;
using DotnetQueryBuilder.API.Data;

namespace DotnetQueryBuilder.API.Controllers;
[ApiController]
[Route("[controller]")]
public class ConnectionsController : ControllerBase
{
    private readonly ConnectionContext _context;

    public ConnectionsController(ConnectionContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetList()
    {
        var connections = _context.ListConnections();
        HttpContext.Response.Headers.Add("x-total-count", connections.Count.ToString());
        return Ok(connections);
    }

    [Route("{id}")]
    [HttpGet]
    public IActionResult GetOne(string id)
    {
        var connection = _context.GetConnection(id);
        if (connection is null)
            return BadRequest($"Connection does not exist: {id}");

        return Ok(connection.GetConnectionRecord());
    }

    [HttpPost]
    public IActionResult Create(ConnectionDto connectionDto)
    {
        var connection = _context.CreateConnection(connectionDto);

        if (connection is null)
            return BadRequest("Connection does not exist");

        return Ok(connection.GetConnectionRecord());
    }

    [Route("{id}")]
    [HttpDelete]
    public IActionResult Delete(string id)
    {
        var connection = _context.GetConnection(id);

        if (connection == null)
            return BadRequest("Connection does not exist");
        var connectionDto = connection.GetConnectionRecord();
        _context.DeleteConnection(id);
        return Ok(connectionDto);
    }
}

