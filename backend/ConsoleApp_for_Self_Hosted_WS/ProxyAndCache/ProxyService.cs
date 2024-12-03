using SharedModels;
using ConsoleApp_for_Self_Hosted_WS;
using System;
using System.Threading.Tasks;
using System.Diagnostics;
using ConsoleApp_for_Self_Hosted_WS.Services;

namespace ProxyAndCache
{
    public class ProxyService : IProxyService
    {
        private readonly GenericCache<Itinerary> _cache = new GenericCache<Itinerary>(); // Cache for SharedItinerary objects
        private static readonly string CacheExpirationKey = "CacheExpirationKey"; // You can customize expiration logic if needed

        // Reference to OpenRouteService client (assuming you have it in your project)
        private readonly OpenRouteServiceClient _openRouteServiceClient = new OpenRouteServiceClient();

        // Method to get the itinerary from the cache or external API (OpenRouteService)
        public async Task<Itinerary> GetItinerary(string departure, string destination)
        {
            string cacheKey = $"{departure}-{destination}";
            DateTimeOffset expiration = DateTimeOffset.Now.AddMinutes(30); // Example expiration, adjust as needed

            // Try to retrieve from cache
            Itinerary cachedData = await _cache.GetWithDateTimeOffset(cacheKey, expiration);
            if (cachedData != null)
            {
                Trace.WriteLine($"Cache hit for key: {cacheKey}");
                return cachedData;
            }

            Trace.WriteLine($"Cache miss for key: {cacheKey}, fetching from external source");

            // If not found in cache, fetch from OpenRouteService
            var fetchedData = await GetItineraryFromOpenRouteService(departure, destination);

            // Add data to cache
            _cache.Add(cacheKey, fetchedData, expiration);

            return fetchedData;
        }

        // Method that calls OpenRouteService to get the itinerary
        private async Task<Itinerary> GetItineraryFromOpenRouteService(string departure, string destination)
        {
            var response = await _openRouteServiceClient.CalculateItinerary(departure, destination);

            // You can process and format the response as needed
            return response;
        }

    }
}
