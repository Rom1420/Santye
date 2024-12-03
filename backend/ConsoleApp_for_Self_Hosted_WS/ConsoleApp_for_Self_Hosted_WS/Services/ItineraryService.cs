using ConsoleApp_for_Self_Hosted_WS.Models;
using ConsoleApp_for_Self_Hosted_WS.Services;
using ConsoleApp_for_Self_Hosted_WS;
using System.Threading.Tasks;

public class ItineraryService : IItineraryService
{
    private readonly ProxyService _proxyService = new ProxyService();

    public async Task<Itinerary> GetItinerary(string departure, string destination)
    {
        // Utiliser ProxyCacheService pour obtenir l'itinéraire
        return await _proxyService.GetItinerary(departure, destination);
    }
}
