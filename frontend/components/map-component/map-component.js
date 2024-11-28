class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.departValue = '';
        this.destinationValue = '';
        this.map = null;
        this.routeLayer = null; // Layer pour le chemin complet
        this.nextStepLayer = null; // Layer pour la prochaine étape
    }

    connectedCallback() {
        this.render();
        this.initMap();
        setTimeout(() => {
            this.classList.add('show');
        }, 1);
        console.log('MapComponent a créé le listener');
        // Écouter les événements de mise à jour du chemin
        let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
        console.log('currentActiveMqInfo:', currentActiveMqInfo);
        let activeMqInfo = JSON.parse(currentActiveMqInfo);
        this.startStepAnimation(JSON.parse(activeMqInfo[0]));
        //localStorage.clear();
        //this.startAnimation(JSON.parse(activeMqInfo[0]));
        /*
        for(let info of activeMqInfo) {
            this.updateRouteOnMap(JSON.parse(info));
        }*/

        document.addEventListener('details-update', (event) => {
            const message = event.detail.message;
            this.startStepAnimation(JSON.parse(message));
            //this.startAnimation(JSON.parse(message));
        });

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

    updateRouteOnMap(message, currentStepIndex = 0) {
        console.log(`Étape courante : ${currentStepIndex}`);
        const steps = message.FootRoute.features[0].properties.segments[0].steps;
        const coordinates = message.FootRoute.features[0].geometry.coordinates;
    
        // Supprimer les couches existantes
        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
        }
        if (this.nextStepLayer) {
            this.map.removeLayer(this.nextStepLayer);
        }
        if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker);
        }
    
        // Garder uniquement les points non parcourus
        const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
        const remainingWaypoints = [];
        for (let i = currentStepIndex; i < steps.length; i++) {
            steps[i].way_points.forEach(index => {
                if (!remainingWaypoints.includes(index)) {
                    remainingWaypoints.push(index);
                }
            });
        }
    
        // Tracer la route noire pour les étapes restantes
        const remainingLatLngs = remainingWaypoints.map(index => latLngs[index]);
        if (remainingLatLngs.length > 0) {
            this.routeLayer = L.polyline(remainingLatLngs, { color: 'black', weight: 3 }).addTo(this.map);
        }
    
        // Mettre en évidence l'étape actuelle en bleu
        if (steps.length > currentStepIndex) {
            const nextStepCoords = [];
            steps[currentStepIndex].way_points.forEach(index => {
                if (latLngs[index]) {
                    nextStepCoords.push(latLngs[index]);
                }
            });
    
            if (nextStepCoords.length > 0) {
                // Tracer la ligne bleue pour l'étape actuelle
                this.nextStepLayer = L.polyline(nextStepCoords, { color: 'blue', weight: 5 }).addTo(this.map);
    
                // Ajouter un point bleu au début de l'étape actuelle
                const startPoint = nextStepCoords[0];
                this.currentMarker = L.circleMarker(startPoint, {
                    radius: 8,
                    color: 'blue',
                    fillColor: 'blue',
                    fillOpacity: 0.8
                }).addTo(this.map);
    
                // Centrer la carte sur la route bleue avec un zoom accru

                const bounds = L.latLngBounds(nextStepCoords);
                const bufferedBounds = bounds.pad(0.3); // 0.1 représente un léger dézoom
                this.map.fitBounds(bufferedBounds, { padding: [50, 50] });
            } else {
                console.error(`Aucune coordonnée trouvée pour l'étape ${currentStepIndex}`);
            }
        } else {
            console.log("Toutes les étapes ont été parcourues.");
        }

        

        // Mettre à jour l'ETA
        const etaContainer = this.querySelector('#ETA');
        if (etaContainer) {
            const totalEta = this.calculateTotalEta(steps, currentStepIndex);
            etaContainer.textContent = totalEta;
        }
    }
    
    startStepAnimation(message) {
        let currentStepIndex = 0;
        const steps = message.FootRoute.features[0].properties.segments[0].steps;
    
        // Mettre à jour la carte immédiatement pour la première étape
        console.log(`Affichage de la première étape`);
        this.updateRouteOnMap(message, currentStepIndex);
    
        // Démarrer l'intervalle pour les étapes suivantes
        const interval = setInterval(() => {
            currentStepIndex++;
            if (currentStepIndex < steps.length) {
                console.log(`Affichage de l'étape ${currentStepIndex + 1} sur ${steps.length}`);
                this.updateRouteOnMap(message, currentStepIndex);
    
                // Supprimer les étapes déjà parcourues du message
                message.FootRoute.features[0].properties.segments[0].steps = steps.slice(currentStepIndex);
            } else {
                console.log("Toutes les étapes ont été affichées.");
                clearInterval(interval); // Arrêter l'intervalle une fois toutes les étapes affichées
            }
        }, 5000); // Relancer toutes les 5 secondes
    }
    
    
    calculateTotalEta(steps, currentStepIndex) {
        // Filtrer les étapes restantes
        const remainingSteps = steps.slice(currentStepIndex);
    
        // Additionner les durées restantes
        const totalDurationInSeconds = remainingSteps.reduce((total, step) => total + step.duration, 0);
    
        // Convertir en minutes et heures
        const totalMinutes = Math.ceil(totalDurationInSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        // Retourner un format lisible
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
    }    
    
}

customElements.define('map-component', MapComponent);
