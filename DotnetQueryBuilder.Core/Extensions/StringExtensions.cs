using System.Security.Cryptography;
using System.Text;

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

    public static string ToMD5(this string data)
    {
        return ComputeHash(data, "md5");
    }
    public static string ComputeHash(this string data, string hashAlogorithm)
    {
        byte[] bytes = null;
        switch (hashAlogorithm.ToLower())
        {
            case "md5":
                using (MD5 md5Hash = MD5.Create())
                {
                    bytes = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(data));
                }
                break;
            case "sha1":
                using (SHA1 sha1Hash = SHA1.Create())
                {
                    bytes = sha1Hash.ComputeHash(Encoding.UTF8.GetBytes(data));
                }
                break;
            case "sha256":
                using (SHA256 sha256Hash = SHA256.Create())
                {
                    bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(data));
                }
                break;
            case "sha384":
                using (SHA384 sha384Hash = SHA384.Create())
                {
                    bytes = sha384Hash.ComputeHash(Encoding.UTF8.GetBytes(data));
                }
                break;
            case "sha512":
                using (SHA512 sha512Hash = SHA512.Create())
                {
                    bytes = sha512Hash.ComputeHash(Encoding.UTF8.GetBytes(data));
                }
                break;
        }

        if (bytes.Length > 0)
        {
            // Convert byte array to a string   
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2"));
            }
            return builder.ToString();
        }
        else return null;
    }
}
