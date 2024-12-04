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
            Console.WriteLine($"Configuration file loaded: {AppDomain.CurrentDomain.SetupInformation.ConfigurationFile}");

            // Créer une URI pour le service ItineraryService
            Uri httpUrl = new Uri("http://localhost:8081/api/ItineraryService");

            // Créer un ServiceHost pour l'ItineraryService
            ServiceHost host = new ServiceHost(typeof(ItineraryService), httpUrl);

            // Configurer une liaison personnalisée
            WebHttpBinding binding = new WebHttpBinding
            {
                MaxReceivedMessageSize = 2147483647,
                MaxBufferSize = 2147483647,
                ReaderQuotas = new System.Xml.XmlDictionaryReaderQuotas
                {
                    MaxDepth = 32,
                    MaxStringContentLength = 2147483647,
                    MaxArrayLength = 2147483647,
                    MaxBytesPerRead = 4096,
                    MaxNameTableCharCount = 2147483647
                }
            };

            // Ajouter un point de terminaison avec cette liaison personnalisée
            host.AddServiceEndpoint(typeof(IItineraryService), new WebHttpBinding(), "")
                .Behaviors.Add(new WebHttpBehavior());
            host.AddServiceEndpoint(typeof(IItineraryService), new BasicHttpBinding(), "soap");

       

            // Activer l'échange de métadonnées
            ServiceMetadataBehavior smb = host.Description.Behaviors.Find<ServiceMetadataBehavior>();
            if (smb == null)
            {
                smb = new ServiceMetadataBehavior();
                smb.HttpGetEnabled = true; // Activer l'accès aux métadonnées via HTTP
                host.Description.Behaviors.Add(smb);
            }
            else
            {
                smb.HttpGetEnabled = true; // Configurez l'instance existante
            }

            // Ajouter un point de terminaison mex pour l'échange de métadonnées
            host.AddServiceEndpoint(typeof(IMetadataExchange), MetadataExchangeBindings.CreateMexHttpBinding(), "mex");

            // Démarrer le service
            host.Open();

            Console.WriteLine("ItineraryService is hosted at " + DateTime.Now);
            Console.WriteLine("Host is running... Press <Enter> key to stop");
            Console.ReadLine();
        }
    }
}
