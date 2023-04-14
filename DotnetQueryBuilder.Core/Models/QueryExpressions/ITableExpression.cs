
namespace DotnetQueryBuilder.Core;

public interface ITableExpression : IQueryExpression
{
    string? Alias { get; set; }

    // Dictionary<string, string> OutputColumns { get; set; }

    Dictionary<string, string> GetOutputColumns();
}
