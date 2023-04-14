
namespace DotnetQueryBuilder.Core;

using System.Collections.Generic;
using Newtonsoft.Json;

public class OrderByQE : QueryExpression
{
    public OrderByQEDirection Direction { get; set; }
    public IColumnExpression Column { get; set; }
    public string? Alias { get; set; }

    public OrderByQE(OrderByQEDirection direction, IColumnExpression column, string? alias = null)
    {
        Direction = direction;
        Column = column;
        Alias = alias;
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
        return Column.GetReferencedColumns();
    }
}

[JsonConverter(typeof(OrderByQEDirectionConverter))]
public enum OrderByQEDirection
{
    ASC,
    DESC,
}

public class OrderByQEDirectionConverter : JsonConverter<OrderByQEDirection>
{
    public override OrderByQEDirection ReadJson(JsonReader reader, Type objectType, OrderByQEDirection existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String)
        {
            string value = reader.Value.ToString().ToUpper();
            if (Enum.TryParse<OrderByQEDirection>(value, true, out OrderByQEDirection result))
                return result;
            return OrderByQEDirection.ASC;
        }

        throw new JsonSerializationException($"Invalid value '{reader.Value}' for type '{typeof(OrderByQEDirection)}'.");
    }
    public override void WriteJson(JsonWriter writer, OrderByQEDirection value, JsonSerializer serializer)
    {
        writer.WriteValue(value.ToString().ToLower());
    }

}


