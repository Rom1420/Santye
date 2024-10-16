class TransportButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
    }

    render(shadow) {
        const icon = this.getAttribute('icon') || 'fa-question';

        shadow.innerHTML = `
             <link rel="stylesheet" href="./components/transport-button/style.css">
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
             <link rel="stylesheet" href="./style.css">
             <div class="transport-button-container">
                <div class="transport-button">
                    <span><i class="fa-solid ${icon}"></i></span>
                </div>
                <p class="time">25 min</p>
            </div>
        `;
    }
}

customElements.define('transport-button', TransportButton);
