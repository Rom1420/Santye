package com.santye.client;

import com.santye.client.generated.GetItinerary;
import com.santye.client.generated.IItineraryService;
import com.santye.client.generated.ItineraryService;
import javafx.application.Platform;
import javafx.scene.control.TextArea;
import org.apache.activemq.ActiveMQConnectionFactory;

import javax.jms.*;
import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

public class TestWSClient {

    public static String findItinerary(String departure, String destination) {
        try {
            System.setProperty("com.sun.xml.ws.transport.http.client.HttpTransportPipe.dump", "true");
            // Create instance of the ItineraryService
            ItineraryService service = new ItineraryService();
            IItineraryService port = service.getBasicHttpBindingIItineraryService();

            // Create ItineraryRequest object
            GetItinerary request = new GetItinerary();
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
            request.setArrival(destinationElement);
            port.getItinerary(request.getDeparture().getValue(), request.getArrival().getValue());

            return "Itinerary fetched successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while retrieving the itinerary: " + e.getMessage();
        }
    }

    public static void listenToQueue(String queueName, TextArea resultArea) {
        try {
            ConnectionFactory factory = new ActiveMQConnectionFactory("tcp://localhost:61616");
            Connection connection = factory.createConnection();
            connection.start();

            Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
            Destination destination = session.createQueue(queueName);

            MessageConsumer consumer = session.createConsumer(destination);
            consumer.setMessageListener(message -> {
                if (message instanceof TextMessage) {
                    try {
                        String text = ((TextMessage) message).getText();

                        // Mettre à jour l'interface utilisateur JavaFX
                        Platform.runLater(() -> {
                            QueueDataFormatter.formatAndDisplayQueueData(text, resultArea);
                        });
                    } catch (JMSException e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
