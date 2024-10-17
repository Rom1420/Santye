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
            <link rel="stylesheet" href="./components/map-component/style.css">
            <link rel="stylesheet" href="./components/details-component/style.css">
            <div class="main-container">
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
        const leftContainer = this.querySelector('.left-container');
        // Ajoute un événement de clic pour réduire/agrandir
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('reduced');
            
            if (container.classList.contains('reduced')) {
                leftContainer.classList.remove('hidden'); 
            } else {
                leftContainer.classList.add('hidden'); 
            }
        });
        
    }
}

customElements.define('map-component', MapComponent);