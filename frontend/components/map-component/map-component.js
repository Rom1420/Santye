class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.departValue = '';
        this.destinationValue = '';
        this.map = null;
        this.routeLayer = null; // Layer pour le chemin complet
        this.nextStepLayer = null; // Layer pour la prochaine étape
        this.steps = []; // Stocker les étapes localement
    }

    connectedCallback() {
        this.render();
        this.initMap();
        setTimeout(() => {
            this.classList.add('show');
        }, 1);

        console.log('check of storage without event');
        const storedMessage = localStorage.getItem('activeMqInfo');
        if (storedMessage) {
            try {
                const message = JSON.parse(storedMessage);
                this.updateSteps();
                this.startStepAnimation(message);
            } catch (error) {
                console.error('Erreur lors de la lecture du localStorage :', error);
            }
        }


        document.addEventListener('route-updated', (event) => {
            const message = event.detail;
        
            // Vérifiez si le message est valide
            if (message && message.Pied) {
                // Appeler les fonctions avec le message
                //this.updateRouteOnMap(message);
                this.updateSteps();
                this.startStepAnimation(message);
            } else {
                console.error('Message de route non valide reçu :', message);
            }
        });

        /*
        console.log('MapComponent a créé le listener');
        // Écouter les événements de mise à jour du chemin
        let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
        //console.log('currentActiveMqInfo:', currentActiveMqInfo);
        //let activeMqInfo = JSON.parse(currentActiveMqInfo);
        this.startStepAnimation(currentActiveMqInfo);
        console.log('+++++++ LECTURE LOCAL STORAGE MAP +++++++');
        //localStorage.clear();
        //this.startAnimation(JSON.parse(activeMqInfo[0]));
        /*
        for(let info of activeMqInfo) {
            this.updateRouteOnMap(JSON.parse(info));
        }

        document.addEventListener('details-update', (event) => {
            const message = event.detail.message;
            this.startStepAnimation(JSON.parse(message));
            //this.startAnimation(JSON.parse(message));
        });
        */
    }

    setValues(departValue, destinationValue) {
        this.departValue = departValue;
        this.destinationValue = destinationValue;
    }

    setLocation(type, location) {
        if (type === 'depart') {
            this.departValue = location;
        } else {
            this.destinationValue = location;
        }
    }

    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./style.css">
            <link rel="stylesheet" href="./components/map-component/style.css">
            <link rel="stylesheet" href="./components/details-component/style.css">
            <div class="main-container">
                <div class="ping-on-map hide">
                    Choississez un point sur la carte
                </div>
                <div class="left-container">
                    <div id="scroll">
                        <search-component etat="map-displayed"></search-component> 
                        <div class="separation-line"></div>
                        <details-component></details-component>
                    </div>
                </div>
                <div class="right-container">
                    <h1 class="main-title">Santye</h1>
                    <button class="menu-button">
                        <div class="icon-bar"></div>
                        <div class="icon-bar"></div>
                        <div class="icon-bar"></div>
                    </button>
                    <div class="map-container">
                        <div class="map" id="map"></div>
                    </div>
                    <div class="eta-container">
                        <img src="./assets/pics/clock.png" alt="ETA" id="clock">
                        <h4 id="ETA">--</h4>
                    </div>
                </div>
            </div>
        `;
        this.addEventListeners();
    }

    addEventListeners() {
        const toggleBtn = document.querySelector('.menu-button');
        const container = document.querySelector('.main-container');
        const leftContainer = this.querySelector('.left-container');
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('reduced');
            if (container.classList.contains('reduced')) {
                leftContainer.classList.remove('hidden');
            } else {
                leftContainer.classList.add('hidden');
            }
        });
    }

    getDepartValue() {
        return this.departValue;
    }

    getDestinationValue() {
        return this.destinationValue;
    }

    initMap() {
        this.map = L.map('map').setView([51.505, -0.09], 13);
        console.log('Initialisation de la carte');

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        let coords;
        if (typeof this.departValue === 'string' && this.departValue.includes(',')) {
            coords = this.departValue.split(',').map(coord => parseFloat(coord.trim()));
        } else if (Array.isArray(this.departValue) && this.departValue.length === 2) {
            coords = this.departValue;
        }

        this.map.on('click', (event) => {
            const { lat, lng } = event.latlng;
            console.log('Point sélectionné :', lat, lng);
            this.dispatchEvent(new CustomEvent('map-pinged', {
                detail: { latitude: lat, longitude: lng },
                bubbles: true,
                composed: true
            }));
        });
    }

    geocodeAddress(address, map) {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    const coords = [lat, lon];

                    map.setView(coords, 13);
                    L.marker(coords).addTo(map);
                } else {
                    console.error('Aucune correspondance trouvée pour l\'adresse.');
                }
            })
            .catch(error => {
                console.error('Erreur lors du géocodage :', error);
            });
    }

    updateRouteOnMap(message, currentStepIndex = 0, start) {
        console.log('Mise à jour de la route sur la carte avec le message :', message);

        if(message.features) {
            //trajet a pied
            if(start) {
                const coordinates = message.features[0].geometry.coordinates;
                    
                const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
            
                // Supprimer les couches existantes (route et point)
                if (this.routeLayer) this.map.removeLayer(this.routeLayer);
                if (this.currentMarker) this.map.removeLayer(this.currentMarker);
            
                // Tracer la route complète en noir
                this.routeLayer = L.polyline(latLngs, { color: 'black', weight: 3 }).addTo(this.map);
            } else {
                this.map.removeLayer(this.currentMarker);
            }
            
            // Mettre un point bleu pour la position actuelle
            const way_points = this.steps[currentStepIndex].way_points[0];
            this.currentMarker = L.circleMarker([message.features[0].geometry.coordinates[way_points][1], message.features[0].geometry.coordinates[way_points][0]],{
                radius: 8,
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.8,
            }).addTo(this.map);
    
            // Centrer la carte sur la position actuelle
            this.map.setView([message.features[0].geometry.coordinates[way_points][1], message.features[0].geometry.coordinates[way_points][0]], 70);

        } else {
            //trajet en vélo
            const coordinates = [
                ...message.Pied1.features[0].geometry.coordinates,
                ...message.Velo1.features[0].geometry.coordinates,
                ...message.Pied2.features[0].geometry.coordinates
            ];
            console.log('COORDINATES', coordinates);

            if(start) {
                const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
            
                // Supprimer les couches existantes (route et point)
                if (this.routeLayer) this.map.removeLayer(this.routeLayer);
                if (this.currentMarker) this.map.removeLayer(this.currentMarker);
            
                // Tracer la route complète en noir
                this.routeLayer = L.polyline(latLngs, { color: 'black', weight: 3 }).addTo(this.map);
            } else {
                this.map.removeLayer(this.currentMarker);
            }

            // Mettre un point bleu pour la position actuelle
            const way_points = this.steps[currentStepIndex].way_points[0];
            this.currentMarker = L.circleMarker([coordinates[way_points][1], coordinates[way_points][0]],{
                radius: 8,
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.8,
            }).addTo(this.map);
    
            // Centrer la carte sur la position actuelle
            this.map.setView([coordinates[way_points][1], coordinates[way_points][0]], 70);

        }
        /*
        if(start) {
            const coordinates = message.Velo1
            ? message.Pied1.features[0].geometry.coordinates
            : message.features[0].geometry.coordinates;
        
            const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
        
            // Supprimer les couches existantes (route et point)
            if (this.routeLayer) this.map.removeLayer(this.routeLayer);
            if (this.currentMarker) this.map.removeLayer(this.currentMarker);
        
            // Tracer la route complète en noir
            this.routeLayer = L.polyline(latLngs, { color: 'black', weight: 3 }).addTo(this.map);

        }else{
            this.map.removeLayer(this.currentMarker);
        }

        console.log("STEPS", this.steps);
        console.log("STEPS CURRENTINDEX", this.steps[currentStepIndex]);
        console.log("STEPS CURRENTINDEX WAYPOINTS", this.steps[currentStepIndex].way_points);
        console.log("STEPS CURRENTINDEX WAYPOINTS 0", this.steps[currentStepIndex].way_points[0]);
    
        // Mettre un point bleu pour la position actuelle
        const way_points = this.steps[currentStepIndex].way_points[0];
        if (way_points != null) {
            this.currentMarker = L.circleMarker([message.Pied1.features[0].geometry.coordinates[way_points][1], message.Pied1.features[0].geometry.coordinates[way_points][0]],{
                radius: 8,
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.8,
            }).addTo(this.map);
    
            // Centrer la carte sur la position actuelle
            this.map.setView([message.Pied1.features[0].geometry.coordinates[way_points][1], message.Pied1.features[0].geometry.coordinates[way_points][0]], 70);
        } else {
            console.error(`Aucune coordonnée trouvée pour l'étape ${currentStepIndex}`);
        }*/
    
        // Mettre à jour l'ETA
        const etaContainer = this.querySelector('#ETA');
        if (etaContainer) {
            const totalEta = this.calculateTotalEta(currentStepIndex);
            etaContainer.textContent = totalEta;
        }
    }  
    
    startStepAnimation(message) {
        let currentStepIndex = 0;
    
        // Mettre à jour la carte immédiatement pour la première étape
        console.log(`Affichage de la première étape`);
        this.updateRouteOnMap(message, currentStepIndex,true);
    
        // Démarrer un intervalle pour déplacer le point bleu
        const interval = setInterval(() => {
            currentStepIndex++;
            if (currentStepIndex < this.steps.length) {
                console.log(`Mise à jour de la position actuelle : étape ${currentStepIndex + 1}`);
                this.updateRouteOnMap(message, currentStepIndex,false);
            } else {
                console.log("Toutes les étapes ont été affichées.");
                clearInterval(interval); // Arrêter l'intervalle une fois terminé
            }
        }, 5000); // Mise à jour toutes les 5 secondes
    }    
    
    
    calculateTotalEta(currentStepIndex) {
        // Filtrer les étapes restantes
        console.log('Steps lenght avant ETA change :', this.steps.length);
        let remainingSteps = this.steps;
        remainingSteps = remainingSteps.slice(currentStepIndex);
        console.log('Steps après avant ETA change :', this.steps.length);
    
        // Additionner les durées restantes
        const totalDurationInSeconds = remainingSteps.reduce((total, step) => total + step.duration, 0);
    
        // Convertir en minutes et heures
        const totalMinutes = Math.ceil(totalDurationInSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        // Retourner un format lisible
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
    }    

    updateSteps() {

        console.log('AVANT mise à jour des steps...');

        // Récupérer les données depuis le localStorage
        const storedData = localStorage.getItem('activeMqInfo');
        if (!storedData) {
            console.error("Aucune donnée trouvée dans le localStorage.");
            this.steps = []; // Réinitialiser si les données sont absentes
            return;
        }
    
        const parsedData = JSON.parse(storedData);
    
        // Initialiser les steps en fonction du mode
        if (parsedData.Velo1) {  
            // Combiner les steps de Pied1, Velo1, et Pied2
            /*
            this.steps = [
                ...parsedData.Pied1.features[0].properties.segments[0].steps,
                ...parsedData.Velo1.features[0].properties.segments[0].steps,
                ...parsedData.Pied2.features[0].properties.segments[0].steps
            ];
            */
            this.steps = parsedData.Pied1.features[0].properties.segments[0].steps;
            
            console.log("Steps pour le mode Vélo mis à jour depuis le localStorage :", this.steps);
        } else {
            if ( !parsedData.features) {
                console.error("Les données pour Pied dans le localStorage sont invalides ou incomplètes.");
                this.steps = []; // Réinitialiser si les données sont invalides
                console.log('Steps mis à jour :', this.steps);
                return;
            }
            // Steps pour le trajet à pied
            this.steps = parsedData.features[0].properties.segments[0].steps;
    
            console.log("Steps pour le mode Pied mis à jour depuis le localStorage :", this.steps);
        }

    }    
    
}

customElements.define('map-component', MapComponent);
