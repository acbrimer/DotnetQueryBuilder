public static class StringExtensions
{
    public static string ToCamelCase(this string str)
    {
        if (string.IsNullOrEmpty(str))
        {
            return str;
        }

        var words = str.Split(new[] { ' ', '\t', '\n', '_' }, StringSplitOptions.RemoveEmptyEntries);
        if (words.Length == 1)
        {
            return char.ToLowerInvariant(str[0]) + str.Substring(1);
        }

        var camelCaseWords = words.Select((word, index) => index == 0 ? char.ToLowerInvariant(word[0]) + word.Substring(1) : char.ToUpperInvariant(word[0]) + word.Substring(1));
        return string.Concat(camelCaseWords);
    }
}
