
namespace DotnetQueryBuilder.Core;

using Newtonsoft.Json;
public class PredicateQE : QueryExpression, IPredicateExpression
{
    public PredicateQEOperator Operator { get; set; }
    public IColumnExpression Left { get; set; }
    public IColumnExpression Right { get; set; }

    public PredicateQE(IColumnExpression left, PredicateQEOperator op, IColumnExpression right) {
        Left = left;
        Operator = op;
        Right = right;
    }
    public override void Accept(IQueryExpressionVisitor visitor)
    {
        visitor.OpenScope(this);
        ExpressionPath = visitor.GetPath();
        visitor.Visit(this);
        visitor.CloseScope(this);
    }

    public override List<ColumnQE> GetReferencedColumns()
    {
        return Left.GetReferencedColumns().Concat(Right.GetReferencedColumns()).ToList();
    }
}

[JsonConverter(typeof(PredicateQEOperatorConverter))]
public enum PredicateQEOperator
{
    Equals,
    Like,
    In,
    GreaterThan,
    GreaterThanOrEqualTo,
    LessThan,
    LessThanOrEqualTo
}



public class PredicateQEOperatorConverter : JsonConverter<PredicateQEOperator>
{
    public static readonly Dictionary<PredicateQEOperator, string> toJson =
        new Dictionary<PredicateQEOperator, string>() {
            {PredicateQEOperator.Equals, "eq"},
            {PredicateQEOperator.Like, "like"},
            {PredicateQEOperator.In, "in"},
            {PredicateQEOperator.GreaterThan, "gt"},
            {PredicateQEOperator.GreaterThanOrEqualTo, "gte"},
            {PredicateQEOperator.LessThan, "lt"},
            {PredicateQEOperator.LessThanOrEqualTo, "lte"},
        };
    public static readonly Dictionary<string, PredicateQEOperator> fromJson =
        new Dictionary<string, PredicateQEOperator>() {
            {"eq", PredicateQEOperator.Equals},
            {"like", PredicateQEOperator.Like},
            {"in", PredicateQEOperator.In},
            {"gt", PredicateQEOperator.GreaterThan},
            {"gte", PredicateQEOperator.GreaterThanOrEqualTo},
            {"lt", PredicateQEOperator.LessThan},
            {"lte", PredicateQEOperator.LessThanOrEqualTo},
        };
    public override PredicateQEOperator ReadJson(JsonReader reader, Type objectType, PredicateQEOperator existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String && reader.Value is not null)
        {
            var value = reader.Value.ToString();
            if (fromJson.Keys.Contains(value))
                return fromJson[value];
        }

        throw new JsonSerializationException($"Invalid value '{reader.Value}' for type '{typeof(PredicateQEOperator)}'.");
    }
    public override void WriteJson(JsonWriter writer, PredicateQEOperator value, JsonSerializer serializer)
    {
        writer.WriteValue(toJson[value]);
    }
}


