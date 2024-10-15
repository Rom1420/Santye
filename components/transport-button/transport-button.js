class TransportButton extends HTMLElement {
    constructor() {
        super()
        this.render();
    }
    render() {
        this.innerHTML = `
             <link rel="stylesheet" href="./components/transport-button/style.css">
             <div class="transport-button-container">
                <div class="transport-button"></div>
                <p>25 min</p>
            </div>
        `;    
    }

    
}

customElements.define('transport-button', TransportButton);