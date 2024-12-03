using SharedModels;
using System.ServiceModel.Web;
using System.ServiceModel;
using System.Threading.Tasks;

namespace ProxyAndCache
{
    [ServiceContract]
    public interface IProxyService
    {
        [OperationContract]
        Task<Itinerary> GetItinerary(string departure, string destination);

    }
}
