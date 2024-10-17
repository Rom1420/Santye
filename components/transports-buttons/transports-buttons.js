class TransportsButtons extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    connectedCallback() {
        if (this.getAttribute('etat') === 'map-displayed') {
            console.log("wewe");
            this.mapDisplayed();
        }
    }

    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/transports-buttons/style.css">
            <link rel="stylesheet" href="./style.css">
            <div class="transports-buttons-container">
                <transport-button icon="fa-person-walking" time="22"></transport-button>
                <transport-button icon="fa-bicycle" time="15"></transport-button>
                <transport-button icon="fa-bus-simple" time="13"></transport-button>
                <transport-button icon="fa-car" time="7"></transport-button>
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