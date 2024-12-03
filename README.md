# Santye - Application de Recherche d'Itinéraires à Vélo

Bienvenue sur **Santye**, une application permettant d'obtenir des itinéraires à vélo entre deux positions données. Santye utilise plusieurs technologies et API pour proposer des itinéraires optimisés tout en minimisant les appels aux services tiers. L'objectif est de proposer une application moderne qui s'intègre avec les services de cartes et les API de transport pour offrir la meilleure expérience utilisateur.

## Table des Matières
- [Santye - Application de Recherche d'Itinéraires à Vélo](#santye---application-de-recherche-ditinéraires-à-vélo)
  - [Table des Matières](#table-des-matières)
  - [Aperçu du Projet](#aperçu-du-projet)
  - [Structure du Projet](#structure-du-projet)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Démarrage des Services](#démarrage-des-services)
  - [Fonctionnalités](#fonctionnalités)
  - [Technologies Utilisées](#technologies-utilisées)
  - [Documentation Supplémentaire](#documentation-supplémentaire)

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
│   ├── ConsoleApp_for_Self_Hosted_WS/
│   │   ├── Program.cs            # Point d'entrée pour le Routing Server
│   │   ├── Interfaces/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── ConsoleApp_for_Self_Hosted_WS.sln
│   └── README.md                 # Documentation sur le backend
|
├── java/            # Client lourd en Java pour communiquer via SOAP
│   ├── pom.xml                   # Configuration Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/soap/ws/client/
│   │   │   │       ├── TestWSClient.java # Classe de test du client SOAP
│   │   │   │       └── generated/        # Fichiers générés par wsimport
│   └── README.md                 # Documentation sur le client lourd Java
|
├── activemq-setup/               # Configuration et scripts pour ActiveMQ
│   ├── config/
│   ├── start-activemq.sh         # Script pour démarrer ActiveMQ
│   └── README.md                 # Documentation sur la configuration d'ActiveMQ
|
└── README.md                     # Documentation générale du projet
```

## Prérequis
**TODO**

## Installation
**TODO**

## Démarrage des Services
**TODO**

## Fonctionnalités
- **Recherche d'itinéraires à vélo** : Saisissez un point de départ et d'arrivée, et recevez des itinéraires optimisés à vélo.
- **Gestion des Stations de Vélo** : Utilise une API pour récupérer la disponibilité des stations.
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

- [Frontend](../frontend/README.md)
- [Backend C#](../backend-csharp/README.md)
- [Client lourd Java](../heavy-client-java/README.md)
- [ActiveMQ Setup](../activemq-setup/README.md)
