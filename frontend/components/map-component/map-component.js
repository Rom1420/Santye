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
        for(let info of activeMqInfo) {
            this.updateRouteOnMap(JSON.parse(info));
        }

        document.addEventListener('details-update', (event) => {
            const message = event.detail.message;
            this.updateRouteOnMap(JSON.parse(message));
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
                        <h4 id="ETA">1H45</h4>
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

        if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            this.map.setView(coords, 13);
            L.marker(coords).addTo(this.map);
        } else {
            this.geocodeAddress(this.departValue, this.map);
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

    updateRouteOnMap(message) {
        console.log(typeof message);
        const steps = message.features[0].properties.segments[0].steps;
        const coordinates = message.features[0].geometry.coordinates;
    
        // Supprimer les couches existantes
        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
        }
        if (this.nextStepLayer) {
            this.map.removeLayer(this.nextStepLayer);
        }
    
        // Tracer le chemin complet en noir
        const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
        this.routeLayer = L.polyline(latLngs, { color: 'black', weight: 3 }).addTo(this.map);
    
        // Mettre en évidence la prochaine étape en bleu foncé
        if (steps.length > 0) {
            const nextStepCoords = [];
            steps[0].way_points.forEach(index => {
                nextStepCoords.push(latLngs[index]);
            });
    
            this.nextStepLayer = L.polyline(nextStepCoords, { color: 'darkblue', weight: 5 }).addTo(this.map);
    
            // Centrer la carte sur la prochaine étape
            this.map.fitBounds(L.latLngBounds(nextStepCoords));
        }
    
        console.log('updateRouteOnMap:', message);
        // Centrer la carte sur le premier point
        if (coordinates.length > 0) {
            const firstPoint = coordinates[0];
            this.map.setView([firstPoint[1], firstPoint[0]], 13); // Niveau de zoom ajusté à 13
        }
    }
    startAnimation(message) {
        if (!this.map) {
            console.error('La carte n\'est pas initialisée.');
            return;
        }
    
        const steps = message.features[0].properties.segments[0].steps;
        const coordinates = message.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    
        if (!coordinates || coordinates.length === 0) {
            console.error('Aucun point disponible pour l\'animation.');
            return;
        }
    
        let currentIndex = 0; // Index de l'étape actuelle
        const totalSteps = steps.length;
    
        const interval = setInterval(() => {
            if (currentIndex >= totalSteps) {
                clearInterval(interval); // Stopper l'animation si toutes les étapes sont parcourues
                console.log('Animation terminée.');
                return;
            }
    
            // Supprimer les couches existantes pour éviter des doublons
            if (this.routeLayer) {
                this.map.removeLayer(this.routeLayer);
            }
            if (this.nextStepLayer) {
                this.map.removeLayer(this.nextStepLayer);
            }
    
            // Mettre à jour la route restante en noir
            const remainingCoordinates = coordinates.slice(steps[currentIndex].way_points[0]);
            this.routeLayer = L.polyline(remainingCoordinates, { color: 'black', weight: 3 }).addTo(this.map);
    
            // Mettre en évidence la prochaine étape en bleu foncé
            const currentStepCoords = [];
            steps[currentIndex].way_points.forEach(index => {
                currentStepCoords.push(coordinates[index]);
            });
    
            this.nextStepLayer = L.polyline(currentStepCoords, { color: 'darkblue', weight: 5 }).addTo(this.map);
    
            // Centrer la carte sur la prochaine étape avec un zoom adéquat
            if (currentStepCoords.length > 0) {
                this.map.fitBounds(L.latLngBounds(currentStepCoords), {
                    padding: [50, 50]
                });
            }
    
            currentIndex++; // Passer à l'étape suivante
        }, 5000); // Attendre 5 secondes entre chaque étape
    }
    
    
}

customElements.define('map-component', MapComponent);
