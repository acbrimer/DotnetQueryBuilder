namespace DotnetQueryBuilder.API.Models;
using DotnetQueryBuilder.DbConnect;
using DotnetQueryBuilder.Core;
using System.Data.Common;
using System.Data;
using Npgsql;
using Dapper;

public class Connection
{
    public string Id { get; set; }
    public string ConnectionString { get; set; }
    public string Provider { get; set; }
    public string? Host { get; set; }
    public string? Database { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    private DbConnection _connection { get; set; }
    public Connection(string provider, string id, string connectionString, string host, string database, string username, string password)
    {
        Provider = provider;
        Id = id;
        ConnectionString = connectionString;
        Host = host;
        Database = database;
        Username = username;
        Password = password;
        _connection = new NpgsqlConnection(connectionString);
    }
    public bool TestConnection()
    {
        try
        {
            _connection.Query("SELECT 1");
            return true;
        }
        catch
        {
            return false;
        }
    }

    public ConnectionDto GetConnectionRecord()
    {
        return new ConnectionDto(Provider, Host, Database, Username, Password);
    }
    public ConnectionSchemaDto GetConnectionSchema(string id)
    {
        return _connection.GetConnectionSchema(id);
    }
}
