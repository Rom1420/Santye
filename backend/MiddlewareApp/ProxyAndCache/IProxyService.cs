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
        [WebInvoke(Method = "POST", UriTemplate = "/ProxyService", RequestFormat = WebMessageFormat.Xml, ResponseFormat = WebMessageFormat.Xml)]
        void GetItinerary(string departure, string destination);

    }
}
