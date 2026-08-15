namespace SecondBrain.Api.Models;

public class Item
{
    public int Id { get; set; }
    public string ItemType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? Url { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateItemRequest
{
    public string ItemType { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? Url { get; set; }
}
