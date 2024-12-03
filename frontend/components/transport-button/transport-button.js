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
        const time = this.getAttribute('time');
        if (time === '?') {
            this.showLoading();  
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
                <p class="time">${time}</p>
                <div class="loading-spinner" style="display: none;"><span class="loader"></span></div>
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

    showLoading() {
        const timeElement = this.shadowRoot.querySelector('.time');
        const spinner = this.shadowRoot.querySelector('.loading-spinner');
        
        timeElement.style.display = 'none'; 
        spinner.style.display = 'inline-block';
    }
}

customElements.define('transport-button', TransportButton);
