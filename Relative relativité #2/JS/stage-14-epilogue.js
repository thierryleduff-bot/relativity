// =====================================================================
// CHAPITRE 14 — ÉPILOGUE (ÉTAPE 1/2)
// ---------------------------------------------------------------------
// Synthèse : le triangle Espace - Temps - Énergie.
// =====================================================================

window.Stages[14] = {
    time: 0,
    stars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "ÉPILOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Ce qu'on a appris";
        if (numberEl) numberEl.textContent = "CHAPITRE 14 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Épilogue : ce qu'on a appris</strong></p>
                <p>Ce projet avait un but : expliquer la relativité sans la rendre compliquée. Montrer ce qu'elle est, ce qu'elle implique, et pourquoi elle tient debout.</p>
                <p style="margin-top: 15px;">S'il fallait un seul schéma pour résumer tout ce qui a été présenter ici, ça serait un triangle.</p>
                <p>L'espace et le temps ne sont pas des décors fixes. La constante C est une limite absolue. La masse courbe l'espace-temps. La masse et l'énergie sont équivalentes.</p>
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

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('14_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('13_1'); }, 

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

        // Triangle
        const topX = cx;
        const topY = cy - 150;
        const leftX = cx - 200;
        const leftY = cy + 120;
        const rightX = cx + 200;
        const rightY = cy + 120;

        // Arêtes
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Sommets (Texte)
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 20px sans-serif';

        // ESPACE (Cyan)
        ctx.fillStyle = '#06b6d4';
        ctx.fillText("ESPACE", topX, topY - 30);

        // TEMPS (Ambre)
        ctx.fillStyle = '#f59e0b';
        ctx.fillText("TEMPS", leftX - 40, leftY + 30);

        // ÉNERGIE (Cyan)
        ctx.fillStyle = '#06b6d4';
        ctx.fillText("ÉNERGIE", rightX + 40, rightY + 30);
        ctx.restore();

        // Textes sur les arêtes
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'italic 14px sans-serif';
        ctx.fillStyle = '#94a3b8';

        // Arête Espace - Temps
        ctx.fillText("La masse courbe l'espace et le temps.", (topX + leftX) / 2 - 60, (topY + leftY) / 2 - 10);

        // Arête Espace - Énergie
        ctx.fillText("E = mc². Masse et énergie sont équivalentes.", (topX + rightX) / 2 + 60, (topY + rightY) / 2 - 10);

        // Arête Temps - Énergie
        ctx.fillText("L'énergie courbe le temps.", (leftX + rightX) / 2, leftY + 60);

        ctx.restore();
    },

    destroy: function() {}
};