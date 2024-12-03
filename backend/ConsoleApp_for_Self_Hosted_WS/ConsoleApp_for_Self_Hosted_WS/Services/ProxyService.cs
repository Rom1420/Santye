using ConsoleApp_for_Self_Hosted_WS.Models;
using System;
using System.Runtime.Caching;
using ConsoleApp_for_Self_Hosted_WS.services.ConsoleApp_for_Self_Hosted_WS.Services;
using System.Threading.Tasks;

namespace ConsoleApp_for_Self_Hosted_WS.Services
{
    public class ProxyService : IProxyService
    {
        private static readonly OpenRouteServiceClient _openRouteServiceClient = new OpenRouteServiceClient();
        private static readonly GenericCache<Itinerary> _cache = new GenericCache<Itinerary>();

        public async Task<Itinerary> GetItinerary(string departure, string destination)
        {
            string cacheKey = $"{departure}-{destination}";

            // Vérifier si l'itinéraire est déjà en cache
            var cachedItinerary = _cache.Get(cacheKey);
            if (cachedItinerary != null)
            {
                Console.WriteLine("Using cached data");
                return cachedItinerary;
            }

            // Si l'itinéraire n'est pas en cache, utiliser le client pour obtenir l'itinéraire
            Console.WriteLine("Using CalculateItinerary departure/destination : "+$"{departure}/{destination}");
            var itinerary = await _openRouteServiceClient.CalculateItinerary(departure, destination);

            // Ajouter au cache avec une durée d'expiration par défaut
            _cache.Add(cacheKey, itinerary, DateTimeOffset.Now.AddMinutes(5));

            return itinerary;
        }
    }
}   
