using System;
using System.Collections.Generic;
using static ConsoleApp_for_Self_Hosted_WS.Services.OpenRouteServiceClient;

namespace ConsoleApp_for_Self_Hosted_WS.Models
{
    public class Itinerary
    {
        public List<Step> Steps { get; set; }
    }

}
