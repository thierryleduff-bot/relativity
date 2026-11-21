// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 4/6)
// ---------------------------------------------------------------------
// L'enquête. La lumière emporte de la masse.
// =====================================================================

window.Stages['7_3'] = {
    time: 0,
    stars: [],
    waves: [],
    bodyRadius: 50,
    minRadius: 30,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "L'enquête";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. L'enquête</strong></p>
                <p>Einstein observe un objet qui rayonne de la lumière.</p>
                <p>À chaque émission, de l'énergie (<em>L</em>) quitte le corps.</p>
                <p>Il découvre alors une chose étrange : en perdant de l'énergie, le corps perd aussi un peu de sa masse.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">La relation est : Δm = L / c²</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.waves = [];
        this.bodyRadius = 50;
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
        this.waves = [];
        this.bodyRadius = 50;
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('7_4'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('7_2'); },

    draw3DMetalSphere: function(ctx, x, y, radius) {
        if (radius <= 0) return;
        ctx.save();
        const gradient = ctx.createRadialGradient(
            x - radius * 0.35, y - radius * 0.35, radius * 0.05,
            x, y, radius
        );
        gradient.addColorStop(0, '#ffffff');  
        gradient.addColorStop(0.15, '#e2e8f0'); 
        gradient.addColorStop(0.55, '#64748b'); 
        gradient.addColorStop(0.85, '#334155'); 
        gradient.addColorStop(1, '#0f172a');    

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

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
        const centerY = height / 2 - 20;

        // Génération d'ondes
        if (Math.random() < 0.06) {
            this.waves.push({ r: this.bodyRadius, alpha: 1.0 });
        }

        // Mise à jour des ondes
        for (let i = this.waves.length - 1; i >= 0; i--) {
            let w = this.waves[i];
            w.r += 90 * dt;
            w.alpha -= 0.3 * dt;
            if (w.alpha <= 0) this.waves.splice(i, 1);
        }

        // Dessin des ondes
        this.waves.forEach(w => {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = Math.max(0, w.alpha);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, w.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        });

        // Diminution de la masse (rétrécissement de la sphère)
        if (this.bodyRadius > this.minRadius) {
            this.bodyRadius -= 0.4 * dt;
        } else {
            // On fait "respirer" la sphère pour ne pas qu'elle disparaisse
            this.bodyRadius = 50;
        }

        this.draw3DMetalSphere(ctx, centerX, centerY, this.bodyRadius);

        // Textes
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Émission de lumière  →  L'énergie (L) quitte le corps", centerX, height - 80);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText("En perdant de l'énergie, le corps perd aussi de la masse (Δm)", centerX, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};