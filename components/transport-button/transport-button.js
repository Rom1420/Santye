class TransportButton extends HTMLElement {
    constructor() {
        super()
        this.render();
    }
    render() {
        const icon = this.getAttribute('icon') || 'fa-question';

        this.innerHTML = `
             <link rel="stylesheet" href="./components/transport-button/style.css">
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