class DetailsComponent extends HTMLElement {
    constructor() {
        super()
        console.log("dans le component");
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);
        this.addDetails("Marcher 800m",false);
        this.addDetails("Prendre la deuxième sortie",true);
        this.addDetails("Marcher 500m",false);
        this.addDetails("Tourner à gauche sur route des Combes",true);
        this.addDetails("Marcher 800m",false);
        this.addDetails("Prendre la deuxième sortie",true);
        this.addDetails("Marcher 500m",false);
        this.addDetails("Tourner à gauche sur route des Combes",true);
    }
    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/details-component/style.css">
            <link rel="stylesheet" href="./style.css">
            <div class="details-component-container">
                
            </div>
        `;    
    }

    addDetails(text, box) {
        const main_div = this.shadowRoot.querySelector('.details-component-container'); // Correction ici pour accéder à shadowRoot
        const detailDiv = document.createElement('div'); // Crée une nouvelle div pour le détail

        detailDiv.textContent = text; // Ajoute le texte

        // Applique une classe CSS pour ajouter un encadré si box est vrai
        if (box) {
            detailDiv.classList.add('box'); // Ajoute une classe pour le style de la box
        }

        main_div.appendChild(detailDiv); // Ajoute la div au conteneur principal
    }

}

customElements.define('details-component', DetailsComponent);