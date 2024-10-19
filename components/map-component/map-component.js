class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.departValue = '';
        this.destinationValue = '';
        this.map = null;
        
    }
    connectedCallback() {
        this.render();
        this.initMap();
        setTimeout(() => {
            this.classList.add('show');
        }, 1);
    }

    setValues(departValue, destinationValue) {
        this.departValue = departValue;
        this.destinationValue = destinationValue;
    }

    setLocation(type, location) {
        if(type === 'depart'){
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

    addEventListeners(){
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

    getDepartValue(){
        return this.departValue;
    }

    getDestinationValue(){
        return this.destinationValue;
    }

    initMap() {
        this.map = L.map('map').setView([51.505, -0.09], 13);  

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
            console.log("adress", this.departValue)
            this.geocodeAddress(this.departValue,this.map);
        }

         this.map.on('click', (event) => {
            const { lat, lng } = event.latlng;
            console.log(lat, lng)
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
}

customElements.define('map-component', MapComponent);