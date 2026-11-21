// =====================================================================
// CHAPITRE 6 — LES JUMEAUX (ÉTAPE UNIQUE)
// ---------------------------------------------------------------------
// Le voyage complet : décollage, virage, sortie de cadre, retour.
// =====================================================================

window.Stages[6] = {
    time: 0,
    stars: [],
    
    // Logique du voyage
    phase: 0, // 0: Attente, 1: Décollage, 2: Inclinaison, 3: Aller, 4: Hors cadre, 5: Retour, 6: Fin
    phaseTimer: 0,
    trainX: 0,
    trainY: 0,
    trainAngle: 0, 
    
    // Position de la Terre
    earthX: 150,
    earthY: 0, 
    earthRadius: 60, 
    
    // Paramètres du voyage
    baseSpeed: 120,
    startY: 0,
    targetY: 0,

    // Horloges
    earthClock: 0,
    shipClock: 0,
    rateEarth: 1.0,
    rateShip: 0.4, 
    clockSpeed: 8.0, 

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "Les Jumeaux";
        if (numberEl) numberEl.textContent = "CHAPITRE 6 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Le voyage des jumeaux</strong></p>
                <p>Paul reste sur Terre. Jean part dans une fusée à une vitesse proche de celle de la lumière.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Pendant l'aller, chacun voit l'horloge de l'autre ralentir. Au retour, la symétrie est brisée par le demi-tour.</p>
                <p>Lorsqu'ils comparent leurs horloges à la fin, Jean a moins vieilli que Paul.</p>
            `;
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
    },

    reset: function() {
        this.time = 0;
        this.phase = 0;
        this.phaseTimer = 0;
        
        this.earthX = 150;
        this.earthY = 0; 
        
        this.trainX = this.earthX + 30; 
        this.trainY = 0; 
        this.trainAngle = -Math.PI / 2; 
        
        this.earthClock = 0;
        this.shipClock = 0;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 1; }, 
    nextStep: function() {},
    prevStep: function() { if (window.Engine) window.Engine.loadStage('5_1'); },

    drawMan: function(ctx, x, y, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - 10, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - 2, y - 5, 4, 8);
        ctx.fillRect(x - 7, y - 3, 14, 2);
        ctx.fillRect(x - 4, y + 3, 2, 6);
        ctx.fillRect(x + 2, y + 3, 2, 6);
        ctx.restore();
    },

    drawClock: function(ctx, x, y, radius, angle, color, label, yearsText) {
        ctx.save();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.stroke();
        
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = i % 3 === 0 ? radius - 6 : radius - 3;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
            ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
            ctx.stroke();
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle - Math.PI / 2) * (radius * 0.7), y + Math.sin(angle - Math.PI / 2) * (radius * 0.7));
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = color;
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + radius + 20);
        
        if (yearsText !== undefined) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 16px monospace';
            ctx.fillText(yearsText, x, y + radius + 42);
        }
        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.phaseTimer += dt;

        // 1. Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        
        // Position Y de la Terre
        this.earthY = cy + 50;

        // Initialisation de la position Y de la fusée
        if (this.trainY === 0) {
            this.startY = this.earthY - this.earthRadius + 10;
            this.trainY = this.startY;
            this.targetY = cy - 150; // Altitude de croisière
        }

        // 2. Logique du voyage
        if (this.phase === 0) { // Attente
            if (this.phaseTimer > 1.5) {
                this.phase = 1;
                this.phaseTimer = 0;
            }
        } else if (this.phase === 1) { // Décollage vertical
            this.trainY -= 80 * dt;
            if (this.trainY < this.targetY) {
                this.phase = 2; // Inclinaison
                this.phaseTimer = 0;
            }
        } else if (this.phase === 2) { // Inclinaison progressive
            const t = this.phaseTimer;
            const duration = 1.2; // 1.2 secondes pour s'incliner
            
            if (t < duration) {
                const progress = t / duration;
                // On interpole l'angle de -PI/2 (haut) à 0 (droite)
                this.trainAngle = -Math.PI / 2 + (progress * Math.PI / 2);
                
                // On avance un peu pendant l'inclinaison
                this.trainX += this.baseSpeed * progress * dt;
                // On ajuste Y pour que ce soit un arc
                this.trainY = this.targetY + Math.sin(progress * Math.PI / 2) * 20;
            } else {
                this.phase = 3; // Aller horizontal
                this.phaseTimer = 0;
                this.trainAngle = 0;
                this.trainY = this.targetY + 20;
            }
        } else if (this.phase === 3) { // Aller horizontal
            this.trainX += this.baseSpeed * dt;
            this.earthClock += this.rateEarth * this.clockSpeed * dt;
            this.shipClock += this.rateShip * this.clockSpeed * dt;

            // La fusée sort complètement de l'écran
            if (this.trainX > width + 100) {
                this.phase = 4; // Hors cadre
                this.phaseTimer = 0;
            }
        } else if (this.phase === 4) { // Hors cadre
            // Les compteurs continuent de tourner
            this.earthClock += this.rateEarth * this.clockSpeed * dt;
            this.shipClock += this.rateShip * this.clockSpeed * dt;

            if (this.phaseTimer > 2.0) { // 2 secondes de "mystère"
                this.phase = 5; // Retour
                this.phaseTimer = 0;
                // Téléportation hors cadre à droite
                this.trainX = width + 100; 
                this.trainY = this.targetY + 20;
                this.trainAngle = Math.PI; // Pointe vers la gauche
            }
        } else if (this.phase === 5) { // Retour
            this.trainX -= this.baseSpeed * dt;
            this.earthClock += this.rateEarth * this.clockSpeed * dt;
            this.shipClock += this.rateShip * this.clockSpeed * dt;

            // Elle repasse au-dessus de la Terre
            if (this.trainX < this.earthX + 50) {
                this.phase = 6; // Fin
                this.phaseTimer = 0;
            }
        } else if (this.phase === 6) { // Fin (sortie par la gauche)
            this.trainX -= this.baseSpeed * dt; 
        }

        // 3. Dessin de la Terre
        ctx.save();
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath(); ctx.arc(this.earthX, this.earthY, this.earthRadius, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        
        // Le bonhomme (Paul) sur le pôle Nord
        this.drawMan(ctx, this.earthX, this.earthY - this.earthRadius + 5, '#38bdf8'); 

        // 4. Dessin de la fusée
        if (this.trainX > -150 && this.trainX < width + 150) {
            this.drawFusee(ctx, this.trainX, this.trainY, this.trainAngle);
        }

        // 5. Horloges
        const earthYears = Math.floor(this.earthClock / (Math.PI * 2));
        const shipYears = Math.floor(this.shipClock / (Math.PI * 2));
        
        const earthAngle = this.earthClock % (Math.PI * 2);
        const shipAngle = this.shipClock % (Math.PI * 2);

        this.drawClock(ctx, cx - 80, height - 120, 30, earthAngle, '#38bdf8', "Paul", `${earthYears} ans`);
        this.drawClock(ctx, cx + 80, height - 120, 30, shipAngle, '#22c55e', "Jean", `${shipYears} ans`);

        // 6. Texte d'explication
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        
        if (this.phase === 1 || this.phase === 2) {
            ctx.fillText("Décollage.", cx, 50);
        } else if (this.phase === 3) {
            ctx.fillText("Jean s'éloigne. Chacun voit le temps de l'autre ralentir.", cx, 50);
        } else if (this.phase === 4) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillText("Jean fait demi-tour hors de notre champ de vision.", cx, 50);
        } else if (this.phase === 5) {
            ctx.fillText("Jean revient vers la Terre.", cx, 50);
        } else if (this.phase === 6) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText("Retrouvailles : Jean a moins vieilli que Paul.", cx, 50);
        }
        ctx.restore();
    },

    drawFusee: function(ctx, x, y, angle) {
        ctx.save();
        
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(0.9, 0.9);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.quadraticCurveTo(30, -20, 0, -20);
        ctx.lineTo(-40, -20);
        ctx.lineTo(-40, 20);
        ctx.lineTo(0, 20);
        ctx.quadraticCurveTo(30, 20, 60, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Flamme (seulement quand elle avance)
        if (this.phase === 1 || this.phase === 2 || this.phase === 3 || this.phase === 5) {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(-40, -10);
            ctx.lineTo(-70, 0);
            ctx.lineTo(-40, 10);
            ctx.fill();
        }

        // Hublot
        ctx.fillStyle = '#06b6d488';
        ctx.beginPath(); 
        ctx.arc(10, 0, 6, 0, Math.PI * 2); 
        ctx.fill();
        ctx.restore();
    },

    destroy: function() {}
};