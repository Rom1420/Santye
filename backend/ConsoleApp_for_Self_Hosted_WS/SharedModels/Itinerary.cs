using System;
using System.Collections.Generic;

namespace SharedModels
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

