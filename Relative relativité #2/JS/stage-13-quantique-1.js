// =====================================================================
// CHAPITRE 13 — LA MÉCANIQUE QUANTIQUE (ÉTAPE 2/2)
// ---------------------------------------------------------------------
// L'incompatibilité : l'infiniment grand vs l'infiniment petit.
// =====================================================================

window.Stages['13_1'] = {
    time: 0,
    stars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "QUANTIQUE";
            domainBadgeEl.style.borderColor = "var(--accent-q)";
            domainBadgeEl.style.color = "var(--accent-q)";
        }
        if (titleEl) titleEl.textContent = "Deux mondes incompatibles";
        if (numberEl) numberEl.textContent = "CHAPITRE 13 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. Deux jeux de règles</strong></p>
                <p>Les règles qui régissent l'infiniment grand ne s'appliquent pas à l'infiniment petit.</p>
                <p>En Relativité, la masse courbe l'espace. Mais si on essaie d'appliquer cette idée à un atome, ça ne marche plus.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Un atome ne se "courbe" pas. Il résiste et obéit à d'autres lois, celles des probabilités.</p>
                <p>Ce sont deux mondes, avec deux jeux de règles totalement différents. Et on ne sait pas encore comment les faire cohabiter.</p>
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
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(14); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(13); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.3})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const midX = width / 2;
        const midY = height / 2;

        // Ligne de séparation
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(midX, 80);
        ctx.lineTo(midX, height - 80);
        ctx.stroke();
        ctx.restore();

        // =========================================================
        // GAUCHE : INFINIMENT GRAND (RELATIVITÉ)
        // =========================================================
        const cxG = midX / 2;
        const cyG = midY + 50;

        // Titre
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("On compresse l'espace.", cxG, 120);
        ctx.fillText("Il se courbe.", cxG, 150);
        ctx.restore();

        // Grille qui se courbe
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        const amplitude = 40;
        const effectRadius = 150;

        for (let x = 0; x < midX; x += gridSize) {
            ctx.beginPath();
            for (let y = 80; y < height - 80; y += 10) {
                const dist = Math.sqrt(Math.pow(x - cxG, 2) + Math.pow(y - cyG, 2));
                let offsetY = 0;
                if (dist < effectRadius) {
                    const influence = Math.pow(1 - (dist / effectRadius), 2);
                    offsetY = influence * amplitude;
                }
                if (y === 80) ctx.moveTo(x, y + offsetY);
                else ctx.lineTo(x, y + offsetY);
            }
            ctx.stroke();
        }
        for (let y = 80; y < height - 80; y += gridSize) {
            ctx.beginPath();
            for (let x = 0; x < midX; x += 10) {
                const dist = Math.sqrt(Math.pow(x - cxG, 2) + Math.pow(y - cyG, 2));
                let offsetY = 0;
                if (dist < effectRadius) {
                    const influence = Math.pow(1 - (dist / effectRadius), 2);
                    offsetY = influence * amplitude;
                }
                if (x === 0) ctx.moveTo(x, y + offsetY);
                else ctx.lineTo(x, y + offsetY);
            }
            ctx.stroke();
        }
        ctx.restore();

        // La masse
        ctx.save();
        const grad = ctx.createRadialGradient(cxG - 10, cyG - 10, 5, cxG, cyG, 30);
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cxG, cyG, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // =========================================================
        // DROITE : INFINIMENT PETIT (QUANTIQUE)
        // =========================================================
        const cxD = midX + midX / 2;
        const cyD = midY + 50;

        // Titre
        ctx.save();
        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("On compresse un atome.", cxD, 120);
        ctx.fillText("Rien ne se courbe.", cxD, 150);
        ctx.restore();

        // L'atome
        ctx.save();
        // Noyau
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cxD, cyD, 12, 0, Math.PI * 2);
        ctx.fill();

        // Orbite / Électrons (qui continuent de tourner)
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cxD, cyD, 50, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
            const angle = this.time * 2 + (i * Math.PI * 2 / 3);
            const ex = cxD + Math.cos(angle) * 50;
            const ey = cyD + Math.sin(angle) * 50;
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Les flèches de compression
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.fillStyle = '#94a3b8';
        ctx.lineWidth = 3;
        
        const arrowDist = 80 + Math.sin(this.time * 2) * 10; // Les flèches bougent
        
        // Flèche gauche
        ctx.beginPath();
        ctx.moveTo(cxD - arrowDist - 30, cyD);
        ctx.lineTo(cxD - arrowDist, cyD);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cxD - arrowDist, cyD);
        ctx.lineTo(cxD - arrowDist - 10, cyD - 6);
        ctx.lineTo(cxD - arrowDist - 10, cyD + 6);
        ctx.fill();

        // Flèche droite
        ctx.beginPath();
        ctx.moveTo(cxD + arrowDist + 30, cyD);
        ctx.lineTo(cxD + arrowDist, cyD);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cxD + arrowDist, cyD);
        ctx.lineTo(cxD + arrowDist + 10, cyD - 6);
        ctx.lineTo(cxD + arrowDist + 10, cyD + 6);
        ctx.fill();
        ctx.restore();

        // Texte de conclusion en bas
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Deux théories, deux échelles, deux logiques.", midX, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};