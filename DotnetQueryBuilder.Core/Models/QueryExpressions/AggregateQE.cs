
namespace DotnetQueryBuilder.Core;

using System.Collections.Generic;
using Newtonsoft.Json;

public class AggregateQE : QueryExpression, IColumnExpression, IAggregateExpression
{
    public AggregateQEFunction Function { get; set; }
    public IScalarExpression Expression { get; set; }
    public string? Alias { get; set; }
    public AggregateQE(AggregateQEFunction function, IScalarExpression expression)
    {
        Function = function;
        Expression = expression;
    }
    public IColumnExpression As(string alias)
    {
        Alias = alias;
        return this;
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
        return Expression.GetReferencedColumns();
    }
}

[JsonConverter(typeof(AggregateQEFunctionConverter))]
public enum AggregateQEFunction
{
    COUNT,
    COUNTD,
    MIN,
    MAX,
    SUM,
    AVG
}

public class AggregateQEFunctionConverter : JsonConverter<AggregateQEFunction>
{
    public override AggregateQEFunction ReadJson(JsonReader reader, Type objectType, AggregateQEFunction existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String)
        {
            string value = reader.Value.ToString().ToUpper();
            if (Enum.TryParse<AggregateQEFunction>(value, true, out AggregateQEFunction result))
                return result;
            return AggregateQEFunction.COUNT;
        }

        throw new JsonSerializationException($"Invalid value '{reader.Value}' for type '{typeof(AggregateQEFunction)}'.");
    }
    public override void WriteJson(JsonWriter writer, AggregateQEFunction value, JsonSerializer serializer)
    {
        writer.WriteValue(value.ToString().ToLower());
    }

}


