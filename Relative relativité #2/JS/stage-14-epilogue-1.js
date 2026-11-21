// =====================================================================
// CHAPITRE 14 — ÉPILOGUE (ÉTAPE 2/2)
// ---------------------------------------------------------------------
// L'ouverture : ce qu'on ne sait pas.
// =====================================================================

window.Stages['14_1'] = {
    time: 0,
    stars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "ÉPILOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Ce qu'on ne sait pas";
        if (numberEl) numberEl.textContent = "CHAPITRE 14 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Épilogue : ce qu'on ne sait pas</strong></p>
                <p>La relativité générale marche. Elle prédit les orbites, les trous noirs, le GPS. Mais au centre d'un trou noir, elle casse. Et elle ne parle pas le même langage que la physique quantique.</p>
                <p>On ne sait pas ce qu'est la matière noire (27 % de l'univers) ni l'énergie noire (68 %).</p>
                <p>On cherche toujours une théorie du tout.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">La physique n'est pas un dogme. C'est une aventure. Et elle n'est pas finie.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    reset: function() {
        this.time = 0;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 2; },
    nextStep: function() {}, // Fin du cours
    prevStep: function() { if (window.Engine) window.Engine.loadStage(14); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); 
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;

        // Texte sobre, centré
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText("La physique n'est pas un dogme.", cx, cy - 60);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText("C'est une aventure.", cx, cy - 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 20px sans-serif';
        ctx.fillText("Et elle n'est pas finie.", cx, cy + 30);

        ctx.restore();
    },

    destroy: function() {}
};