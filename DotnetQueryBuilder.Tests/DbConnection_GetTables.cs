using DotnetQueryBuilder.Core;
using DotnetQueryBuilder.DbConnect;

namespace DotnetQueryBuilder.Tests;

public class DbConnection_GetTables
{


    [Fact]
    public void GetTables_Postgres()
    {
        var connectionString = "Host=localhost;Database=ccdb;Username=abrimer;Password=postgres";
        var dbProvider = new DbProvider("postgres", connectionString);
        bool result = dbProvider.TestConnection();
        Assert.True(result, $"Could not connect to DbProvider '{dbProvider.DatabaseProvider}' at connectionString:\n{connectionString}");
    }



}