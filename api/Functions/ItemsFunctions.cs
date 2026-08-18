using System.Net;
using System.Text.Json;
using Dapper;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SecondBrain.Api.Models;

namespace SecondBrain.Api.Functions;

public class ItemsFunctions
{
    private readonly IConfiguration _config;
    private readonly ILogger<ItemsFunctions> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public ItemsFunctions(IConfiguration config, ILogger<ItemsFunctions> logger)
    {
        _config = config;
        _logger = logger;
    }

    private SqlConnection CreateConnection() =>
        new(_config["SqlConnectionString"]);

    // POST /api/items
    [Function("CreateItem")]
    public async Task<HttpResponseData> CreateItem(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "items")] HttpRequestData req)
    {
        _logger.LogInformation("POST /api/items");

        CreateItemRequest? body;
        try
        {
            body = await JsonSerializer.DeserializeAsync<CreateItemRequest>(
                req.Body, JsonOptions);
        }
        catch
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("Invalid JSON body.");
            return bad;
        }

        if (body is null || string.IsNullOrWhiteSpace(body.Title) || string.IsNullOrWhiteSpace(body.ItemType))
        {
            var bad = req.CreateResponse(HttpStatusCode.BadRequest);
            await bad.WriteStringAsync("'title' and 'itemType' are required.");
            return bad;
        }

        const string sql = """
            INSERT INTO Items (ItemType, Title, Content, Url)
            OUTPUT INSERTED.*
            VALUES (@ItemType, @Title, @Content, @Url);
            """;

        await using var conn = CreateConnection();
        var created = await conn.QuerySingleAsync<Item>(sql, body);

        var response = req.CreateResponse(HttpStatusCode.Created);
        response.Headers.Add("Content-Type", "application/json");
        await response.WriteStringAsync(JsonSerializer.Serialize(created, JsonOptions));
        return response;
    }

    // GET /api/items
    [Function("GetItems")]
    public async Task<HttpResponseData> GetItems(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "items")] HttpRequestData req)
    {
        _logger.LogInformation("GET /api/items");

        const string sql = "SELECT * FROM Items ORDER BY CreatedAt DESC;";

        await using var conn = CreateConnection();
        var items = await conn.QueryAsync<Item>(sql);

        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "application/json");
        await response.WriteStringAsync(JsonSerializer.Serialize(items, JsonOptions));
        return response;
    }
}
