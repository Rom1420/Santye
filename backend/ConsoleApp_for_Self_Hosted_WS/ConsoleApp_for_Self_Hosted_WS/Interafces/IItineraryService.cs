using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
// add assembly System.ServiceModel  and using for the corresponding model
using System.ServiceModel;
using System.ServiceModel.Web;
using ConsoleApp_for_Self_Hosted_WS.Models;

namespace ConsoleApp_for_Self_Hosted_WS
{

    [ServiceContract]
    public interface IItineraryService
    {
        [OperationContract]
        [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetItinerary?departure={departure}&arrival={arrival}")]
        Task<Itinerary> GetItinerary(string departure, string arrival);
    }

}
