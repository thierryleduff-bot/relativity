// =====================================================================
// CHAPITRE 2 — LE MYSTÈRE DE LA LUMIÈRE (ÉTAPE 2/4)
// ---------------------------------------------------------------------
// Les ondes. Quand ça se fige, on dessine les 11 franges (bâtons jaunes)
// dans l'écran aux positions exactes validées.
// =====================================================================

window.Stages['2_1'] = {
    time: 0,
    stars: [],
    
    isFrozen: false,

    screenY: 0,
    screenW: 0,
    screenH: 0,
    src1X: 0,
    src2X: 0,
    srcY: 0,
    
    waveSpeed: 60, 
    maxRadius: 0,

    // Positions validées (11 barres, la 12ème est abandonnée)
    fringePositions: [0.176, 0.218, 0.274, 0.342, 0.414, 0.502, 0.588, 0.656, 0.720, 0.763, 0.825],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Les Franges d'Interférence";
        if (numberEl) numberEl.textContent = "CHAPITRE 2 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. Qu'est-ce qu'une frange d'interférence ?</strong></p>
                <p>La lumière est une <strong>onde</strong>. Quand deux ondes se rencontrent <strong>en un point</strong>, leurs amplitudes s'additionnent.</p>
                <p>- Si deux <strong>crêtes</strong> se rencontrent → <strong>ligne claire</strong>.</p>
                <p>- Si une <strong>crête</strong> rencontre un <strong>creux</strong> → <strong>ligne sombre</strong>.</p>
                <p>Le résultat est une série de <strong>franges</strong>.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Si les ondes arrivent en même temps → franges stables.<br>Si l'une arrive en retard → franges décalées.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.isFrozen = false;
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
        this.isFrozen = false;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 4; },

    nextStep: function() {
        if (window.Engine) window.Engine.loadStage('2_2');
    },
    prevStep: function() {
        if (window.Engine) window.Engine.loadStage(2);
    },

    draw: function(ctx, width, height, dt) {
        if (this.screenW === 0) {
            this.screenW = width * 0.8;
            this.screenH = 60;
            this.screenY = height * 0.15;
            
            this.src1X = 0; 
            this.src2X = width;
            this.srcY = height; 
            
            const dx = width / 2;
            const dy = height - (this.screenY + this.screenH / 2);
            this.maxRadius = Math.sqrt(dx * dx + dy * dy);
        }

        if (!this.isFrozen) {
            this.time += dt;
        }

        // Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const radius = this.time * this.waveSpeed;
        const lambda = 80; 

        // 2. DESSIN DES ONDES
        ctx.save();
        ctx.lineWidth = 1;
        
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        for (let i = 0; i < 6; i++) {
            const r = radius - i * lambda;
            if (r > 0) { ctx.beginPath(); ctx.arc(this.src1X, this.srcY, r, 0, Math.PI * 2); ctx.stroke(); }
        }
        
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        for (let i = 0; i < 6; i++) {
            const r = radius - i * lambda;
            if (r > 0) { ctx.beginPath(); ctx.arc(this.src2X, this.srcY, r, 0, Math.PI * 2); ctx.stroke(); }
        }
        ctx.restore();

        // 3. L'ÉCRAN (fond)
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(width/2 - this.screenW/2, this.screenY - this.screenH/2, this.screenW, this.screenH, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 4. DESSIN DES FRANGES (si figé)
        if (this.isFrozen) {
            ctx.save();
            ctx.fillStyle = '#fde047';
            
            const barWidth = 3;
            const barHeight = this.screenH - 10;
            const barY = this.screenY - barHeight / 2;
            const screenLeft = width / 2 - this.screenW / 2;

            this.fringePositions.forEach(pos => {
                const xPos = screenLeft + (pos * this.screenW);
                ctx.beginPath();
                ctx.rect(xPos - barWidth / 2, barY, barWidth, barHeight);
                ctx.fill();
            });
            
            ctx.restore();
        }

        // 5. CONDITION D'ARRÊT
        if (!this.isFrozen && radius >= this.maxRadius) {
            this.isFrozen = true;
        }
    },

    destroy: function() {}
};