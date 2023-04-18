namespace DotnetQueryBuilder.Core;

public class ConnectionSchemaDto
{
    public string Id { get; set; }
    public virtual List<ConnectionCatalogDto> Catalogs { get; set; } = new List<ConnectionCatalogDto>();
}