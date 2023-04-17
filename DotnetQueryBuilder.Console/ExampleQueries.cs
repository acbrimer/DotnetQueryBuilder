// See https://aka.ms/new-console-template for more information
using DotnetQueryBuilder.Core;
using Dapper;
using System.Dynamic;
using System.Data;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DotnetQueryBuilder.Console;

public static class ExampleQueries
{
    public static Dictionary<string, QueryExpression> examples
        = new Dictionary<string, QueryExpression>();

    static ExampleQueries()
    {
        #region Simple Select
        var simpleSelect = new SelectQE(
            new ColumnQE("customers", "id"),
            new ColumnQE("customers", "first_name").As("Customer First Name"),
            new ColumnQE("customers", "last_name").As("Customer Last Name"),
            new ColumnQE("customers", "total_orders").As("Total Orders"),
            new ColumnQE("customers", "total_returns").As("Total Returns"),
            new BinaryQE(
                new ColumnQE("customers", "total_orders"),
                BinaryQEOperator.Subtract,
                new ColumnQE("customers", "total_returns")).As("Kept Orders"),
            new BinaryQE(
                new BinaryQE(
                        new ColumnQE("customers", "total_returns"),
                        BinaryQEOperator.Subtract,
                        new ColumnQE("customers", "total_orders")
                    ),
                    BinaryQEOperator.Muliply,
                    new ConstantQE(100)).As("Percent Orders Kept")
            )
        .From(new TableQE("customers"));
        examples.Add("Simple select", simpleSelect);
        #endregion

        #region Simple Join
        var simpleJoin = new SelectQE(
            new ColumnQE("c", "id"),
            new ColumnQE("c", "first_name").As("Customer First Name"),
            new ColumnQE("c", "last_name").As("Customer Last Name"),
            new AggregateQE(AggregateQEFunction.COUNT, new ColumnQE("o", "id")).As("Total Orders")
        )
        .From(new TableQE("customers").As("c"))
        .Join(new JoinQE(JoinQEType.INNER, new TableQE("orders").As("o"),
            new PredicateQE(
                new ColumnQE("c", "id"),
                PredicateQEOperator.Equals,
                new ColumnQE("o", "customer_id")
        )))
        .GroupBy(
            new ColumnQE("c", "id"),
            new ColumnQE("c", "first_name"),
            new ColumnQE("c", "last_name")
        );
        examples.Add("Simple Join", simpleJoin);
        #endregion

        #region Simple Where
        var simpleWhere = new SelectQE(
            new ColumnQE("c", "id"),
            new ColumnQE("c", "first_name").As("Customer First Name"),
            new ColumnQE("c", "last_name").As("Customer Last Name"),
            new AggregateQE(AggregateQEFunction.COUNT, new ColumnQE("o", "id")).As("Returned Orders")
        )
        .From(new TableQE("customers").As("c"))
        .Join(new JoinQE(JoinQEType.INNER, new TableQE("orders").As("o"),
            new PredicateQE(
                new ColumnQE("c", "id"),
                PredicateQEOperator.Equals,
                new ColumnQE("o", "customer_id")
        )))
        .Where(new PredicateQE(
                new ColumnQE("o", "order_status"),
                PredicateQEOperator.Equals,
                new ConstantQE("returned")
            )
        )
        .GroupBy(
            new ColumnQE("c", "id"),
            new ColumnQE("c", "first_name"),
            new ColumnQE("c", "last_name")
        )
        .OrderBy(
            new OrderByQE(OrderByQEDirection.ASC, new ColumnQE("c", "last_name")),
            new OrderByQE(OrderByQEDirection.DESC, new ColumnQE("c", "first_name"))
        );
        examples.Add("Simple Where", simpleWhere);
        #endregion

        var nestedSelect = new SelectQE(
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

        examples.Add("Nested Select", nestedSelect);


        var complexWhere = new SelectQE(
            new ColumnQE("customers", "id"),
            new ColumnQE("customers", "first_name").As("Customer First Name"),
            new ColumnQE("customers", "last_name").As("Customer Last Name"),
            new BinaryQE(new ColumnQE("customers", "weight"), BinaryQEOperator.Divide, new ColumnQE("customers", "height"))
            )
        .From(new TableQE("customers"))
        .Where(
            new OrQE(new AndQE(
                new PredicateQE(new ColumnQE("customers", "first_name"), PredicateQEOperator.Like, new ConstantQE("sam")),
                new PredicateQE(new ColumnQE("customers", "last_name"), PredicateQEOperator.Like, new ConstantQE("smith"))
                ),
                new AndQE(
                new PredicateQE(new ColumnQE("customers", "first_name"), PredicateQEOperator.Like, new ConstantQE("dave")),
                new PredicateQE(new ColumnQE("customers", "last_name"), PredicateQEOperator.Like, new ConstantQE("smith"))
                )));
        examples.Add("Complex Where", complexWhere);
    }


    public static string GetExampleJSON()
    {
        return string.Join("\n\n", examples.Select((kv) => $"{kv.Key}:\n{kv.Value.ToJson()}"));
    }

    public static string GetExampleJSON(string example)
    {
        if (examples.Keys.Contains(example))
            return examples[example].ToJson();
        return null;
    }

    public static string GetExampleSql()
    {
        return string.Join("\n\n", examples.Select((kv) => $"--{kv.Key}:\n{kv.Value.ToSql()}"));
    }

    public static string GetExampleSql(string example)
    {
        if (examples.Keys.Contains(example))
            return examples[example].ToSql();
        return null;
    }

}

