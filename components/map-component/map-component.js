class MapComponent extends HTMLElement {
    constructor() {
        super();
        
    }
    connectedCallback() {
        this.render();
        this.addEventListeners();
        setTimeout(() => {
            this.classList.add('show');
        }, 1);
        
    }

    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./style.css">
            <div class="main-container">
            <div class="left-container">
                <search-component etat="map-displayed"></search-component>
            </div>
            <div class="right-container">
                <h1 class="main-title">Santye</h1>
                <button class="menu-button">
                    <div class="icon-bar"></div>
                    <div class="icon-bar"></div>
                    <div class="icon-bar"></div>
                </button>
                <div class="map-container">
                    <img src="./assets/pics/map.png" class="map">
                </div>
                <div class="eta-container">
                    <img src="./assets/pics/clock.png" alt="ETA" id="clock">
                    <h4 id="ETA">1H45</h4>
                </div>
                </div>
            </div>
        `;
    }
    addEventListeners(){
        const toggleBtn = document.querySelector('.menu-button');
        const container = document.querySelector('.main-container');

        // Ajoute un événement de clic pour réduire/agrandir
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('reduced');
        });
    }
}

customElements.define('map-component', MapComponent);