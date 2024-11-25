package com.santye.client;

import com.santye.client.generated.*;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

public class TestWSClient {

    public static void main(String[] args) {
        try {
            // Créer une instance du service ItineraryService
            ItineraryService service = new ItineraryService();
            IItineraryService port = service.getBasicHttpBindingIItineraryService();

            // Créer l'objet de requête ItineraryRequest
            ItineraryRequest request = new ItineraryRequest();
            JAXBElement<String> departure = new JAXBElement<>(
                    new QName("http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS", "Departure"),
                    String.class,
                    "48.8566, 2.3522"
            );
            JAXBElement<String> destination = new JAXBElement<>(
                    new QName("http://schemas.datacontract.org/2004/07/ConsoleApp_for_Self_Hosted_WS", "Destination"),
                    String.class,
                    "51.5074, -0.1278"
            );

            request.setDeparture(departure);
            request.setDestination(destination);

            // Appeler l'opération FindItinerary du service
            Itinerary itinerary = port.findItinerary(request);

            // Afficher les résultats de l'itinéraire
            if (itinerary != null && itinerary.getSteps() != null) {
                itinerary.getSteps().getValue().getStep().forEach(step -> {
                    System.out.println("Step: " + step.getInstruction().getValue());
                });
            } else {
                System.out.println("Aucun itinéraire trouvé.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}