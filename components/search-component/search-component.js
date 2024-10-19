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
            this.addTransportsButtons();
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
    }

    addTransportsButtons(){
        const departValue = this.departInput.value.trim();
        const destinationValue = this.destinationInput.value.trim();

        this.validateItinerary(departValue, destinationValue)
            .then(queueName => {
                console.log("Itinerary queue name:", queueName);
                this.createTransportButtons();
                this.expandSearchContainer();
                this.removeValidationButton();
                this.createPermuteButton();
            })
            .catch(error => {
                console.error("Error fetching itinerary:", error);
            });
    }

    async validateItinerary(departure, destination) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const isDepartureValid = await this.validateAddress(departure);
        const isDestinationValid = await this.validateAddress(destination);
        console.log(isDepartureValid)

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
            return "itineraryQueue"; 
        }

    createTransportButtons() {
        const inputsContainer = this.querySelector('.inputs-container');
        const newTransportsButtons = document.createElement('transports-buttons');

        newTransportsButtons.addEventListener('click', () => {
            if (!this.classList.contains('map-displayed')) {
                this.replaceWithMapComponent();
            }
        });

        if (this.classList.contains('map-displayed')) {
            newTransportsButtons.setAttribute('etat', 'map-displayed');
        }
        
        inputsContainer.appendChild(newTransportsButtons);
    }

    expandSearchContainer() {
        const searchContainer = this.querySelector('.search-container');
        searchContainer.classList.add('expanded');
    }

    removeValidationButton() {
        const destinationContainer = this.querySelector('.destination-container');
        const validationButton = this.querySelector('.validation-button');
        destinationContainer.removeChild(validationButton);
    }

    createPermuteButton() {
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
        departContainerInput.removeChild(departContainerInput.querySelector('position-component'));
        destinationContainerInput.removeChild(destinationContainerInput.querySelector('position-component'));
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
        const mapComponent = document.createElement('map-component');
        const departValue = this.departInput.value; // Sauvegarde des valeurs
        const destinationValue = this.destinationInput.value;

        this.classList.add('hide'); 
        setTimeout(() => {
            this.parentNode.replaceChild(mapComponent, this);
            mapComponent.connectedCallback(departValue, destinationValue);
        }, 500);
        
    }


    async handleInputChange(inputValue, autocompleteList) {
        if (inputValue.length < 3) { 
            autocompleteList.innerHTML = '';
            autocompleteList.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${inputValue}`);
            const data = await response.json();
            if (data.features.length > 0) {
            autocompleteList.style.display = 'flex';  
            } else {
                autocompleteList.style.display = 'none';  
            }
            
            this.updateAutocompleteList(data.features, autocompleteList);
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
        try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}`);
        const data = await response.json();
        return data.features.length > 0; 
        } catch (error) {
            console.error('Error validating address:', error);
            return false; 
        }
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

}

customElements.define('search-component', SearchComponent);