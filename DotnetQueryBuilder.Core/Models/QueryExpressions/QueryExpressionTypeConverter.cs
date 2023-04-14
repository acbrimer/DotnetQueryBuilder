
namespace DotnetQueryBuilder.Core;

using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class QueryExpressionTypeConverter : JsonConverter
{
    private static Dictionary<string, Type> TypeMappings = new Dictionary<string, Type>();

    static QueryExpressionTypeConverter()
    {
        foreach (Type qeType in Assembly.GetAssembly(typeof(QueryExpression)).GetTypes()
            .Where(t => t.IsSubclassOf(typeof(QueryExpression))))
        {
            var qeName = qeType.Name.Substring(0, qeType.Name.Length - 2).ToLower();
            TypeMappings.Add(qeName, qeType);
        }
    }

    public override bool CanConvert(Type objectType)
    {
        return typeof(IQueryExpression).IsAssignableFrom(objectType);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        JObject jsonObject = JObject.Load(reader);

        if (jsonObject == null || !jsonObject.HasValues)
        {
            return null;
        }

        string typeName = jsonObject.Value<string>("_type");
        if (string.IsNullOrEmpty(typeName))
        {
            return null;
        }

        Type mappedType;
        if (!TypeMappings.TryGetValue(typeName.ToLower(), out mappedType))
        {
            throw new InvalidOperationException($"Could not map type '{typeName}' to a valid .NET type.");
        }

        var obj = Activator.CreateInstance(mappedType);

        if (obj is QueryExpression)
        {
            // Recursively deserialize nested objects
            foreach (var property in mappedType.GetProperties())
            {
                if (typeof(IQueryExpression).IsAssignableFrom(property.PropertyType))
                {
                    var nestedObject = property.GetValue(obj);
                    if (nestedObject != null)
                    {
                        JToken nestedToken = jsonObject.SelectToken(property.Name);
                        if (nestedToken != null)
                        {
                            var nestedConverter = new QueryExpressionTypeConverter();
                            property.SetValue(obj, nestedConverter.ReadJson(nestedToken.CreateReader(), property.PropertyType, nestedObject, serializer));
                        }
                    }
                }
                // Handle nested arrays to `IEnumerable<IQueryExpression>` props
                else if (typeof(IEnumerable<IQueryExpression>).IsAssignableFrom(property.PropertyType))
                {
                    var nestedToken = jsonObject.SelectToken(property.Name);
                    if (nestedToken != null)
                    {
                        var nestedConverter = new QueryExpressionTypeConverter();
                        var itemType = property.PropertyType.GetGenericArguments().FirstOrDefault();
                        var items = nestedToken.ToObject(typeof(List<>).MakeGenericType(itemType), serializer);
                        property.SetValue(obj, items);
                    }
                }
            }
            // Populate other properties using the serializer
            serializer.Populate(jsonObject.CreateReader(), obj);
        }

        return obj;
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        throw new NotImplementedException();
    }
}
