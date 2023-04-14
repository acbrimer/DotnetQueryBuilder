namespace DotnetQueryBuilder.Core;

using Newtonsoft.Json;



public class BinaryQE : QueryExpression, IColumnExpression, IScalarExpression
{


    public BinaryQEOperator Operator { get; set; }
    public IColumnExpression Left { get; set; }
    public IColumnExpression Right { get; set; }
    public string? Alias { get; set; }

    public BinaryQE(IColumnExpression left, BinaryQEOperator op, IColumnExpression right)
    {
        Operator = op;
        Left = left;
        Right = right;
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
        return Left.GetReferencedColumns().Concat(Right.GetReferencedColumns()).ToList();
    }

}


[JsonConverter(typeof(BinaryQEOperatorConverter))]
public enum BinaryQEOperator
{
    Add,
    Subtract,
    Muliply,
    Divide
}


public class BinaryQEOperatorConverter : JsonConverter<BinaryQEOperator>
{
    public override BinaryQEOperator ReadJson(JsonReader reader, Type objectType, BinaryQEOperator existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.String)
        {
            string value = reader.Value.ToString();
            if (Enum.TryParse<BinaryQEOperator>(value, true, out BinaryQEOperator result))
            {
                return result;
            }
        }

        throw new JsonSerializationException($"Invalid value '{reader.Value}' for type '{typeof(BinaryQEOperator)}'.");
    }
    public override void WriteJson(JsonWriter writer, BinaryQEOperator value, JsonSerializer serializer)
    {
        writer.WriteValue(value.ToString().ToLower());
    }
}
