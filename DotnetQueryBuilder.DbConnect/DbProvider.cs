namespace DotnetQueryBuilder.DbConnect;

using System;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Data.SQLite;
using Dapper;
using MySql.Data.MySqlClient;
using Npgsql;
using DotnetQueryBuilder.Core;

public class DbProvider
{
    public string DatabaseProvider { get; set; }
    private DbConnection connection { get; set; }
    public DbConnection conn { get => connection; }
    
    public DbProvider(string databaseProvider, string connectionString)
    {
        switch (databaseProvider.ToLower())
        {
            case "postgres":
            case "postgresql":
            case "pg":
                connection = new NpgsqlConnection(connectionString);
                DatabaseProvider = typeof(NpgsqlConnection).Name;
                break;
            case "mysql":
                connection = new MySqlConnection(connectionString);
                DatabaseProvider = typeof(MySqlConnection).Name;
                break;
            case "sqlite":
            case "sqlite3":
                connection = new SQLiteConnection(connectionString);
                DatabaseProvider = typeof(SQLiteConnection).Name;
                break;
            case "mssql":
                connection = new SqlConnection(connectionString);
                DatabaseProvider = typeof(SqlConnection).Name;
                break;
            default:
                Console.WriteLine($"Invalid database provider: {databaseProvider}");
                return;
        }
    }

    public bool TestConnection()
    {
        try
        {
            var test = connection.Query<int>("SELECT 1");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error connecting to {DatabaseProvider}");
            Console.WriteLine(ex.Message);
            return false;
        }
    }

}