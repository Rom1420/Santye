class DetailsComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.steps = []; // Stocker toutes les étapes
        this.currentView = []; // Stocker les étapes actuellement affichées
        this.currentStepIndex = 0; // Index pour suivre les étapes affichées par groupe
        this.render(shadow);

        const storedMessage = localStorage.getItem('activeMqInfo');
        if (storedMessage) {
            try {
                const message = JSON.parse(storedMessage);
                this.updateDetails(message);
            } catch (error) {
                console.error('Erreur lors de la lecture du localStorage :', error);
            }
        }

        document.addEventListener('route-updated', (event) => {
            const message = event.detail;

            if (message && message.Pied) {
                this.updateDetails(message);
            } else {
                console.error('Message de route non valide reçu :', message);
            }
        });
    }

    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/details-component/style.css">
            <div class="details-component-container"></div>
        `;
    }

    updateDetails(message) {
        this.steps = message.features
            ? message.features[0].properties.segments[0].steps
            : [
                  ...message.Pied1.features[0].properties.segments[0].steps,
                  ...message.Velo1.features[0].properties.segments[0].steps,
                  ...message.Pied2.features[0].properties.segments[0].steps,
              ];
        this.currentStepIndex = 0; // Réinitialiser l'index
        this.currentView = this.steps.slice(0, 10); // Afficher les 10 premières étapes
        this.updateDetailsView();

        if (!this.interval) {
            this.startAutoUpdate();
        }
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

    startAutoUpdate() {
        // Mise à jour des étapes toutes les 5 secondes
        this.stepInterval = setInterval(() => {
            if (this.currentView.length > 1) {
                this.currentView.shift(); // Supprimer la première étape affichée
                this.updateDetailsView();
            } else if (this.steps.length > this.currentStepIndex + 10) {
                console.log("Passage au groupe suivant d'étapes.");
                this.currentStepIndex += 10;
                this.currentView = this.steps.slice(this.currentStepIndex, this.currentStepIndex + 10);
                this.updateDetailsView();
            } else {
                console.log("Toutes les étapes ont été affichées.");
                clearInterval(this.stepInterval);
                this.stepInterval = null;
            }
        }, 5000); // Mise à jour toutes les 5 secondes

        // Mise à jour du groupe d'étapes toutes les 50 secondes
        this.groupInterval = setInterval(() => {
            if (this.steps.length > this.currentStepIndex + 10) {
                this.currentStepIndex += 10; // Passer au groupe suivant
                this.currentView = this.steps.slice(this.currentStepIndex, this.currentStepIndex + 10);
                this.updateDetailsView();
            } else {
                console.log("Toutes les étapes ont été affichées.");
                clearInterval(this.groupInterval); // Arrêter la mise à jour des groupes
                this.groupInterval = null;
            }
        }, 50000); // Mise à jour toutes les 50 secondes
    }

    updateDetailsView() {
        console.log('Mise à jour des détails...');
        const container = this.shadowRoot.querySelector('.details-component-container');
        container.innerHTML = ''; // Réinitialiser les anciens détails

        if (!this.currentView || this.currentView.length === 0) {
            this.addDetails("No remaining steps.", false);
            return;
        }

        this.currentView.forEach((step, index) => {
            const distance = step.distance.toFixed(1); // Distance en mètres
            const duration = (step.duration / 60).toFixed(0); // Durée en minutes
            const instruction = step.instruction;

            // Ajouter l'instruction (avec box)
            this.addDetails(instruction, true);

            // Ajouter la distance et la durée (sans box)
            this.addDetails(`Go for ${distance} meters (${duration} min)`, false);

            // Ajouter une séparation sauf après le dernier élément
            if (index < this.currentView.length - 1) {
                this.addSeparation();
            }
        });
    }
}

customElements.define('details-component', DetailsComponent);
