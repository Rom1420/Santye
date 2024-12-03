using ProxyItinerary = ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService.Itinerary;
using SharedItinerary = SharedModels.Itinerary;
using SharedStep = SharedModels.Step;
using ConsoleApp_for_Self_Hosted_WS;
using System.Threading.Tasks;
using ConsoleApp_for_Self_Hosted_WS.ProxyAndCacheService;
using System.Linq;
using System;
using System.Diagnostics;
using System.ServiceModel;

public class ItineraryService : IItineraryService
{
    private readonly ProxyServiceClient _proxyServiceClient = new ProxyServiceClient(
    new BasicHttpBinding
    {
        MaxReceivedMessageSize = 2147483647,
        MaxBufferSize = 2147483647,
        ReaderQuotas = new System.Xml.XmlDictionaryReaderQuotas
        {
            MaxDepth = 32,
            MaxStringContentLength = 2147483647,
            MaxArrayLength = 2147483647,
            MaxBytesPerRead = 4096,
            MaxNameTableCharCount = 2147483647
        }
    },
    new EndpointAddress("http://localhost:8081/ProxyService")
);

    public async void GetItinerary(string departure, string destination)
    {
        // Appel au service proxy via SOAP
        try
        {
            Console.WriteLine("Calling GetItineraryAsync...");
            Console.WriteLine($"Calling ProxyService at {_proxyServiceClient.Endpoint.Address}");
            ProxyItinerary proxyResult = await _proxyServiceClient.GetItineraryAsync(departure, destination);
            Console.WriteLine("Service call completed.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            throw;
        }
    }
}
