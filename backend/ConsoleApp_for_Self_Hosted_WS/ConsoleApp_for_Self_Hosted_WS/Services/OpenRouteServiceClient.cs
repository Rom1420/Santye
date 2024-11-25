using ConsoleApp_for_Self_Hosted_WS.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ConsoleApp_for_Self_Hosted_WS.Services
{
    public class OpenRouteServiceClient
    {
        private static readonly HttpClient client = new HttpClient();
        private readonly string _apiKey = "5b3ce3597851110001cf62480c8234b09f1441898dd7ee417b09d025";
        private readonly string _apiUrl = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

        public async Task<Itinerary> GetItinerary(string departure, string destination)
        {
            // Extraire les coordonnées des points de départ et de destination
            string[] departureCoords = departure.Split(',');
            string[] destinationCoords = destination.Split(',');

            double departureLat = double.Parse(departureCoords[0], System.Globalization.CultureInfo.InvariantCulture);
            double departureLon = double.Parse(departureCoords[1], System.Globalization.CultureInfo.InvariantCulture);
            double destinationLat = double.Parse(destinationCoords[0], System.Globalization.CultureInfo.InvariantCulture);
            double destinationLon = double.Parse(destinationCoords[1], System.Globalization.CultureInfo.InvariantCulture);

            // Création du corps de la requête JSON
            var requestBody = new
            {
                coordinates = new[]
                {
                    new[] { departureLon, departureLat },
                    new[] { destinationLon, destinationLat }
                },
                instructions = true
            };

            // Convertir la requête en JSON
            var json = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Ajouter les en-têtes nécessaires
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            try
            {
                // Faire la requête POST
                var response = await client.PostAsync(_apiUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Erreur lors de l'appel à l'API externe : {response.ReasonPhrase}");
                }

                // Lire la réponse JSON
                var responseString = await response.Content.ReadAsStringAsync();
                var itineraryData = JsonConvert.DeserializeObject<dynamic>(responseString);

                // Convertir la réponse en un objet `Itinerary`
                var itinerary = new Itinerary { Steps = new List<Step>() };

                foreach (var step in itineraryData.features[0].properties.segments[0].steps)
                {
                    itinerary.Steps.Add(new Step
                    {
                        Instruction = step.instruction.ToString(),
                        Distance = (double)step.distance
                    });
                }

                return itinerary;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de la récupération de l'itinéraire : {ex.Message}");
                throw;
            }
        }
    }
}
