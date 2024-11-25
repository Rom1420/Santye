class TransportButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }
    
    connectedCallback() {
        if (this.getAttribute('etat') === 'map-displayed') {
            this.mapDisplayed();
        }
    }

    render(shadow) {
        const icon = this.getAttribute('icon') || 'fa-question';
        const time = this.getAttribute('time') || '?';

        shadow.innerHTML = `
             <link rel="stylesheet" href="./components/transport-button/style.css">
             <link rel="stylesheet" href="./style.css">
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
             <link rel="stylesheet" href="./style.css">
             <div class="transport-button-container">
                <div class="transport-button">
                    <span><i class="fa-solid ${icon}"></i></span>
                </div>
                <p class="time">${time} min</p>
            </div>
        `;
    }

    mapDisplayed(){
        this.classList.add('map-displayed');
        const faSolid = this.shadowRoot.querySelector('.fa-solid');
        faSolid.classList.add('map-displayed');

        const time = this.shadowRoot.querySelector('.time');
        time.classList.add('map-displayed')
    }
}

customElements.define('transport-button', TransportButton);
