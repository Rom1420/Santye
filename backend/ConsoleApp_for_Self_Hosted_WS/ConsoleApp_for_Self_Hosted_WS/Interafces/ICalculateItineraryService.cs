using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Web;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using SharedModels;

namespace ConsoleApp_for_Self_Hosted_WS.Services
{
    [ServiceContract]
    public interface ICalculateItineraryService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/CalculateItinerary?departure={departure}&arrival={arrival}")]
        Task<Itinerary> CalculateItinerary(string departure, string arrival);
    }
}
