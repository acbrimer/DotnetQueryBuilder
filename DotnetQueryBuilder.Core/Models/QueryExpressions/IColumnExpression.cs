namespace DotnetQueryBuilder.Core;

public interface IColumnExpression : IQueryExpression
{
    string? Alias { get; set; }

    IColumnExpression As(string alias);
}
