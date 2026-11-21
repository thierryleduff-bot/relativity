// =====================================================================
// CHAPITRE 12 — LES TROUS NOIRS (ÉTAPE 5/5)
// ---------------------------------------------------------------------
// Conclusion : L'étoile qui tourne autour de rien.
// Générique montant, puis phrase finale. Orbite continue.
// =====================================================================

window.Stages['12_4'] = {
    time: 0,
    orbitTime: 0, // NOUVEAU : temps pour l'orbite indépendant du bouton
    animTime: 0,
    isRunning: false,
    isFinished: false,
    finishedTimer: 0, 
    
    // Paramètres du générique
    creditsY: 0,
    creditsSpeed: 30, 
    
    // Photo
    imgSagittarius: null,
    imgLoaded: false,
    showPhoto: false,
    photoAlpha: 0,
    
    // Textes du générique
    creditsText: [
        "Une étoile au centre de la galaxie.",
        "Pendant des années, les astronomes ont observé son mouvement.",
        "Elle tourne.",
        "Elle accélère.",
        "Elle tourne autour de... rien.",
        "Cet objet invisible contient plusieurs millions de masses solaires."
    ],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "L'étoile autour de rien";
        if (numberEl) numberEl.textContent = "CHAPITRE 12 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Conclusion</strong></p>
                <p>Pour terminer ce chapitre, nous allons faire une enquête.</p>
                <p>Pendant des années, les astronomes ont observé une étoile au centre de notre galaxie.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Lancez l'enquête pour voir ce qu'ils ont découvert.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-lancer-enquete" class="step-btn" style="width:100%; height:40px; background: #f59e0b; color: #0b0f19; font-weight: bold;">
                        Lancer l'enquête
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-lancer-enquete');
            if (btn) {
                btn.onclick = () => {
                    this.isRunning = true;
                    this.isFinished = false;
                    this.animTime = 0;
                    this.creditsY = 0; 
                    this.showPhoto = false;
                    this.photoAlpha = 0;
                    this.finishedTimer = 0;
                    btn.disabled = true;
                    btn.style.opacity = 0.5;
                    btn.style.cursor = 'not-allowed';
                    btn.textContent = "Enquête en cours...";
                };
            }
        }

        // Chargement de l'image
        this.imgSagittarius = new Image();
        this.imgSagittarius.src = 'IMG/sagittarius_a.jpg';
        this.imgSagittarius.onload = () => { this.imgLoaded = true; };
        
        if (this.imgSagittarius.complete) {
            this.imgLoaded = true;
        }
        
        this.reset();
    },

    reset: function() {
        this.time = 0;
        this.orbitTime = 0; // On remet l'orbite à zéro
        this.animTime = 0;
        this.finishedTimer = 0;
        this.isRunning = false;
        this.isFinished = false;
        this.creditsY = 0;
        this.showPhoto = false;
        this.photoAlpha = 0;

        const btn = document.getElementById('btn-lancer-enquete');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.textContent = "Lancer l'enquête";
        }
    },

        getCurrentStep: function() { return 5; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(13); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('12_3'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // L'orbite tourne tout le temps, indépendamment du bouton
        this.orbitTime += dt;

        if (this.isRunning && !this.isFinished) {
            this.animTime += dt;
            this.creditsY += this.creditsSpeed * dt; 
            
            // Fin de l'enquête quand le générique a fini de monter
            if (this.creditsY > height + 300) {
                this.isFinished = true;
                this.isRunning = false;
                this.finishedTimer = 0;
            }
        }

        // Si l'enquête est terminée, on gère l'apparition de la photo
        if (this.isFinished) {
            this.finishedTimer += dt;
            
            if (this.finishedTimer > 10) {
                this.showPhoto = true;
                if (this.photoAlpha < 1) {
                    this.photoAlpha += dt * 0.16; 
                    if (this.photoAlpha > 1) this.photoAlpha = 1;
                }
            }
        }

        // Fond noir absolu
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        // Paramètres de l'orbite (Le trou noir est au foyer, pas au centre)
        const a = width * 0.35; // Demi-grand axe
        const b = height * 0.15; // Demi-petit axe
        const c = Math.sqrt(a*a - b*b); // Distance focale (où se trouve le trou noir)
        const focusX = cx - c; // Le trou noir est décalé vers la gauche

        // Loi de Kepler : accélération près du foyer, ralentissement loin de lui
        // On utilise une vitesse angulaire qui dépend de la distance au foyer
        const meanMotion = 0.8; // Vitesse de base
        const currentAngle = this.orbitTime * meanMotion; 
        
        // Pour simuler l'ellipse de Kepler sans calculer l'anomalie excentrique (trop lourd ici),
        // on utilise une approximation qui "pousse" le point vers le foyer.
        // Formule paramétrique classique de l'ellipse :
        const x = cx + a * Math.cos(currentAngle);
        const y = cy + b * Math.sin(currentAngle);
        
        // Calcul de la distance au foyer (pour l'effet visuel de vitesse, si on voulait aller plus loin)
        // On va simplement dessiner l'étoile sur cette ellipse

        // 1. L'étoile et sa trainée (CORRIGÉ : queue plus courte et pas de trait d'orbite)
        if (this.isRunning || this.isFinished || true) { // L'étoile est toujours là
            
            // On calcule la position précédente pour la trainée courte
            const trailAngle = currentAngle - 0.05; // CORRECTION : 0.05 au lieu de 0.2
            const trailX = cx + a * Math.cos(trailAngle);
            const trailY = cy + b * Math.sin(trailAngle);

            ctx.beginPath();
            ctx.moveTo(trailX, trailY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // 2. Affichage du générique (si en cours)
        if (this.isRunning && !this.isFinished) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'italic 18px sans-serif';
            ctx.textAlign = 'center';
            
            const lineSpacing = 40;
            const topMargin = 50;
            const bottomMargin = 50;
            
            this.creditsText.forEach((text, index) => {
                let yPos = (height - bottomMargin) - this.creditsY + (index * lineSpacing);
                
                let alpha = 1;
                const distFromBottom = height - yPos;
                if (distFromBottom < bottomMargin) {
                    alpha = distFromBottom / bottomMargin;
                }
                
                if (yPos < topMargin) {
                    alpha = yPos / topMargin;
                }
                
                if (yPos > 0 && yPos < height) {
                    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                    ctx.fillText(text, cx, yPos);
                }
            });
            ctx.globalAlpha = 1; 
            ctx.restore();
        }

        // 3. Phrase finale (apparaît à la fin)
        if (this.isFinished) {
            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Le trou noir est invisible.", cx, height - 120);
            ctx.fillText("Son influence ne l'est pas.", cx, height - 80);
            ctx.restore();
        }

        // 4. La photo de Sagittarius A*
        if (this.showPhoto && this.imgLoaded && this.photoAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.photoAlpha;
            
            const imgSize = width * 0.15;
            const margin = 30;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.beginPath();
            ctx.roundRect(margin - 5, margin - 5, imgSize + 10, imgSize + 10, 4);
            ctx.fill();
            
            ctx.drawImage(this.imgSagittarius, margin, margin, imgSize, imgSize);
            
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(margin, margin, imgSize, imgSize);
            
            ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Sagittarius A*", margin + imgSize/2, margin + imgSize + 15);

            ctx.restore();
        }

        ctx.restore();
    },

    destroy: function() {}
};