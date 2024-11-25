# Santye - Backend (C#)

Ce dossier contient le backend de l'application **Santye**, un service de recherche d'itinéraires à vélo qui communique avec des API externes et gère des requêtes via des interfaces REST et SOAP. Le backend est développé en **C#/.NET Core** et inclut des fonctionnalités avancées telles que la mise en cache via un proxy, ainsi que la communication asynchrone via **ActiveMQ**.

## Table des Matières

- [Santye - Backend (C#)](#santye---backend-c)
  - [Table des Matières](#table-des-matières)
  - [Aperçu du Backend](#aperçu-du-backend)
  - [Structure du Backend](#structure-du-backend)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Démarrage du Serveur](#démarrage-du-serveur)
  - [Fonctionnalités du Backend](#fonctionnalités-du-backend)
  - [Proxy et Cache](#proxy-et-cache)
    - [Fonctionnement du Cache](#fonctionnement-du-cache)
  - [Exemple du Flux d'un Message](#exemple-du-flux-dun-message)
  - [Technologies Utilisées](#technologies-utilisées)

## Aperçu du Backend

Le backend de **Santye** sert à recevoir des demandes d'itinéraires de la part du client (application frontend ou client lourd Java) et à retourner des itinéraires optimisés à vélo. Ce backend est capable de gérer les requêtes REST, de communiquer avec une API tierce (**OpenRouteService**), de mettre en cache les résultats pour éviter des appels redondants, et de gérer des messages asynchrones via **ActiveMQ**.

## Structure du Backend

Le projet backend est organisé comme suit :

```
backend-csharp/
|
├── ConsoleApp_for_Self_Hosted_WS/
│   ├── Program.cs              # Point d'entrée pour le Routing Server
│   ├── Interfaces/
│   │   └── IItineraryService.cs # Interface définissant les services disponibles
│   │   └── IProxyService.cs     # Interface définissant les services du proxy
│   ├── Models/
│   │   ├── Itinerary.cs        # Modèle de données pour un itinéraire
│   ├── Services/
│   │   ├── ProxyService.cs     # Service Proxy pour les appels API
│   │   ├── OpenRouteServiceClient.cs # Client pour l'API OpenRouteService
│   │   └── GenericCache.cs     # Implémentation générique du cache
│   │   └── ItinerarService.cs  # Service gérant les itinéraires, fait appel au Proxy  
│   └── ConsoleApp_for_Self_Hosted_WS.sln # Fichier de solution Visual Studio
└── README.md                   # Documentation sur le backend
```

## Prérequis

**TODO**

## Installation

**TODO**

## Démarrage du Serveur

**TODO**

## Fonctionnalités du Backend

- **Recherche d'itinéraires à vélo** : Reçoit une requête avec un point de départ et d'arrivée, et renvoie un itinéraire optimisé.
- **Gestion du Cache** : Utilise un cache générique pour éviter les appels répétitifs aux API externes.
- **Proxy pour OpenRouteService** : Toutes les requêtes passent par un service proxy qui gère les appels vers l'API OpenRouteService.
- **Services REST et SOAP** : Le backend expose à la fois des services REST et des services SOAP, permettant une flexibilité pour différents types de clients.

## Proxy et Cache

Le backend inclut un **ProxyService** qui gère les appels vers les services externes, tels que l'API **OpenRouteService**. Ce proxy intègre un cache (implémenté dans `GenericCache.cs`) qui permet de conserver les réponses des appels précédents pendant un certain temps afin d'améliorer les performances et de réduire le nombre de requêtes.

### Fonctionnement du Cache
- **GenericCache<T>** : Une classe générique qui permet de mettre en cache les données sous forme de paires clé/valeur avec une durée de validité.
- Avant d'effectuer un appel à l'API OpenRouteService, le **ProxyService** vérifie si les données sont déjà en cache.
- Si les données sont présentes, elles sont retournées directement, sinon, elles sont ajoutées au cache après l'appel à l'API.

## Exemple du Flux d'un Message

Voici un exemple du chemin parcouru par un message dans le backend :

1. **Program.cs** : Le point d'entrée de l'application, qui initialise le serveur et gère les requêtes entrantes.
2. **ItineraryService.cs** : Reçoit la requête et gère la logique principale. Le service fait appel au **ProxyService** pour obtenir les données nécessaires.
3. **ProxyService.cs** : Reçoit la requête de l'ItineraryService et vérifie d'abord si les données sont présentes dans le cache.
4. **GenericCache.cs** : Si l'itinéraire est en cache, il est retourné immédiatement. Sinon, le ProxyService continue l'appel.
5. **OpenRouteServiceClient.cs** : Si les données ne sont pas en cache, ce client est utilisé pour appeler l'API **OpenRouteService** et obtenir l'itinéraire. Les résultats sont ensuite ajoutés au cache.

## Technologies Utilisées

**TODO**
