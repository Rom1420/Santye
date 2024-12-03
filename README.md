<h1 align="center">
  <br>
  <img src="frontend\assets\pics\Middleware.png" 
  width="80%">
  <br>
  Santye - Application de Recherche d'Itinéraires à Vélo
  <br>
</h1>

<h5 align="center">Santye, une application permettant d'obtenir des itinéraires à vélo entre deux positions données. Santye utilise plusieurs technologies et API pour proposer des itinéraires optimisés tout en minimisant les appels aux services tiers. L'objectif est de proposer une application moderne qui s'intègre avec les services de cartes et les API de transport pour offrir la meilleure expérience utilisateur.</h5>

---

<p align="center">
  <a href="#aperçu-du-projet">Aperçu du Projet</a> •
  <a href="#structure-du-projet">Structure du Projet</a> •
  <a href="#prérequis">Prérequis</a> •
  <a href="#installation">Installation</a> •
  <a href="#démarrage-des-services">Démarrage des Services</a> •
  <a href="#fonctionnalités">Fonctionnalités</a> •
  <a href="#technologies-utilisées">Technologies Utilisées</a> •
  <a href="#documentation-supplémentaire">Documentation Supplémentaire</a> 
</p>

---

## Aperçu du Projet
Santye est une application qui aide les utilisateurs à trouver des itinéraires à vélo en utilisant des points de départ et d'arrivée donnés. L'application interagit avec des services web pour récupérer des informations sur les stations de vélos, calculer les trajets, et les fournir à l'utilisateur. Santye utilise des API externes, comme **OpenRouteService**, **JCDecaux**, ainsi qu'un système de cache pour éviter les appels répétitifs et optimiser les performances.

## Structure du Projet
Le projet est organisé en quatre grandes parties qui communiquent entre elles, chacune ayant une fonction spécifique pour garantir modularité et scalabilité :

```
root/
|
├── frontend/                     # Application frontend en HTML/CSS/JS
│   ├── assets/
│   ├── components/
│   ├── doc/
│   ├── index.html
│   └── README.md                 # Documentation sur le frontend
|
├── backend/               # Projet backend en C#
│   ├── MiddlewareApp/     # Solution principale regroupant les projets backend
│   │   ├── ConsoleApp_for_Self_Hosted_WS/   # Projet pour le serveur de routage (Routing Server)
│   │   ├── SharedModels/                   # Projet contenant les modèles partagés, y compris l'itinerary
│   │   ├── ProxyAndCache/                  # Projet pour gérer le cache générique et le service Proxy
│   │   ├── MiddlewareApp.sln               # Fichier de solution principale
│   └── README.md                           # Documentation sur le projet backend
|
├── java/            # Client lourd en Java 
│   ├── pom.xml                   # Configuration Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/santye/client/
│   │   │   │       ├── ui
│   │   │   │       │   └── ItineraryClientUI.java # Classe de l'interface du client
│   │   │   │       ├── TestWSClient.java # Classe de test du client SOAP
│   ├── target/        # Fichiers générés par wsimport
│   └── README.md                 # Documentation sur le client lourd Java
|
└── README.md                     # Documentation générale du projet
```

## Prérequis
Pour exécuter ce projet, vous aurez besoin des éléments suivants :

- **.NET Core SDK** (version 3.1 ou ultérieure) pour le backend en C#.
- **Java JDK** (version 11 ou ultérieure) pour le client lourd Java.
- **Maven** pour la gestion des dépendances du projet Java.
- **ActiveMQ** pour la messagerie asynchrone (version 5.15 ou ultérieure).

## Installation
Suivez les étapes ci-dessous pour installer les différentes parties de l'application :

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/Rom1420/Santye
   ```

2. **Frontend** :
   - Naviguez dans le dossier `frontend/` et lancez un serveur local pour l'héberger.

3. **Backend C#** :
   - Ouvrez la solution `MiddlewareApp.sln` dans Visual Studio.
   - Restaurer les dépendances et compiler la solution.
   - Lancez le serveur de routage en exécutant le projet `ConsoleApp_for_Self_Hosted_WS`.

4. **Client lourd Java** :
   - Naviguez dans le dossier `java/` et exécutez la commande suivante pour compiler le projet :
     ```bash
     mvn clean install
     ```
   - Exécutez `TestWSClient.java` pour tester le client Java.

## Démarrage des Services
Pour démarrer tous les services nécessaires :

1. **Démarrer le backend** :
   - Ouvrez la solution `MiddlewareApp.sln` et exécutez le projet `ConsoleApp_for_Self_Hosted_WS` pour lancer le serveur de routage.

2. **Lancer ActiveMQ** :
   - Exécutez la commande ```activemq start``` dans un terminal pour lancer ActiveMQ.

3. **Lancer le client lourd Java** :
   - Exécutez `TestWSClient.java` pour lancer le client Java lourd.

4. **Démarrer le frontend** :
   - Rendez-vous à l'adresse du live server que vous avez démarré pour accéder à l'application.

## Fonctionnalités
- **Recherche d'itinéraires à vélo** : Saisissez un point de départ et d'arrivée, et recevez des itinéraires optimisés à vélo.
- **Proxy et Cache** : Le proxy permet de faire des appels REST à des API externes tout en gérant un cache pour réduire les appels répétitifs.
- **Messages Asynchrones** : Utilise **ActiveMQ** pour mettre à jour les itinéraires en temps réel.

## Technologies Utilisées
- **C# / .NET Core** : Pour le backend et les services REST/SOAP.
- **Java (Maven)** : Pour le client lourd SOAP.
- **JavaScript / HTML / CSS** : Pour le frontend.
- **ActiveMQ** : Pour la communication asynchrone.
- **OpenRouteService API** : Pour la recherche d'itinéraires à vélo.
- **JCDecaux** : Pour obtenir des informations sur les stations de vélos etc.

## Documentation Supplémentaire

Pour plus de détails, veuillez consulter les README des différentes parties du projet :

- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)
