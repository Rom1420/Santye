class PositionComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    connectedCallback() {
        this.style.display = 'none';
        setTimeout(() => {
            this.style.display = 'contents'; 
            this.addEventListeners();
        }, 10); 
    }


    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./style.css">
            <link rel="stylesheet" href="./components/position-component/style.css">
            <div class="position-container">
                <div class="position-content location">
                    Ma localisation
                </div>
                <div class='separator'></div>
                <div class="position-content choose-on-map">
                    Sur la carte
                </div>
            </div>
        `;
    }
    
    addEventListeners() {
        const locationElement = this.shadowRoot.querySelector('.location');
        locationElement.addEventListener('click', () => {
            this.getLocation(); 
        });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    this.dispatchEvent(new CustomEvent('location-found', {
                        detail: { latitude, longitude, type: this.getAttribute('data-type')},
                        bubbles: true, 
                        composed: true,
                        
                    }));
                    this.remove();
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("L'utilisateur a refusé la demande de localisation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("La position est indisponible.");
                            break;
                        case error.TIMEOUT:
                            alert("La demande de localisation a expiré.");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("Une erreur inconnue s'est produite.");
                            break;
                    }
                }
            );
        } else {
            alert("La géolocalisation n'est pas prise en charge par ce navigateur.");
        }
    }
}

customElements.define('position-component', PositionComponent);