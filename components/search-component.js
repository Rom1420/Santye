class SearchComponent extends HTMLElement {
    constructor() {
        super()
        this.render();
    }
    render() {
        this.innerHTML = `
            <link rel="stylesheet" href="./components/style-search.css">
            <div class="main-container">
                <div class="search-container">
                    <h1 class="main-title">Santye</h1>
                    <div class="inputs-container">
                        <div class="depart-container">
                            <div class="input">
                                <input type="text" placeholder="Départ">
                                <div class="location-button">
                                    <span><i class="fas fa-location"></i></span>
                                </div>
                            </div>
                        </div>
                        <div class="destination-container">
                            <div class="input">
                                <input type="text" placeholder="Destination">
                                <div class="location-button">
                                    <span><i class="fas fa-location"></i></span>
                                </div>
                            </div>
                            <div class="validation-button">
                                <span><i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('search-component', SearchComponent);