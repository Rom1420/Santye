using System;
using System.Collections.Generic;

namespace ConsoleApp_for_Self_Hosted_WS.Models
{
    public class Itinerary
    {
        public List<Step> Steps { get; set; }
    }

    public class Step
    {
        public string Instruction { get; set; }
        public double Distance { get; set; }
    }

}
