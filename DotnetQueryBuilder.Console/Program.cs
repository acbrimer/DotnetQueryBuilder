// See https://aka.ms/new-console-template for more information
using DotnetQueryBuilder.Core;
using Dapper;
using System.Dynamic;
using System.Data;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;


// Console.Write(QueryExpression.GetTypeScriptInterfaces());

var sq = new SelectQE(
    new ColumnQE("customers", "id"),
    new ColumnQE("customers", "first_name").As("Customer First Name"),
    new ColumnQE("customers", "last_name").As("Customer Last Name"),
    new BinaryQE(new ColumnQE("customers", "weight"), BinaryQEOperator.Divide, new ColumnQE("customers", "height"))
    )
    .From(new TableQE("customers"));

Console.WriteLine(sq.ToJson());


var q = new SelectQE(
    new ColumnQE("orders", "id"),
    new ColumnQE("customers", "id").As("Customer ID"),
    new ColumnQE("customers", "first_name").As("Customer First Name"),
    new ColumnQE("customers", "last_name").As("Customer Last Name"),
    new ColumnQE("orders", "total").As("Total Orders"),
    new ColumnQE("orders", "created_timestamp"),
    new SingleQE(
        new ColumnQE("ca", "zip_code")
        )
        .From(new TableQE("customer_address").As("ca"))
        .Where(
            new PredicateQE(
                new ColumnQE("customers", "id"),
                PredicateQEOperator.Equals,
                new ColumnQE("ca", "customer_id")))
        .OrderBy(
            new OrderByQE(OrderByQEDirection.DESC, new ColumnQE("ca", "created_on")))
        .As("Current Zip Code")
    )
    .From(new TableQE("customers"))
    .Join(new JoinQE(JoinQEType.INNER,
            new TableQE("orders"),
            new PredicateQE(
                new ColumnQE("customers", "id"),
                PredicateQEOperator.Equals,
                new ColumnQE("orders", "customer_id")
            )));


// Console.WriteLine(q.ToSql());
// Console.WriteLine();
// var cols = q.GetReferencedColumns();
// foreach (var c in cols)
// {
//     Console.WriteLine(string.Join(" -> ", c.ExpressionPath.Select(p => p.Name)));
//     Console.WriteLine($"    {c.Table}.{c.Name}");
// }
// string jsonExample0 = File.ReadAllText(@"example0.json");

// var example0_parsed = QueryExpression.FromJson(jsonExample0);
// Console.WriteLine(example0.ToJson());
// var visitor0 = new NpgsqlQueryExpressionVisitor();
// example0_parsed.Accept(visitor0);
// Console.WriteLine("From C#:");
// Console.WriteLine(visitor0.GetSql());



// DbProvider sqlite = new DbProvider("sqlite", "Data Source=sqliteTest.db");
// var sqlite_tables = sqlite.conn.GetTables();
// Console.WriteLine($"Sqlite Tables: {sqlite_tables.Count()}");
// foreach (var table in sqlite_tables)
//     table.PrintTable();
// Console.WriteLine("");

// string filterJson = @"{
//     ""group_id"": 1,
//     ""__and"": [
//         { ""name"": ""John"" },
//         { ""age__gt"": 30 },
//         {""__or"": [
//             { ""name"": ""Dave"" },
//             { ""name"": ""Sam"" },
//             {""__and"": [
//                 {""name"": ""Marc""},
//                 {""age"": 22}
//             ]}
//         ]}  
//     ]
// }";

// Console.WriteLine(WhereClauseBuilder.BuildWhereClause(filterJson));
