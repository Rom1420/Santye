using ConsoleApp_for_Self_Hosted_WS.Models;
using System.ServiceModel.Web;
using System.ServiceModel;
using System.Threading.Tasks;

namespace ConsoleApp_for_Self_Hosted_WS.services
{
    namespace ConsoleApp_for_Self_Hosted_WS.Services
    {
        [ServiceContract]
        public interface IProxyService
        {
            [OperationContract]
            [WebInvoke(Method = "POST", UriTemplate = "/getCachedItinerary", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
            Task<Itinerary> GetItinerary(string departure, string destination);
        }
    }
}
