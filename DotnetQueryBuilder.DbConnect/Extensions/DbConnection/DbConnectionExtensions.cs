namespace DotnetQueryBuilder.DbConnect;

using System.Collections.Generic;
using System.Data.Common;
using Npgsql;
using System.Linq;
using System.Data.SQLite;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using DotnetQueryBuilder.Core;


public static class DbConnectionExtensions
{
    public static IEnumerable<DbSchemaTable> GetTables(this DbConnection connection)
    {
        Type connectionType = connection.GetType();
        if (connectionType == typeof(NpgsqlConnection))
            return ((NpgsqlConnection)connection).GetTables();
        if (connectionType == typeof(SQLiteConnection))
            return ((SQLiteConnection)connection).GetTables();
        if (connectionType == typeof(MySqlConnection))
            return ((MySqlConnection)connection).GetTables();
        if (connectionType == typeof(SqlConnection))
            return ((SqlConnection)connection).GetTables();
        throw new NotImplementedException($"Error: `GetTables` not implemented for {connection.GetType()}");
    }
    public static string BuildQueryExpression(this DbConnection connection, QueryExpression qe)
    {
        Type connectionType = connection.GetType();
        if (connectionType == typeof(NpgsqlConnection))
            return ((NpgsqlConnection)connection).BuildQueryExpression(qe);

        throw new NotImplementedException($"Error: `BuildQueryExpression` not implemented for {connection.GetType()}");
    }
}
