class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
        
        this.departInput = this.querySelector('.depart-container input');
        this.destinationInput = this.querySelector('.destination-container input');

        this.autocompleteListDepart = document.createElement('ul'); 
        this.autocompleteListDepart.classList.add('autocomplete-list');
        
        this.autocompleteListDestination = document.createElement('ul'); 
        this.autocompleteListDestination.classList.add('autocomplete-list');

        this.departInput.parentNode.appendChild(this.autocompleteListDepart);
        this.destinationInput.parentNode.appendChild(this.autocompleteListDestination);

        this.addEventListeners();

        if (this.getAttribute('etat') === 'map-displayed') {
            this.mapDisplayed();
            this.fetchAndSetInputsFromMap();
        }
    }

    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./components/search-component/style.css">
                <div class="search-container">
                    <h1 class="main-title">Santye</h1>
                    <div class="inputs-container">
                        <div class="depart-container">
                            <div class="input">
                                <input type="text" placeholder="Départ">
                                <div class="location-button">
                                    <span><i class="fas fa-location-dot"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="destination-container">
                            <div class="input">
                                <input type="text" placeholder="Destination">
                                <div class="location-button">
                                    <span><i class="fas fa-location-dot"></i></span>
                                </div>
                            </div>
                            <div class="validation-button">
                                <span><i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
        `;
    }
    

    addEventListeners() {
        const validationButton = this.querySelector('.validation-button');
        validationButton.addEventListener('click', () => this.addTransportsButtons());

        // Pour l'autocomplétion
        this.departInput.addEventListener('input', () => this.handleInputChange(this.departInput.value, this.autocompleteListDepart));
        this.destinationInput.addEventListener('input', () => this.handleInputChange(this.destinationInput.value, this.autocompleteListDestination));
        
        // Pour la position
        const locationButtonDepart = this.querySelector('.depart-container .location-button');
        locationButtonDepart.addEventListener('click', () => this.addPositionComponent('depart'));

        const locationButtonDestination = this.querySelector('.destination-container .location-button');
        locationButtonDestination.addEventListener('click', () => this.addPositionComponent('destination'));

        this.addEventListener('location-found', (event) => {
            const { latitude, longitude, type } = event.detail;
            if(type === 'depart'){
                this.setInputValue('depart', ` ${latitude}, ${longitude}`); 
            } else {
                this.setInputValue('destination', ` ${latitude}, ${longitude}`); 
            }
            
        });

        this.addEventListener('location-selected', (event) => {
            console.log(this)
            console.log('location selected')
            const { latitude, longitude, type } = event.detail;
            const mapComponent = document.querySelector('map-component');
            mapComponent.setLocation(type, ` ${latitude}, ${longitude}`)
            this.setInputValue(type, `${latitude}, ${longitude}`);
            console.log(this.departInput.value)
        });

        /*this.getItinerary("toulouse","tournefeuille");
        this.contectToActiveMq();*/
    }

    addTransportsButtons(){
        /*this.createTransportButtons();
        this.expandSearchContainer();
        this.removeValidationButton();
        this.createPermuteButton();
        this.correctInputs();*/
        const departValue = this.departInput.value.trim();
        const destinationValue = this.destinationInput.value.trim();
            this.getItinerary(departValue, destinationValue)
            .then(queueName => {
                this.contectToActiveMq();
                this.createTransportButtons();
                this.expandSearchContainer();
                this.removeValidationButton();
                this.createPermuteButton();
                this.correctInputs();
            })
            .catch(error => {
                console.error("Error fetching itinerary:", error);
            });
        console.log(`******************************************${departValue} ${destinationValue}******************************************`);
    }
/*
    async validateItinerary(departure, destination) {
        return await this.getItinerary(departure,destination);
        const isDepartureGPS = this.isValidCoordinates(departure);
        const isDestinationGPS = this.isValidCoordinates(destination);

        if (isDepartureGPS && isDestinationGPS) {
           return await this.getItinerary(departure,destination);
        }

        const isDepartureValid = await this.validateAddress(departure);
        const isDestinationValid = await this.validateAddress(destination);

        if (!isDepartureValid ) {
            this.wrongInput("depart");
        }
        
        if (!isDestinationValid ) {
            this.wrongInput("destination");
        }

        if(!isDepartureValid || !isDestinationValid){
            throw new Error("Invalid addresses: Please provide valid Departure address.");
        }
            this.correctInputs();
            const coordinatesDeparture = await this.getCoordinatesFromAddress(departure);
            const coordinatesDestination = await this.getCoordinatesFromAddress(destination);

            console.log(coordinatesDeparture, coordinatesDestination)
            return await this.getItinerary(departure,destination);
        }*/

    createTransportButtons() {
        const inputsContainer = this.querySelector('.inputs-container');
        const newTransportsButtons = document.createElement('transports-buttons');

        newTransportsButtons.addEventListener('click', () => {
            if (!this.classList.contains('map-displayed')) {
                console.log("LA RAISON DE POURQUOI CA SE FAIT PLUSIEURs FOIS");
                this.replaceWithMapComponent();
            }
        });

        if (this.classList.contains('map-displayed')) {
            newTransportsButtons.setAttribute('etat', 'map-displayed');
        }
        if(!this.querySelector('transports-buttons')){
            inputsContainer.appendChild(newTransportsButtons);
        }
    }

    expandSearchContainer() {
        const searchContainer = this.querySelector('.search-container');
        searchContainer.classList.add('expanded');
    }

    removeValidationButton() {
        const destinationContainer = this.querySelector('.destination-container');
        const validationButton = this.querySelector('.validation-button');
        if(validationButton){
            destinationContainer.removeChild(validationButton);
        }
    }

    createPermuteButton() {
        if(!this.querySelector('permute-button')){
            const destinationContainer = this.querySelector('.destination-container');
        const permuteButton = document.createElement('div');
        permuteButton.classList.add('permute-button');

        const span = document.createElement('span');
        const icon = document.createElement('i');
        icon.className = 'fas fa-repeat'; 

        span.appendChild(icon);
        permuteButton.appendChild(span);

        permuteButton.addEventListener('click', () => this.swapInputs());

        destinationContainer.prepend(permuteButton);
        destinationContainer.classList.add('show-permute-button');

        const departContainerInput = this.querySelector('.depart-container .input');
        const destinationContainerInput = this.querySelector('.destination-container .input');
        if(departContainerInput.querySelector('position-component')){
            departContainerInput.removeChild(departContainerInput.querySelector('position-component'));
        }
        if(destinationContainerInput.querySelector('position-component')){
            destinationContainerInput.removeChild(destinationContainerInput.querySelector('position-component'));
        }
        }
    }

    mapDisplayed(){
        this.classList.add('map-displayed');
    }

    swapInputs() {
        const departInput = this.querySelector('.depart-container input');
        const destinationInput = this.querySelector('.destination-container input');

        const temp = departInput.value;
        departInput.value = destinationInput.value;
        destinationInput.value = temp;
    }
    replaceWithMapComponent() {
        return new Promise((resolve) => { 
            console.log("creation map component");
            const mapComponent = document.createElement('map-component');
            const departValue = this.departInput.value; 
            const destinationValue = this.destinationInput.value;

            this.classList.add('hide'); 
            setTimeout(() => {
                mapComponent.setValues(departValue, destinationValue);
                this.parentNode.replaceChild(mapComponent, this);
                mapComponent.connectedCallback();

                resolve(); 
            }, 500);
        });
    }


    async handleInputChange(inputValue, autocompleteList) {
        if (inputValue.length < 4) { 
            autocompleteList.innerHTML = '';
            autocompleteList.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputValue}`);
            const data = await response.json();

            if (data && data.features && data.features.length > 0) {
                autocompleteList.style.display = 'flex';
            } else {
                autocompleteList.style.display = 'none';
            }

            this.updateAutocompleteList(data.features || [], autocompleteList);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    updateAutocompleteList(features, autocompleteList) {
        autocompleteList.innerHTML = '';

        features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature.properties.label;

            li.addEventListener('click', () => {
                if(autocompleteList === this.autocompleteListDepart){
                    this.departInput.value = feature.properties.label;
                }
                else{
                    this.destinationInput.value = feature.properties.label;
                }
                autocompleteList.innerHTML = ''; 
                autocompleteList.style.display = "none";
            });

            autocompleteList.appendChild(li);
        });
    }

    setInputValue(inputType, value){
        if(inputType == "depart"){
            this.departInput.value = value;
        }
        else{
            this.destinationInput.value = value;
        }
    }

    addPositionComponent(type){
        const departContainer = this.querySelector('.depart-container .input');
        const destinationContainer = this.querySelector('.destination-container .input');
        const existingDepartComponent = departContainer.querySelector('position-component')
        const existingDestinationComponent = destinationContainer.querySelector('position-component');

        if (type === 'depart') {
            if (existingDestinationComponent) {
                destinationContainer.removeChild(existingDestinationComponent);
            }
            if (existingDepartComponent) {
                departContainer.removeChild(existingDepartComponent);
            } else {
                const positionComponent = document.createElement('position-component');
                positionComponent.setAttribute('data-type', 'depart');
                departContainer.prepend(positionComponent);
            }
        } else if (type === 'destination') {
            if (existingDepartComponent) {
                departContainer.removeChild(existingDepartComponent);
            }
            if (existingDestinationComponent) {
                destinationContainer.removeChild(existingDestinationComponent);
            } else {
                const positionComponent = document.createElement('position-component');
                positionComponent.setAttribute('data-type', 'destination');
                destinationContainer.prepend(positionComponent);
            }
        }
    }

    async validateAddress(address){
        if(address){
            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}`);
                const data = await response.json();
                return data.features.length > 0; 
            } catch (error) {
                console.error('Error validating address:', error);
                return false; 
            }
        }
    }

    isValidCoordinates(coords) {
        const pattern = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/; 
        const match = coords.match(pattern);

        if (match) {
            const latitude = parseFloat(match[1]);
            const longitude = parseFloat(match[3]);
            return (
                latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
            );
        }

        return false;
    }

    wrongInput(type){
        if(type === 'depart'){
            this.querySelector('.depart-container .input').classList.add('wrong')
        }
        this.querySelector('.destination-container .input').classList.add('wrong')
    }

    correctInputs(){
        this.querySelector('.destination-container .input').classList.remove('wrong')
        this.querySelector('.depart-container .input').classList.remove('wrong')
    }

    fetchAndSetInputsFromMap(){
        const mapComponent = document.querySelector('map-component');

        if (mapComponent) {
            this.departInput.value = mapComponent.getDepartValue();
            this.destinationInput.value = mapComponent.getDestinationValue();
        } else {
            console.error('MapComponent non trouvé.');
        }
    }

    async contectToActiveMq(){
        //récuperer la queue de activemq
        var client, destinationVelo, destinationPied;
        let url = "ws://localhost:61614/stomp";
        let login = "admin";
        let passcode = "password";
        let mess ="rien"
        destinationVelo = "itineraryQueueFull";
        destinationPied = "itineraryQueueWalking";

        client = Stomp.client(url);

        console.log("avant connect");

        client.connect(login, passcode, (frame) => {
            client.debug("connected to Stomp");
            /*
            client.subscribe(destinationVelo, (message) => {
                mess = message.body;
                let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
                if(currentActiveMqInfo){
                    currentActiveMqInfo = JSON.parse(currentActiveMqInfo);
                } else {
                    currentActiveMqInfo = [];
                }
                currentActiveMqInfo.push(mess);
                localStorage.setItem('activeMqInfo', JSON.stringify(currentActiveMqInfo));
                
                // Émettre un événement personnalisé avec le message reçu
                const event = new CustomEvent('details-update', { 
                    detail: { message: mess } 
                });
                document.dispatchEvent(event); // Diffuser l'événement à partir de SearchComponent
                
            });*/
            client.subscribe(destinationPied, (message) => {
                mess = message.body;
                let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
                if(currentActiveMqInfo){
                    currentActiveMqInfo = JSON.parse(currentActiveMqInfo);
                } else {
                    currentActiveMqInfo = [];
                }
                currentActiveMqInfo.push(mess);
                localStorage.setItem('activeMqInfo', JSON.stringify(currentActiveMqInfo));
                
                // Émettre un événement personnalisé avec le message reçu
                const event = new CustomEvent('details-update', { 
                    detail: { message: mess } 
                });
                document.dispatchEvent(event); // Diffuser l'événement à partir de SearchComponent
                
            });
        });
    }


    async getItinerary(depart, destination) {
        //Envoyé au back les adresses de départ et d'arrivée
        try{
            console.log("avant fetch");
            const rep = await fetch(`http://localhost:8081/api/ItineraryService/GetItinerary?departure=${depart}&arrival=${destination}`);
            if(!rep.ok) console.log("ERREUR fetch getItineray");
            console.log("après fetch");
        }catch{
            console.log("fetch done");
        }

    } 

}

customElements.define('search-component', SearchComponent);