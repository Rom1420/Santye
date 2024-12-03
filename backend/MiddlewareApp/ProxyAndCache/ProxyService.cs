using SharedModels;
using ConsoleApp_for_Self_Hosted_WS;
using System;
using System.Threading.Tasks;
using System.Diagnostics;
using ConsoleApp_for_Self_Hosted_WS.Services;
using System.Text.Json;

namespace ProxyAndCache
{
    public class ProxyService : IProxyService
    {
        private readonly GenericCache<object> _cache = new GenericCache<object>(); // Cache for SharedItinerary objects

        // Reference to OpenRouteService client (assuming you have it in your project)
        private readonly OpenRouteServiceClient _openRouteServiceClient = new OpenRouteServiceClient();

        // Method to get the itinerary from the cache or external API (OpenRouteService)
        public async void GetItinerary(string departure, string destination)
        {
            string cacheKey = $"{departure}-{destination}";
            DateTimeOffset expiration = DateTimeOffset.Now.AddMinutes(30); // Example expiration, adjust as needed

            // Try to retrieve from cache
            object cachedData = await _cache.GetWithDateTimeOffset(cacheKey, expiration);
            if (cachedData != null)
            {
                Console.WriteLine($"Cache hit for key: {cacheKey}");
                _openRouteServiceClient.setUp();
                _openRouteServiceClient.SendToQueue(JsonSerializer.Serialize(cachedData));
            }

            Console.WriteLine($"Cache miss for key: {cacheKey}, fetching from external source");

            // If not found in cache, fetch from OpenRouteService
            var fetchedData = await GetItineraryFromOpenRouteService(departure, destination);

            // Add data to cache
            _cache.Add(cacheKey, fetchedData, expiration);
            _openRouteServiceClient.SendToQueue(JsonSerializer.Serialize(fetchedData));
        }

        // Method that calls OpenRouteService to get the itinerary
        private async Task<object> GetItineraryFromOpenRouteService(string departure, string destination)
        {
            var response = await _openRouteServiceClient.CalculateItinerary(departure, destination);

            // You can process and format the response as needed
            return response;
        }

    }
}
