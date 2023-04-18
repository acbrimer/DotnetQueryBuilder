namespace DotnetQueryBuilder.Core;
public class ConnectionCatalogDto
{
    public string Id { get; set; }
    public string Catalog { get; set; }
    public string ConnectionId { get; set; }
    public virtual List<ConnectionTableDto> Tables { get; set; } = new List<ConnectionTableDto>();
}