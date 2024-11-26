using System;
using System.ServiceModel;
using System.ServiceModel.Description;
using ConsoleApp_for_Self_Hosted_WS.Services;

namespace ConsoleApp_for_Self_Hosted_WS
{
    class Program
    {
        static void Main(string[] args)
        {
            // Créer une URI pour le service ItineraryService
            Uri httpUrl = new Uri("http://localhost:8081/api/ItineraryService");

            // Créer un ServiceHost pour l'ItineraryService
            ServiceHost host = new ServiceHost(typeof(ItineraryService), httpUrl);

            // Ajouter un point de terminaison RESTful
            host.AddServiceEndpoint(typeof(IItineraryService), new WebHttpBinding(), "rest")
                .Behaviors.Add(new WebHttpBehavior());
            host.AddServiceEndpoint(typeof(IItineraryService), new BasicHttpBinding(), "soap");

            // Activer l'échange de métadonnées
            if (host.Description.Behaviors.Find<ServiceMetadataBehavior>() == null)
            {
                ServiceMetadataBehavior smb = new ServiceMetadataBehavior();
                smb.HttpGetEnabled = true;
                host.Description.Behaviors.Add(smb);
            }
            host.AddServiceEndpoint(ServiceMetadataBehavior.MexContractName, MetadataExchangeBindings.CreateMexHttpBinding(), "mex");


            // Démarrer le service
            host.Open();

            Console.WriteLine("ItineraryService is hosted at " + DateTime.Now);
            Console.WriteLine("Host is running... Press <Enter> key to stop");
            Console.ReadLine();
        }
    }
}
