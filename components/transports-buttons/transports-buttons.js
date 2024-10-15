class TransportsButtons extends HTMLElement {
    constructor() {
        super()
        this.render();
    }
    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./components/transports-buttons/style.css">
            <div class="transports-buttons-container">
                <transport-button></transport-button>
                <transport-button></transport-button>
                <transport-button></transport-button>
                <transport-button></transport-button>
            </div>
        `;    
    }

    
}

customElements.define('transports-buttons', TransportsButtons);