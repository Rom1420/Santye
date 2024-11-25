using ConsoleApp_for_Self_Hosted_WS.Models;
using ConsoleApp_for_Self_Hosted_WS.Services;
using ConsoleApp_for_Self_Hosted_WS;
using System.Threading.Tasks;

public class ItineraryService : IItineraryService
{
    private readonly ProxyService _proxyService = new ProxyService();

    public async Task<Itinerary> FindItinerary(ItineraryRequest request)
    {
        // Utiliser ProxyCacheService pour obtenir l'itinéraire
        return await _proxyService.GetCachedItinerary(request.Departure, request.Destination);
    }
}
