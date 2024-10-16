class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.addEventListeners();

        if (this.getAttribute('etat') === 'permute') {
            this.addTransportsButtons(); 
        }
    }

    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./components/search-component/style.css">
            <div class="main-container">
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
            </div>
        `;
    }

    addEventListeners() {
        const validationButton = this.querySelector('.validation-button');
        validationButton.addEventListener('click', () => this.addTransportsButtons());
    }

    addTransportsButtons(){
        const inputsContainer = this.querySelector('.inputs-container'); 
        const searchContainer = this.querySelector('.search-container');
        const destinationContainer = this.querySelector('.destination-container');
        const validationButton = this.querySelector('.validation-button')

        const newTransportsButtons = document.createElement('transports-buttons');
        inputsContainer.appendChild(newTransportsButtons);
        searchContainer.classList.add('expanded');
        destinationContainer.removeChild(validationButton);

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
    }

    swapInputs() {
    const departInput = this.querySelector('.depart-container input');
    const destinationInput = this.querySelector('.destination-container input');

    const temp = departInput.value;
    departInput.value = destinationInput.value;
    destinationInput.value = temp;
}
}

customElements.define('search-component', SearchComponent);