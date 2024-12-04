package com.santye.client;

import javafx.application.Platform;
import javafx.scene.control.TextArea;
import org.json.JSONArray;
import org.json.JSONObject;

public class QueueDataFormatter {

    public static void formatAndDisplayQueueData(String jsonData, TextArea resultArea) {
        try {
            // Convertir la chaîne JSON en JSONObject
            JSONObject jsonObject = new JSONObject(jsonData);

            // Extraire la collection de features
            JSONObject features = jsonObject.getJSONObject("Pied");
            JSONArray featureArray = features.getJSONArray("features");

            // Parcourir chaque feature (itinéraire)
            for (int i = 0; i < featureArray.length(); i++) {
                JSONObject feature = featureArray.getJSONObject(i);

                // Vérification si 'properties' contient 'segments' en tant que JSONArray
                if (feature.getJSONObject("properties").has("segments")) {
                    JSONArray segments = feature.getJSONObject("properties").getJSONArray("segments");

                    // Parcourir chaque segment
                    for (int j = 0; j < segments.length(); j++) {
                        JSONObject segment = segments.getJSONObject(j);
                        JSONArray steps = segment.getJSONArray("steps");

                        // Ajouter un titre pour chaque segment
                        StringBuilder displayText = new StringBuilder();
                        displayText.append("Segment ").append(j + 1).append(":\n");

                        // Parcourir les étapes de chaque segment
                        for (int k = 0; k < steps.length(); k++) {
                            JSONObject step = steps.getJSONObject(k);

                            // Extraire les informations de chaque étape
                            double distance = step.getDouble("distance");
                            double duration = step.getDouble("duration");
                            String instruction = step.getString("instruction");
                            String name = step.optString("name", ""); // Optionnel, si le nom est vide

                            // Format des données : Distance, Durée, Instruction
                            displayText.append(String.format("  Étape %d: %s\n", k + 1, instruction))
                                    .append(String.format("    Distance: %.2f m | Durée: %.2f s\n", distance, duration));
                            if (!name.isEmpty()) {
                                displayText.append(String.format("    Route: %s\n", name));
                            }
                            displayText.append("\n");
                        }

                        // Mettre à jour le TextArea dans le thread JavaFX
                        Platform.runLater(() -> resultArea.appendText(displayText.toString()));
                    }
                } else {
                    Platform.runLater(() -> resultArea.appendText("No segments found in the properties\n"));
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            Platform.runLater(() -> resultArea.appendText("Erreur lors du traitement des données.\n"));
        }
    }
}