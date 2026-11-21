// =====================================================================
// CHAPITRE 13 — LA MÉCANIQUE QUANTIQUE (ÉTAPE 1/2)
// ---------------------------------------------------------------------
// Le monde de l'infiniment petit. Les 3 atomes, les particules,
// et le bandeau défilant des fondateurs.
// =====================================================================

window.Stages[13] = {
    time: 0,
    stars: [],
    bannerOffset: 0,

    bannerNames: [
        "Max Planck", "Albert Einstein", "Niels Bohr", 
        "Louis de Broglie", "Werner Heisenberg", "Erwin Schrödinger", 
        "Max Born", "Paul Dirac", "Wolfgang Pauli", "Richard Feynman"
    ],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "QUANTIQUE";
            domainBadgeEl.style.borderColor = "var(--accent-q)";
            domainBadgeEl.style.color = "var(--accent-q)";
        }
        if (titleEl) titleEl.textContent = "Le monde de l'infiniment petit";
        if (numberEl) numberEl.textContent = "CHAPITRE 13 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. Qu'est-ce que la mécanique quantique ?</strong></p>
                <p>La mécanique quantique est la physique de l'infiniment petit : atomes, électrons, particules.</p>
                <p>Elle décrit un monde où les règles du quotidien ne s'appliquent plus. On ne peut pas prédire la position exacte d'une particule, seulement la probabilité de la trouver à un endroit donné.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">
                    L'image de l'électron tournant sagement autour du noyau est fausse.
                </p>
                <p style="margin-top: 15px;">
                    <strong>Les briques de la matière :</strong><br>
                    • Quarks : up, down, charm, strange, top, bottom.<br>
                    • Leptons : électron, muon, tau, et leurs neutrinos.<br>
                    • Un proton = 2 quarks up + 1 quark down, liés par des gluons.
                </p>
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
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.bannerOffset = 0;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('13_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('12_4'); },

    drawAtomPlanetary: function(ctx, cx, cy) {
        ctx.save();
        // Noyau
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Orbite
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.stroke();

        // Électron
        const angle = this.time * 2;
        const ex = cx + Math.cos(angle) * 35;
        const ey = cy + Math.sin(angle) * 35;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("FAUX", cx, cy - 60);
        ctx.restore();
    },

    drawAtomQuantum: function(ctx, cx, cy) {
        ctx.save();
        // Noyau
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Électron (probabilité)
        const tick = Math.floor(this.time * 10);
        const randomX = (Math.sin(tick * 13.5) * 0.5 + 0.5) * 80 - 40;
        const randomY = (Math.cos(tick * 7.3) * 0.5 + 0.5) * 80 - 40;
        const opacity = (Math.sin(tick) + 1) / 2;

        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.beginPath();
        ctx.arc(cx + randomX, cy + randomY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("RÉEL", cx, cy - 60);
        ctx.restore();
    },

    drawAtomCloud: function(ctx, cx, cy) {
        ctx.save();
        // Noyau
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fill();

        // Nuage
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 45);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("MODÈLE", cx, cy - 60);
        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.bannerOffset += 40 * dt;

        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.3})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2 - 50; 

        this.drawAtomPlanetary(ctx, cx - 200, cy);
        this.drawAtomQuantum(ctx, cx, cy);
        this.drawAtomCloud(ctx, cx + 200, cy);

        // Lignes de séparation
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 100, cy - 80); ctx.lineTo(cx - 100, cy + 80);
        ctx.moveTo(cx + 100, cy - 80); ctx.lineTo(cx + 100, cy + 80);
        ctx.stroke();
        ctx.restore();

        // Bandeau
        const bannerHeight = 40;
        const bannerY = height - bannerHeight - 20;
        
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, bannerY, width, bannerHeight);
        
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, bannerY);
        ctx.lineTo(width, bannerY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const textStr = this.bannerNames.join("  ●  ");
        const textWidth = ctx.measureText(textStr).width;
        let xOffset = width - (this.bannerOffset % (textWidth + width));
        
        ctx.fillText(textStr, xOffset, bannerY + bannerHeight / 2);
        ctx.fillText(textStr, xOffset + textWidth + 50, bannerY + bannerHeight / 2);

        ctx.restore();
    },

    destroy: function() {}
};