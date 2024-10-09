# De la Maquette aux Composants

<p style="text-align:center;">
    <img  src="../maquette-canva/1. Page d&apos;acceuil.png" style="width:50%; ">
</p>

## Sommaire
- [De la Maquette aux Composants](#de-la-maquette-aux-composants)
  - [Sommaire](#sommaire)
  - [Introduction](#introduction)
  - [Liste des Fonctionnalités](#liste-des-fonctionnalités)
  - [Fichiers CSS/JS et Contenu](#fichiers-cssjs-et-contenu)
    - [Fichiers CSS](#fichiers-css)
    - [Fichiers JS](#fichiers-js)

## Introduction
Dans ce document, nous allons décrire les différentes fonctionnalités à implémenter dans notre projet basé sur la maquette créée. Pour chaque fonctionnalité, nous allons détailler la logique nécessaire pour sa mise en œuvre.

## Liste des Fonctionnalités

| Fonctionnalité                | Logique de Mise en Œuvre                                        | Composant Réutilisable |
|-------------------------------|-----------------------------------------------------------------|-------------------------|
| Recherche d'itinéraire | - Appeler une API pour récupérer les données de l'itinéraire.<br> |  - Input<br> - Bouton                     |
| Affichage du temps par moyens de transport     | - Temps de trajet par moyens de transport récupéré auprès de l'API. | - Bouton moyen de transport                     |
| Affichage de l'itinéraire           | - Visualiser l'itinéraire sur une carte.<br>- Visualiser les instructions. <br>- Afficher les instructions de l'itinéraire.| - Carte<br> - Bouton <br> - Instruction                            |
| Notifications/Alerte          | - Afficher des notifications sur les mises à jour de l'itinéraire.<br>- Gérer les mises à jour en temps réel. | - Notification                 |                

## Fichiers CSS/JS et Contenu

### Fichiers CSS
- **styles.css**: 
  - Styles globaux pour le layout et les composants.
  
### Fichiers JS
- **index.js**: 
  - Fichier d'entrée principal qui gère l'initialisation des composants.
  
- **components/**:
  - **ItinerarySearch.js**: 
    - Logique pour la recherche d'itinéraires (appel à l'API pour récupérer les données).
    - Inclut le composant input et le bouton pour lancer la recherche.
  
  - **TransportTime.js**: 
    - Gère l'affichage du temps de trajet par moyen de transport.
    - Inclut des boutons pour sélectionner les différents modes de transport.
  
  - **MapDisplay.js**: 
    - Affiche l'itinéraire sur une carte.
    - Affiche les instructions de l'itinéraire.
    - Inclut un autre composant bouton qui permet d'échanger départ et destination.
  
  - **Notification.js**: 
    - Gère l'affichage des notifications sur les mises à jour de l'itinéraire.
    - Permet de gérer les mises à jour en temps réel.
