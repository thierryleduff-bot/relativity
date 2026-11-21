// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 5/6)
// ---------------------------------------------------------------------
// La révélation. L'équation universelle.
// =====================================================================

window.Stages['7_4'] = {
    time: 0,
    stars: [],
    animProgress: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La révélation";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>5. La révélation</strong></p>
                <p>Si perdre de l'énergie fait perdre de la masse, alors <strong>masse et énergie sont liées</strong>.</p>
                <p>Einstein réarrange l'équation pour lui donner sa forme universelle, valable pour tout objet :</p>
                <p style="text-align: center; font-size: 1.3rem; color: #f59e0b; margin-top: 15px;"><strong>E = mc²</strong></p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.animProgress = 0;
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
        this.animProgress = 0;
    },

    getCurrentStep: function() { return 5; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('7_5'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('7_3'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        // Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const centerX = width / 2;
        const centerY = height / 2;

        // Animation
        if (this.animProgress < 1) {
            this.animProgress += 0.5 * dt;
            if (this.animProgress > 1) this.animProgress = 1;
        }

        ctx.save();
        ctx.textAlign = 'center';

        if (this.animProgress < 0.5) {
            // Étape intermédiaire
            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillText("Δm  =  L / c²", centerX, centerY - 40);
            
            ctx.fillStyle = '#94a3b8';
            ctx.font = '16px sans-serif';
            ctx.fillText("Masse perdue = Énergie perdue / c²", centerX, centerY + 20);
        } else {
            // Équation finale
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 48px sans-serif';
            ctx.fillText("E  =  m · c²", centerX, centerY - 40);

            const startY = centerY + 30;
            ctx.font = '18px sans-serif';

            ctx.fillStyle = '#38bdf8';
            ctx.fillText("E : Énergie totale", centerX, startY);

            ctx.fillStyle = '#f8fafc';
            ctx.fillText("m : Masse totale", centerX, startY + 35);

            ctx.fillStyle = '#10b981';
            ctx.fillText("c² : Vitesse de la lumière au carré", centerX, startY + 70);
        }

        ctx.restore();
    },

    destroy: function() {}
};