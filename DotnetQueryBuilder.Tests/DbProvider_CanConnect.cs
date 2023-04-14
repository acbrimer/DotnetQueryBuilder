using DotnetQueryBuilder.Core;
using DotnetQueryBuilder.DbConnect;

namespace DotnetQueryBuilder.Tests;

public class DbProvider_CanConnect
{
    // [Fact]
    public void CanConnect_SqlServer()
    {
        var mdf = "Northwind.MDF";
        var connectionString = $"Data Source=(LocalDB)\\MSSQLLocalDB;AttachDbFilename={mdf};Integrated Security=True;Connection Timeout=30;User Instance=True";
        var dbProvider = new DbProvider("mssql", connectionString);
        bool result = dbProvider.TestConnection();
        Assert.True(result, $"Could not connect to DbProvider '{dbProvider.DatabaseProvider}' at connectionString:\n{connectionString}");
    }

    [Fact]
    public void CanConnect_Postgres()
    {
        var connectionString = "Host=localhost;Database=ccdb;Username=abrimer;Password=postgres";
        var dbProvider = new DbProvider("postgres", connectionString);
        bool result = dbProvider.TestConnection();
        Assert.True(result, $"Could not connect to DbProvider '{dbProvider.DatabaseProvider}' at connectionString:\n{connectionString}");
    }

    [Fact]
    public void CanConnect_Sqlite()
    {
        var connectionString = "Data Source=sqlitetest.db";
        var dbProvider = new DbProvider("sqlite", connectionString);
        bool result = dbProvider.TestConnection();
        Assert.True(result, $"Could not connect to DbProvider '{dbProvider.DatabaseProvider}' at connectionString:\n{connectionString}");
    }


}