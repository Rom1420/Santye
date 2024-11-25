# A retenir 

## Requêtes API JCDecaux pour les stations de vélos

### 1. Liste de tous les contrats

Obtenez tous les contrats disponibles avec cette requête :

```http
GET https://api.jcdecaux.com/vls/v3/contracts?&apiKey={api_key}
```

### 2. Liste de toutes les stations d'une ville (d'un contrat)

Pour récupérer toutes les stations d'une ville donnée (associée à un contrat spécifique), utilisez :

```http
GET https://api.jcdecaux.com/vls/v1/stations?contract={contract_name}&apiKey={api_key}
```

### 3. Informations sur une station spécifique
Pour obtenir des détails sur une station spécifique, utilisez le numéro de station :

```http
GET https://api.jcdecaux.com/vls/v3/stations/{station_number}?contract={contract_name}&apiKey={api_key}

```

## A comprendre 

> service - endpoints - ABC - diff soap rest - WSDL - WCF 