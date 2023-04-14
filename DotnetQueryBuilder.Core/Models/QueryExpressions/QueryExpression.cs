
using System.Reflection;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DotnetQueryBuilder.Core;

public abstract class QueryExpression : IQueryExpression
{
    [JsonProperty("_type")]
    public string ExpressionType
    {
        get =>
        this.GetType().Name.Substring(0, this.GetType().Name.Length - 2).ToLower();
    }

    [JsonIgnore]
    private QueryExpressionVisitor _builder = new QueryExpressionVisitor();

    [JsonIgnore]
    private List<Type> _expressionPath = new List<Type>();
    [JsonIgnore]
    public List<Type> ExpressionPath { get => _expressionPath; set => _expressionPath.AddRange(value); }

    public virtual void Accept(IQueryExpressionVisitor visitor)
    {
        throw new NotImplementedException($"Accept not implemented for type {this.GetType().Name}");
    }

    public static QueryExpression FromJson(string json)
    {
        var settings = new JsonSerializerSettings
        {
            TypeNameHandling = TypeNameHandling.Objects,
            Converters = new List<JsonConverter> { new QueryExpressionTypeConverter() },
            NullValueHandling = NullValueHandling.Ignore
        };
        return JsonConvert.DeserializeObject<QueryExpression>(json, settings);
    }
    public string ToJson()
    {
        var serializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.Indented,
            NullValueHandling = NullValueHandling.Ignore
        };
        return JsonConvert.SerializeObject(this, serializerSettings);
    }
    public string ToSql()
    {
        _builder.Reset();
        Accept(_builder);
        return _builder.GetSql();
    }

    public virtual List<ColumnQE> GetReferencedColumns()
    {
        return new List<ColumnQE>();
    }

    public static string TypeToTypescript(Type type)
    {
        switch (Type.GetTypeCode(type))
        {
            case TypeCode.Boolean:
                return "boolean";
            case TypeCode.Byte:
            case TypeCode.Decimal:
            case TypeCode.Double:
            case TypeCode.Int16:
            case TypeCode.Int32:
            case TypeCode.Int64:
            case TypeCode.SByte:
            case TypeCode.Single:
            case TypeCode.UInt16:
            case TypeCode.UInt32:
            case TypeCode.UInt64:
                return "number";
            case TypeCode.Char:
            case TypeCode.String:
                return "string";
            default:
                if (type.IsArray)
                {
                    return TypeToTypescript(type.GetElementType()) + "[]";
                }
                else if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    return TypeToTypescript(type.GetGenericArguments()[0]) + " | null";
                }
                else
                {
                    return "any";
                }
        }
    }

    public static string ToTypeScriptInterface(Type expressionType)
    {
        var props = new List<(string name, string type)>();
        var enumTypes = new List<string>();
        foreach (var prop in expressionType.GetProperties())
        {
            String name = prop.Name;
            var type = TypeToTypescript(prop.PropertyType);
            var interfaces = new List<string>();
            if (name == "ExpressionPath")
                continue;
            if (name == "ExpressionType")
            {
                name = "_type";
                type = $"'{expressionType.Name.Substring(0, expressionType.Name.Length - 2).ToLower()}'";
            }
            else if (typeof(IQueryExpression).IsAssignableFrom(prop.PropertyType))
            {
                foreach (Type qeType in Assembly.GetAssembly(typeof(QueryExpression)).GetTypes()
                    .Where(t => prop.PropertyType.IsAssignableFrom(t) && t.Name.EndsWith("QE")))
                {
                    interfaces.Add($"I{qeType.Name}");
                }
                type = string.Join(" | ", interfaces);
            }
            else if (typeof(IEnumerable<IQueryExpression>).IsAssignableFrom(prop.PropertyType))
            {
                var itemType = prop.PropertyType.GetGenericArguments().FirstOrDefault();
                foreach (Type qeType in Assembly.GetAssembly(typeof(QueryExpression)).GetTypes()
                    .Where(t => itemType.IsAssignableFrom(t) && t.Name.EndsWith("QE")))
                {
                    interfaces.Add($"I{qeType.Name}");
                }
                if (interfaces.Count > 1)
                    type = "(" + string.Join(" | ", interfaces) + ")[]";
                else
                    type = interfaces[0] + "[]";
            }
            else if (prop.PropertyType.IsEnum)
            {
                var enumValues = new List<string>();
                var enumNames = Enum.GetNames(prop.PropertyType).Select(n => $"'{n}'").ToList();
                var enumValuesString = string.Join(" | ", enumNames);
                enumTypes.Add($"type {prop.PropertyType.Name} = {enumValuesString}");
                type = prop.PropertyType.Name;
            }
            props.Add((name.ToCamelCase(), type));
        }
        var sb = new StringBuilder();
        foreach (var enumType in enumTypes)
            sb.AppendLine($"{enumType};");
        sb.AppendLine($"interface I{expressionType.Name} extends IQueryExpression {{");
        var p = string.Join("\n", props.Select(p => $"  {p.name}: {p.type};"));
        sb.Append(p);
        sb.AppendLine("\n}");
        return sb.ToString();
    }

    public static string GetTypeScriptInterfaces()
    {
        var sb = new StringBuilder();
        var typeNames = Assembly.GetAssembly(typeof(QueryExpression)).GetTypes()
                    .Where(t => typeof(QueryExpression).IsAssignableFrom(t) && t.Name.EndsWith("QE"))
                    .Select(t => $"'{t.Name.Substring(0, t.Name.Length - 2).ToLower()}'");
        var typeNamesString = string.Join(" | ", typeNames);
        sb.AppendLine("interface IQueryExpression {");
        sb.AppendLine($"    _type: {typeNamesString};");
        sb.AppendLine("}");
        foreach (Type qeType in Assembly.GetAssembly(typeof(QueryExpression)).GetTypes()
                    .Where(t => typeof(QueryExpression).IsAssignableFrom(t) && t.Name.EndsWith("QE")))
        {
            sb.Append(ToTypeScriptInterface(qeType));
        }
        return sb.ToString();
    }

}