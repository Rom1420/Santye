class TransportsButtons extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }
    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/transports-buttons/style.css">
            <link rel="stylesheet" href="./style.css">
            <div class="transports-buttons-container">
                <transport-button icon="fa-person-walking"></transport-button>
                <transport-button icon="fa-bicycle"></transport-button>
                <transport-button icon="fa-bus-simple"></transport-button>
                <transport-button icon="fa-car"></transport-button>
            </div>
        `;    
    }

    
}

customElements.define('transports-buttons', TransportsButtons);