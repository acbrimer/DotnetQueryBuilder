namespace DotnetQueryBuilder.Core;

using System.Collections.Generic;
using Newtonsoft.Json;

public class JoinQE : QueryExpression, IJoinExpression
{
    public JoinQEType JoinType { get; set; }
    public ITableExpression Target { get; set; }
    public IPredicateExpression Condition { get; set; }

    public JoinQE(JoinQEType joinType, ITableExpression target, IPredicateExpression condition)
    {
        JoinType = joinType;
        Target = target;
        Condition = condition;
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
        return Condition.GetReferencedColumns();
    }
}

[JsonConverter(typeof(JoinQETypeConverter))]
public enum JoinQEType
{
    INNER,
    LEFT
}

public class JoinQETypeConverter : JsonConverter<JoinQEType>
{
    public override JoinQEType ReadJson(JsonReader reader, Type objectType, JoinQEType existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String)
        {
            string value = reader.Value.ToString().ToUpper();
            if (Enum.TryParse<JoinQEType>(value, true, out JoinQEType result))
                return result;
            return JoinQEType.INNER;
        }

        throw new JsonSerializationException($"Invalid value '{reader.Value}' for type '{typeof(JoinQEType)}'.");
    }
    public override void WriteJson(JsonWriter writer, JoinQEType value, JsonSerializer serializer)
    {
        writer.WriteValue(value.ToString().ToLower());
    }
}
