class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.addEventListeners();
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
        const transportsButtons = this.querySelector('transports-buttons');
        const inputsContainer = this.querySelector('.inputs-container'); 
        const searchContainer = this.querySelector('.search-container');

        if (!transportsButtons) {
            const newTransportsButtons = document.createElement('transports-buttons');
            inputsContainer.appendChild(newTransportsButtons);
            searchContainer.classList.add('expanded');
        } else {
            inputsContainer.removeChild(transportsButtons);
            searchContainer.classList.remove('expanded');
        }
    }
}

customElements.define('search-component', SearchComponent);