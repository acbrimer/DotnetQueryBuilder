namespace DotnetQueryBuilder.Core;

public class ConnectionDto
{
    public string? Id { get; set; }
    public string? ConnectionString { get; set; }
    public string Provider { get; set; }
    public bool? Connected { get; set; }
    public string? Host { get; set; }
    public string? Database { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }



    public ConnectionDto(string provider, string? host, string? database, string? username, string? password)
    {
        Provider = provider;
        Host = host;
        Database = database;
        Username = username;
        Password = password;
        switch (provider.ToLower())
        {
            case "postgres":
                ConnectionString = GetPostgresConnectionString(host, database, username, password);
                break;
            case "sqlite":
                ConnectionString = GetSqliteConnectionString(host);
                break;
            default:
                ConnectionString = null;
                break;
        }
        if (ConnectionString != null)
            Id = ConnectionString.ToMD5();
    }



    public static string GetPostgresConnectionString(string host, string database, string username, string password)
    {
        return $"Host={host};Database={database};Username={username};Password={password}";
    }

    public static string GetSqliteConnectionString(string host)
    {
        return $"Data Source={host}";
    }

}