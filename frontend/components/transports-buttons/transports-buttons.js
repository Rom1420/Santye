class TransportsButtons extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    connectedCallback() {
        if (this.getAttribute('etat') === 'map-displayed') {
            this.mapDisplayed();
        }
    }

    render(shadow) {
        const pied = this.getAttribute('timePied') || '?';
        const velo = this.getAttribute('timeVelo') || '?';
        console.log("PIED : "+pied+" VELO : "+velo);
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/transports-buttons/style.css">
            <link rel="stylesheet" href="./style.css">
            <div class="transports-buttons-container">
                <transport-button icon="fa-person-walking" time="${pied}" id="pied"></transport-button>
                <transport-button icon="fa-bicycle" time="${velo}" id="velo"></transport-button>
            </div>
        `;    
    }

    mapDisplayed(){
        this.classList.add('map-displayed');

        const transportButtons = this.shadowRoot.querySelectorAll('transport-button');

        transportButtons.forEach(button => {
            button.setAttribute('etat', 'map-displayed');
        });
    }    
}

customElements.define('transports-buttons', TransportsButtons);