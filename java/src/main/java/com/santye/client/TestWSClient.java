package com.santye.client;

import com.santye.client.generated.*;
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

            // Call the FindItinerary operation
            Itinerary itinerary = port.getItinerary(request.getDeparture().getValue(), request.getArrival().getValue());


            // Prepare the result
            if (itinerary != null && itinerary.getSteps() != null) {
                StringBuilder resultBuilder = new StringBuilder("Itinerary found:\n");
                itinerary.getSteps().getValue().getOpenRouteServiceClientStep().forEach(step -> {
                    resultBuilder.append("Step: ").append(step.getInstruction().getValue()).append("\n");
                });
                return resultBuilder.toString();
            } else {
                return "No itinerary found.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error while retrieving the itinerary: " + e.getMessage();
        }
    }

    public static void listenToQueue(String queueName) {
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
                        System.out.println("Received step from queue: " + text);
                    } catch (JMSException e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // Test SOAP request
        String itineraryResult = findItinerary("48.8566,2.3522", "48.8606,2.3376");
        System.out.println(itineraryResult);

        // Listen to ActiveMQ queue for real-time updates
        listenToQueue("itineraryQueue");
    }
}
