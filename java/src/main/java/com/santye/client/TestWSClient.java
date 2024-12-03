package com.santye.client;

import com.santye.client.generated.*;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

public class TestWSClient {

    public static String findItinerary(String departure, String destination) {
        try {
            // Créer une instance du service ItineraryService
            ItineraryService service = new ItineraryService();
            IItineraryService port = service.getBasicHttpBindingIItineraryService();

            // Créer l'objet de requête ItineraryRequest
            ItineraryRequest request = new ItineraryRequest();
            JAXBElement<String> departureElement = new JAXBElement<>(
                    new QName("http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS", "Departure"),
                    String.class,
                    departure
            );
            JAXBElement<String> destinationElement = new JAXBElement<>(
                    new QName("http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS", "Destination"),
                    String.class,
                    destination
            );

            request.setDeparture(departureElement);
            request.setDestination(destinationElement);

            // Appeler l'opération FindItinerary du service
            Itinerary itinerary = port.findItinerary(request);

            // Préparer le résultat
            if (itinerary != null && itinerary.getSteps() != null) {
                StringBuilder resultBuilder = new StringBuilder("Itinéraire trouvé :\n");
                itinerary.getSteps().getValue().getStep().forEach(step -> {
                    resultBuilder.append("Étape : ").append(step.getInstruction().getValue()).append("\n");
                });
                return resultBuilder.toString();
            } else {
                return "Aucun itinéraire trouvé.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de la récupération de l'itinéraire : " + e.getMessage();
        }
    }
}
