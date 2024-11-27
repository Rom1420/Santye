class DetailsComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.render(shadow);

        let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
        console.log('currentActiveMqInfo:', currentActiveMqInfo);
        let activeMqInfo = JSON.parse(currentActiveMqInfo);
        for(let info of activeMqInfo) {
            this.updateDetails(JSON.parse(info));
        }

        // Écouter les événements `details-update`
        document.addEventListener('details-update', (event) => {
            const message = event.detail.message;

            // Mettre à jour les détails avec le message reçu
            this.updateDetails(JSON.parse(message));
        });
    }

    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/details-component/style.css">
            <div class="details-component-container"></div>
        `;
    }

    updateDetails(message) {
        const container = this.shadowRoot.querySelector('.details-component-container');
        container.innerHTML = ''; // Réinitialiser les anciens détails

        // Parse le message JSON pour obtenir les étapes
        const steps = message.features[0].properties.segments[0].steps;

        steps.forEach((step, index) => {
            const distance = step.distance.toFixed(1); // Distance en mètres
            const duration = (step.duration / 60).toFixed(0); // Durée en minutes
            const instruction = step.instruction;

            // Ajouter l'instruction (avec box)
            this.addDetails(instruction, true);

            // Ajouter la distance et la durée (sans box)
            this.addDetails(`Go for ${distance} meters (${duration} min)`, false);

            // Ajouter une séparation sauf après le dernier élément
            if (index < steps.length - 1) {
                this.addSeparation();
            }
        });
    }

    addDetails(text, box) {
        const mainDiv = this.shadowRoot.querySelector('.details-component-container');
        const detailDiv = document.createElement('div');
        detailDiv.textContent = text;

        if (box) {
            detailDiv.classList.add('box');
        }

        mainDiv.appendChild(detailDiv);
    }

    addSeparation() {
        const mainDiv = this.shadowRoot.querySelector('.details-component-container');
        const separationLine = document.createElement('div');
        separationLine.classList.add('separation-line');
        mainDiv.appendChild(separationLine);
    }
}

customElements.define('details-component', DetailsComponent);
