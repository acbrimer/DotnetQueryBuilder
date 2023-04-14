
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static class WhereClauseParser
{
    static WhereClauseParser()
    {

    }

    public static void Parse(string json)
    {
        var jObject = JObject.Parse(json);
        foreach (var property in jObject.Properties())
        {
            var columnName = property.Name;

            // Handle special case where "__or" is used
            if (columnName == "__or")
            {

            }
            // Handle special case where "__and" is used
            else if (columnName == "__and")
            {
                
            }
            // Handle other cases
            else
            {
                var columnType = typeof(string);
                var columnValue = JsonConvert.DeserializeObject(property.Value.ToString());
                var targetType = columnType;
                if (Nullable.GetUnderlyingType(columnType) != null)
                    targetType = Nullable.GetUnderlyingType(columnType);

                /// handle `in(...)` clause
                if (columnValue is JArray arrayValue)
                {

                }
                else
                {
                    var op = "=";

                    if (columnType == typeof(string))
                    {
                        op = "LIKE";
                        columnValue = "%" + columnValue + "%";
                    }
                    else if (columnType == typeof(DateTime))
                    {
                        columnValue = DateTime.Parse(columnValue.ToString());
                    }
                    else if (columnType.IsPrimitive)
                    {
                        op = "=";
                        columnValue = Convert.ChangeType(columnValue, targetType);
                    }

                }
            }


        }
    }

}