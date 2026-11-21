// =====================================================================
// CHAPITRE 8 — L'ASCENSEUR D'EINSTEIN (ÉTAPE 1/2)
// ---------------------------------------------------------------------
// Principe d'équivalence. Personnages centrés, objet lâché de la main,
// étoiles accélérées synchronisées, sol courbe.
// =====================================================================

window.Stages[8] = {
    time: 0,
    stars: [],
    movingStars: [],
    starOffset: 0,
    starSpeed: 50, 
    
    cycleTime: 0,
    phase: 0, // 0: Attente, 1: Chute, 2: Impact, 3: Observation
    phaseTimer: 0,
    
    // Dimensions (ascenseur 200px de haut)
    cabinW: 160,
    cabinH: 200,
    
    objY: 0,
    objSize: 8,
    objectDropped: false,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "L'Ascenseur d'Einstein";
        if (numberEl) numberEl.textContent = "CHAPITRE 8 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. Le principe d'équivalence</strong></p>
                <p>Einstein imagine un homme enfermé dans une cabine sans fenêtres.</p>
                <p>Il sent son poids, il est plaqué au sol. S'il lâche un objet, celui-ci tombe.</p>
                <p>Ce phénomène se produit dans deux situations :</p>
                <p>• Soit la cabine est posée sur Terre (la gravité attire l'objet).</p>
                <p>• Soit la cabine est dans l'espace et <span class="tooltip-trigger" data-tooltip-content="L'accélération, c'est quoi ?||C'est le changement de vitesse. On le mesure en mètres par seconde toutes les secondes (m/s/s).||Sur la Terre : 9,81 m/s² (on est bien).||Sur la Lune : 1,62 m/s² (on fait des bonds).||Sur une planète 2 fois plus massive : 19,62 m/s² (on est écrasé).">accélère</span> vers le haut (le sol monte vers l'objet).</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">À l'intérieur, il est impossible de faire la différence.</p>
				<p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">C'est ce pont qui a permis à Einstein de transformer la gravité en géométrie</p>
            `;

            // Gestion du tooltip
            const triggers = narrativeEl.querySelectorAll('.tooltip-trigger');
            const citationZone = document.getElementById('citation-zone');
            if (citationZone) {
                triggers.forEach(trigger => {
                    const content = trigger.getAttribute('data-tooltip-content');
                    if (!content) return;

                    trigger.addEventListener('mouseenter', () => {
                        const parts = content.split('||');
                        let html = `<div class="citation-title">${parts[0]}</div>`;
                        parts.slice(1).forEach(line => { html += `<div class="citation-line">${line}</div>`; });
                        citationZone.innerHTML = html;
                        citationZone.classList.add('active');
                    });

                    trigger.addEventListener('mouseleave', () => {
                        citationZone.innerHTML = '';
                        citationZone.classList.remove('active');
                    });
                });
            }
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.movingStars = [];
        for (let i = 0; i < 80; i++) {
            this.movingStars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 2 + 0.5,
                baseAlpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.starOffset = 0;
        this.starSpeed = 50; // Départ lent
        this.cycleTime = 0;
        this.phase = 0;
        this.phaseTimer = 0;
        this.objY = -70; // Position de la main
        this.objectDropped = false;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('8_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('7_5'); },

    drawMan: function(ctx, x, y, color) {
        const headRadius = 20;
        const bodyW = 14;
        const bodyH = 50;
        const legH = 45;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - legH - bodyH - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - bodyW/2, y - legH - bodyH, bodyW, bodyH);
        // Bras (position de la main)
        ctx.fillRect(x - bodyW * 1.5, y - legH - bodyH + 10, bodyW * 3, 6);
        ctx.fillRect(x - bodyW * 0.8, y - legH, 6, legH);
        ctx.fillRect(x + bodyW * 0.2, y - legH, 6, legH);
        ctx.restore();
    },

    drawCabin: function(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
        ctx.fill(); ctx.stroke();
        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.cycleTime += dt;
        this.phaseTimer += dt;

        const halfWidth = width / 2;
        const cx = width / 2;
        const cy = height / 2;

        // Accélération continue (synchronisée avec l'étape 2)
        this.starSpeed += 20 * dt; 
        this.starOffset += this.starSpeed * dt; 

        // ZONE GAUCHE (TERRE)
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, halfWidth, height);
        
        // Sol courbe (moins épais)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, cy + this.cabinH / 2 + 10);
        ctx.quadraticCurveTo(halfWidth / 2, cy + this.cabinH / 2 - 5, halfWidth, cy + this.cabinH / 2 + 10);
        ctx.lineTo(halfWidth, height);
        ctx.lineTo(0, height);
        ctx.fill();
        
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(0, cy + this.cabinH / 2 + 10);
        ctx.quadraticCurveTo(halfWidth / 2, cy + this.cabinH / 2 - 5, halfWidth, cy + this.cabinH / 2 + 10);
        ctx.stroke();
        ctx.restore();

        // ZONE DROITE (ESPACE)
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); 
            ctx.arc(halfWidth + star.x * halfWidth, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });

        this.movingStars.forEach(star => {
            let y = (star.y * height + this.starOffset) % height;
            if (y < 0) y += height;
            
            // L'étoile démarre en point et s'étire
            const trailLength = Math.max(2, this.starSpeed * 0.2);
            
            ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
            ctx.lineWidth = star.size * 0.7;
            ctx.beginPath(); 
            ctx.moveTo(halfWidth + star.x * halfWidth, y); 
            ctx.lineTo(halfWidth + star.x * halfWidth, y - trailLength); 
            ctx.stroke();
        });
        ctx.restore();

        // LOGIQUE
        if (this.phase === 0) {
            if (this.phaseTimer > 10) {
                this.phase = 1;
                this.phaseTimer = 0;
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
        } else if (this.phase === 1) {
            this.objectDropped = true;
            this.phase = 2;
            this.phaseTimer = 0;
        } else if (this.phase === 2) {
            this.objY += 60 * dt;
            
            if (this.objY >= this.cabinH / 2 - 15) {
                this.objY = this.cabinH / 2 - 15;
                this.phase = 3;
                this.phaseTimer = 0;
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
        } else if (this.phase === 3) {
            if (this.phaseTimer > 10) {
                this.reset();
            }
        }

        // DESSIN DES CABINES
        const leftX = width * 0.25;
        const rightX = width * 0.75;

        // Cabine gauche
        this.drawCabin(ctx, leftX, cy, this.cabinW, this.cabinH);
        // Correction : y = cy + cabinH/2 pour poser les pieds sur le sol
        this.drawMan(ctx, leftX, cy + this.cabinH / 2, '#94a3b8'); 

        if (this.objectDropped) {
            ctx.fillStyle = '#f59e0b';
            // L'objet tombe depuis la main (x, y - 70)
            const objScreenX = leftX;
            ctx.fillRect(objScreenX - this.objSize/2, cy + this.objY - this.objSize/2, this.objSize, this.objSize);
        }

        // Cabine droite
        this.drawCabin(ctx, rightX, cy, this.cabinW, this.cabinH);
        // Correction : y = cy + cabinH/2 pour poser les pieds sur le sol
        this.drawMan(ctx, rightX, cy + this.cabinH / 2, '#94a3b8'); 

        if (this.objectDropped) {
            ctx.fillStyle = '#f59e0b';
            const objScreenX = rightX;
            ctx.fillRect(objScreenX - this.objSize/2, cy + this.objY - this.objSize/2, this.objSize, this.objSize);
        }

        // TEXTES
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Sur Terre", leftX, cy - this.cabinH/2 - 20);
        
        // Compteur d'accélération fictif (de 5 à 15 m/s²)
        const accel = Math.min(15, 5 + this.cycleTime * 0.3).toFixed(1);
        ctx.fillText(`Dans l'espace (accélération : ${accel} m/s²)`, rightX, cy - this.cabinH/2 - 20);

        if (this.phase === 3) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText("Gravité  =  Accélération", cx, height - 60);
        }
        ctx.restore();
    },

    destroy: function() {}
};