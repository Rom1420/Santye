package com.santye.client.ui;

import com.santye.client.TestWSClient;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class ItineraryClientUI extends Application {

    @Override
    public void start(Stage primaryStage) {
        Label titleLabel = new Label("Santye Java Client UI");
        titleLabel.getStyleClass().add("title-label");

        // Champs de texte pour les coordonnées de départ et d'arrivée
        TextField departureField = new TextField();
        departureField.setPromptText("Coordonnées de départ (lat, lon)");

        TextField destinationField = new TextField();
        destinationField.setPromptText("Coordonnées de destination (lat, lon)");

        // Bouton pour envoyer la requête
        Button sendButton = new Button("Trouver l'itinéraire");

        // Zone de texte pour afficher les résultats
        TextArea resultArea = new TextArea();
        resultArea.setEditable(false);

        // Action du bouton
        sendButton.setOnAction(event -> {
            String departure = departureField.getText();
            String destination = destinationField.getText();
            if (!departure.isEmpty() && !destination.isEmpty()) {
                resultArea.setText("Envoi de la requête au serveur de routage...");

                // Appel du client SOAP via la classe TestWSClient
                String itineraryResult = TestWSClient.findItinerary(departure, destination);
                resultArea.setText(itineraryResult);
            } else {
                resultArea.setText("Veuillez saisir les coordonnées de départ et d'arrivée.");
            }
        });

        // Organisation de l'UI
        VBox root = new VBox(15, titleLabel, departureField, destinationField, sendButton, resultArea);
        root.setStyle("-fx-alignment: center;");


        Scene scene = new Scene(root, 600, 600);
        scene.getStylesheets().add(getClass().getResource("/styles.css").toExternalForm());

        // Paramétrage de la fenêtre
        primaryStage.setTitle("Client Lourd - Itinéraire");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
