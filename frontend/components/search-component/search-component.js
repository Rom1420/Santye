class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this.render();

        this.parsedMessage = null;
        this.velo = false;
        
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
        this.verifyInput(departValue, destinationValue);
        if(departValue && destinationValue){
            this.correctInputs();
            this.getItinerary(departValue, destinationValue)
            .then(queueName => {
                this.contectToActiveMq();
                this.createTransportButtons();
                this.expandSearchContainer();
                this.removeValidationButton();
                this.createPermuteButton();
            })
            .catch(error => {
                console.error("Error fetching itinerary:", error);
            });
        }
        
            
        console.log(`******************************************${departValue} ${destinationValue}******************************************`);
    }

    verifyInput(depart, destination){
        if(depart && !destination){
            this.correctInputs();
            this.wrongInput("destination");
        }
        if (!depart && !destination ){
            this.wrongInput("depart");
            this.wrongInput("destination");
        }
        if (!depart && destination ){
            this.correctInputs();
            this.wrongInput("depart");
        }
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
        //this.setTimes();
        const newTransportsButtons = document.createElement('transports-buttons');
        /*
        if (newTransportsButtons) {
            console.log("OUI");
            const buttons = newTransportsButtons.querySelectorAll('.transport-button');
            console.log("selection de la selection mdr "+buttons[0]);
            if (buttons.length >= 2) {
                console.log("dans le ifffffffffff");
                // Ajouter un écouteur pour le premier bouton (piéton)
                buttons[0].addEventListener('click', () => {
                    console.log("j'crois j'arrive jamais la");
                    if (!this.classList.contains('map-displayed')) {
                        this.replaceWithMapComponent();
                        this.velo = false;
                    }
                });

                // Ajouter un écouteur pour le deuxième bouton (vélo)
                buttons[1].addEventListener('click', () => {
                    console.log("j'suis la ??");
                    if (!this.classList.contains('map-displayed')) {
                        this.replaceWithMapComponent();
                        this.velo = true;
                    }
                });
            }
        }*/

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
        const inputsContainer = this.querySelector('.inputs-container');
        inputsContainer.classList.add('expanded');
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
        const transportsButtons = document.querySelector('transports-buttons');
        transportsButtons.setAttribute('timePied', '?');
        transportsButtons.setAttribute('timeVelo', '?');
        transportsButtons.render(transportsButtons.shadowRoot);

        const temp = departInput.value;
        departInput.value = destinationInput.value;
        destinationInput.value = temp;
        this.getItinerary(departInput.value, temp)
        .then(queueName => {
            this.updateInfos();
        })
    }
    replaceWithMapComponent() {
        this.updateInfos();
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
        var client;
        let url = "ws://localhost:61614/stomp";
        let login = "admin";
        let passcode = "password";

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
            client.subscribe("itineraryQueue", (message) => {
                try {
                    // Parsing sécurisé du message JSON
                    this.parsedMessage = JSON.parse(message.body);
                    //this.updateInfos();
                    this.setTimes();
                } catch (error) {
                    console.error('Erreur lors du traitement du message ActiveMQ :', error, message.body);
                }
            });
            
        });
    }

    updateInfos() {
        if (!this.parsedMessage) {
            console.error("Données invalides ou non disponibles dans parsedMessage.");
            return;
        }
    
        // Déterminer quelle partie du trajet doit être mise en cache
        if (this.velo) {
            if (
                !this.parsedMessage.Velo ||
                !this.parsedMessage.Velo.Pied1 ||
                !this.parsedMessage.Velo.Velo1 ||
                !this.parsedMessage.Velo.Pied2
            ) {
                console.error("Les données pour Velo sont invalides ou incomplètes.");
                return;
            }
    
            // Préparer les données pour le trajet Velo
            const veloData = {
                Pied1: this.parsedMessage.Velo.Pied1,
                Velo1: this.parsedMessage.Velo.Velo1,
                Pied2: this.parsedMessage.Velo.Pied2
            };
    
            // Mettre à jour le localStorage
            localStorage.setItem('activeMqInfo', JSON.stringify(veloData));
            console.log("Trajet Velo mis à jour dans le localStorage :", veloData);
    
            // Émettre un événement pour informer les autres composants
            const event = new CustomEvent('route-updated', { detail: veloData });
            document.dispatchEvent(event);
        } else {
            if (!this.parsedMessage.Pied) {
                console.error("Les données pour Pied sont invalides ou incomplètes.");
                return;
            }
    
            // Préparer les données pour le trajet à pied
            const piedData = this.parsedMessage.Pied;
    
            // Mettre à jour le localStorage
            localStorage.setItem('activeMqInfo', JSON.stringify(piedData));
            console.log("Trajet Pied mis à jour dans le localStorage :", piedData);
    
            // Émettre un événement pour informer les autres composants
            const event = new CustomEvent('route-updated', { detail: piedData });
            document.dispatchEvent(event);
        }
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
    
    setTimes() {
        console.log('set time called')
        // Initialiser les valeurs piedTime et veloTime à 0
        let piedTimeTotal = 0;
        let veloTimeTotal = 0;
    
        // Vérifier si le message est bien défini dans this.parsedMessage
        const message = this.parsedMessage;
    
        if (!message) {
            console.error("Message non trouvé dans parsedMessage");
            return;
        }
    
        // Calculer le temps total de marche (Pied)
        if (message.Pied && message.Pied.features && message.Pied.features.length > 0) {
            console.log("LAAAA");
            message.Pied.features.forEach(feature => {
                if (feature.properties && feature.properties.segments) {
                    feature.properties.segments.forEach(segment => {
                        piedTimeTotal += segment.duration; // Ajouter chaque durée à piedTimeTotal
                    });
                }
            });
        }
    
        // Calculer le temps total pour le trajet mixte (Pied1 + Velo1 + Pied2)
        if (message.Velo.Pied1 && message.Velo.Pied1.features && message.Velo.Pied1.features.length > 0) {
            message.Velo.Pied1.features.forEach(feature => {
                if (feature.properties && feature.properties.segments) {
                    feature.properties.segments.forEach(segment => {
                        veloTimeTotal += segment.duration; // Ajouter chaque durée de Pied1 à veloTimeTotal
                    });
                }
            });
        }
    
        if (message.Velo.Velo1 && message.Velo.Velo1.features && message.Velo.Velo1.features.length > 0) {
            message.Velo.Velo1.features.forEach(feature => {
                if (feature.properties && feature.properties.segments) {
                    feature.properties.segments.forEach(segment => {
                        veloTimeTotal += segment.duration; // Ajouter chaque durée de Velo1 à veloTimeTotal
                    });
                }
            });
        }
    
        if (message.Velo.Pied2 && message.Velo.Pied2.features && message.Velo.Pied2.features.length > 0) {
            message.Velo.Pied2.features.forEach(feature => {
                if (feature.properties && feature.properties.segments) {
                    feature.properties.segments.forEach(segment => {
                        veloTimeTotal += segment.duration; // Ajouter chaque durée de Pied2 à veloTimeTotal
                    });
                }
            });
        }

        console.log("la fait fait mes changements");
        piedTimeTotal = Math.round(piedTimeTotal / 60);
        veloTimeTotal = Math.round(veloTimeTotal / 60);

        let piedTimeFormatted = '';
        if (piedTimeTotal < 60) {
            piedTimeFormatted = `${piedTimeTotal}m`;
        } else {
            const hours = Math.floor(piedTimeTotal / 60);
            const minutes = piedTimeTotal % 60;
            piedTimeFormatted = minutes > 0 ? `${hours} h ${minutes}` : `${hours} h`;
        }

        let veloTimeFormatted = '';
        if (veloTimeTotal < 60) {
            veloTimeFormatted = `${veloTimeTotal}m`;
        } else {
            const hours = Math.floor(veloTimeTotal / 60);
            const minutes = veloTimeTotal % 60;
            veloTimeFormatted = minutes > 0 ? `${hours} h ${minutes}` : `${hours} h`;
        }

        const transportsButtons = document.querySelector('transports-buttons');
        transportsButtons.setAttribute('timePied', piedTimeFormatted);
        transportsButtons.setAttribute('timeVelo', veloTimeFormatted);
        transportsButtons.render(transportsButtons.shadowRoot);

        transportsButtons.shadowRoot.querySelector("#pied").addEventListener('click', () => {
            if (!this.classList.contains('map-displayed')) {
                this.velo = false;
                this.replaceWithMapComponent();
            }
        });

        transportsButtons.shadowRoot.querySelector("#velo").addEventListener('click', () => {
            if (!this.classList.contains('map-displayed')) {
                this.velo = true;
                this.replaceWithMapComponent();
            }
        });
        
    }
    

}

customElements.define('search-component', SearchComponent);