class SearchComponent extends HTMLElement {
    constructor() {
        super()
        this.render();
        this.addEventListener();
    }
    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./components/style-search.css">
            <div class="main-container">
                <div class="search-container">
                    <h1 class="main-title">Santye</h1>
                    <div class="inputs-container">
                        <div class="depart-container">
                            <div class="input">
                                <input type="text" placeholder="Départ">
                                <div class="location-button">
                                    <span><i class="fas fa-location"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="destination-container">
                            <div class="input">
                                <input type="text" placeholder="Destination">
                                <div class="location-button">
                                    <span><i class="fas fa-location"></i></span>
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
        const newComponent = document.createElement('transports-buttons');
        
        const inputsContainer = this.querySelector('.inputs-container');
        inputsContainer.appendChild(newComponent);
    }
}

customElements.define('search-component', SearchComponent);