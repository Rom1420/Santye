class DetailsComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.steps = []; // Stocker les étapes localement
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
        
            // Vérifiez si le message est valide
            if (message && message.Pied) {
                this.updateDetails(message);
            } else {
                console.error('Message de route non valide reçu :', message);
            }
        });
        

        /*
        let currentActiveMqInfo = localStorage.getItem('activeMqInfo');
        console.log('*******LECTURE LOCAL STORAGE DETAILS ********');
        let activeMqInfo = JSON.parse(currentActiveMqInfo);
        console.log("1"+activeMqInfo);
        console.log("2"+activeMqInfo[0]);
        this.updateDetails(JSON.parse(activeMqInfo));
        //localStorage.clear();
        // Écouter les événements `details-update`
        document.addEventListener('details-update', (event) => {
            const message = event.detail.message;
            console.log('Message reçu dans DetailsComponent:', message);

            // Mettre à jour les détails avec le message reçu
            this.updateDetails(JSON.parse(message));
        });*/
    }

    render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="./components/details-component/style.css">
            <div class="details-component-container"></div>
        `;
    }

    updateDetails(message) {
        // Mettre à jour les étapes
        this.steps = message.features? message.features[0].properties.segments[0].steps : 
            [
                ...message.Pied1.features[0].properties.segments[0].steps,
                ...message.Velo1.features[0].properties.segments[0].steps,
                ...message.Pied2.features[0].properties.segments[0].steps
            ];
        this.updateDetailsView();

        // Démarrer la mise à jour automatique si elle n'est pas encore active
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
        this.interval = setInterval(() => {
            if (this.steps.length > 1) {
                this.steps.shift(); // Retirer la première étape
                this.updateDetailsView();
            } else {
                console.log("Dernière étape atteinte. Arrêt de l'auto-update.");
                clearInterval(this.interval); // Arrêter l'intervalle
                this.interval = null;
            }
        }, 5000); // Mettre à jour toutes les 5 secondes
    }

    updateDetailsView() {
        console.log('Mise à jour des détails...');
        const container = this.shadowRoot.querySelector('.details-component-container');
        container.innerHTML = ''; // Réinitialiser les anciens détails

        if (!this.steps || this.steps.length === 0) {
            this.addDetails("No remaining steps.", false);
            return;
        }

        this.steps.forEach((step, index) => {
            const distance = step.distance.toFixed(1); // Distance en mètres
            const duration = (step.duration / 60).toFixed(0); // Durée en minutes
            const instruction = step.instruction;

            // Ajouter l'instruction (avec box)
            this.addDetails(instruction, true);

            // Ajouter la distance et la durée (sans box)
            this.addDetails(`Go for ${distance} meters (${duration} min)`, false);

            // Ajouter une séparation sauf après le dernier élément
            if (index < this.steps.length - 1) {
                this.addSeparation();
            }
        });
    }
}

customElements.define('details-component', DetailsComponent);
