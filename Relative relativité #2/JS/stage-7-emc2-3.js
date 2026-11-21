// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 3/6)
// ---------------------------------------------------------------------
// L'énigme. La masse cache une énergie colossale.
// =====================================================================

window.Stages['7_2'] = {
    time: 0,
    stars: [],
    step1Progress: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "E = mc²";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. L'énigme</strong></p>
                <p>En 1905, Einstein affirme qu'une masse minuscule contient une énergie gigantesque.</p>
                <p>Comment peut-il savoir une chose pareille ?</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.step1Progress = 0;
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
        this.step1Progress = 0;
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('7_3'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('7_1'); },

    formatNumber: function(num, decimals = 0) {
        return num.toLocaleString('fr-FR', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals
        });
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
        const centerY = height / 2;

        // Animation de progression (pour le chiffre)
        if (this.step1Progress < 1) {
            this.step1Progress += 0.4 * dt;
            if (this.step1Progress > 1) this.step1Progress = 1;
        }

        // Dessin du carré de sucre
        const size = 60;
        ctx.save();
        ctx.translate(centerX - 120, centerY - 20);
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-size / 2, -size / 2, size, size, 8);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("🧊", 0, 2);
        ctx.restore();

        // Valeur de l'énergie
        const sugarEnergy = 539.2;
        const currentDisplay = sugarEnergy * this.step1Progress;

        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("=  " + this.formatNumber(currentDisplay, 1) + " TJ", centerX + 80, centerY - 20);
        ctx.restore();

        // Textes explicatifs
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("539 Terajoules d'énergie cachée dans 6g de sucre", centerX, centerY + 80);
        
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText("Comment Einstein a-t-il pu découvrir une chose pareille ?", centerX, centerY + 120);
        ctx.restore();
    },

    destroy: function() {}
};