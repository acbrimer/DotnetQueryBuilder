using System.Data.Common;
using DotnetQueryBuilder.API.Models;
using DotnetQueryBuilder.Core;

namespace DotnetQueryBuilder.API.Data;
public class ConnectionContext
{
    private readonly List<Connection> _connections = new List<Connection>();

    public IEnumerable<Connection> Connections => _connections;

    public Connection? CreateConnection(ConnectionDto connectionDto)
    {
        if (connectionDto.Id is null)
            return null;
        var connectionExists = ConnectionExists(connectionDto.Id);
        if (connectionExists)
            return GetConnection(connectionDto.Id);
        var newConnection = new Connection(
            connectionDto.Provider,
            connectionDto.Id,
            connectionDto.ConnectionString,
            connectionDto.Host,
            connectionDto.Database,
            connectionDto.Username,
            connectionDto.Password);
        if (!newConnection.TestConnection())
            return null;
        AddConnection(newConnection);
        return newConnection;
    }
    public void AddConnection(Connection connection)
    {
        _connections.Add(connection);
    }

    public void DeleteConnection(string id)
    {
        if (ConnectionExists(id))
        {
            var conn = GetConnection(id);
            var ix = _connections.IndexOf(conn);
            _connections.RemoveAt(ix);
        }
    }
    public bool ConnectionExists(string id)
    {
        return _connections.Exists(c => c.Id == id);
    }

    public Connection? GetConnection(string id)
    {
        return _connections.Where(c => c.Id == id).FirstOrDefault();
    }

    public List<ConnectionDto> ListConnections()
    {
        return _connections.Select(
            c => c.GetConnectionRecord()
        ).ToList();
    }

    public List<string> ListConnectionIds()
    {
        return _connections.Select(
            c => c.Id
        ).ToList();
    }
}