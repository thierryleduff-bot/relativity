// =====================================================================
// CHAPITRE 4 — LA CONTRACTION DES LONGUEURS (ÉTAPE 1/3)
// ---------------------------------------------------------------------
// La fusée au repos sur son pas de tir (verticale).
// =====================================================================

window.Stages[4] = {
    time: 0,
    stars: [],
    canvas: null,

    L0: 240, // Représentation de 50m (longueur)
    H0: 48,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La fusée au repos";
        if (numberEl) numberEl.textContent = "CHAPITRE 4 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. La fusée au repos</strong></p>
                <p>Voici une fusée de 50 mètres de long sur son pas de tir.</p>
                <p>Pour l'instant, elle ne bouge pas. Tous les observateurs sont d'accord sur sa longueur.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
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

    reset: function() { this.time = 0; },
    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 3; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('4_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('3_3'); },

    // Dessin de la fusée (identique à l'étape 2, mais pivotée si isVertical = true)
    drawFusee: function(ctx, x, y, length, color, isVertical = false) {
        const halfL = length / 2;
        const halfH = this.H0 / 2;

        ctx.save();
        // On se place au centre de la fusée
        ctx.translate(x, y);
        // Si on veut la verticale, on tourne de -90° (le nez pointe vers le haut)
        if (isVertical) {
            ctx.rotate(-Math.PI / 2);
        }

        // À partir d'ici, le code est identique à l'étape 2, 
        // mais x et y valent 0, 0 par rapport au centre.
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(halfL, 0);
        ctx.quadraticCurveTo(halfL * 0.7, -halfH, halfL * 0.5, -halfH);
        ctx.lineTo(-halfL * 0.7, -halfH);
        ctx.quadraticCurveTo(-halfL, -halfH * 0.5, -halfL, 0);
        ctx.quadraticCurveTo(-halfL, halfH * 0.5, -halfL * 0.7, halfH);
        ctx.lineTo(halfL * 0.5, halfH);
        ctx.quadraticCurveTo(halfL * 0.7, halfH, halfL, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Ailerons
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-halfL * 0.7, -halfH);
        ctx.lineTo(-halfL * 0.7 - (length * 0.15), -halfH - (this.H0 * 0.4));
        ctx.lineTo(-halfL, 0);
        ctx.lineTo(-halfL * 0.7 - (length * 0.15), halfH + (this.H0 * 0.4));
        ctx.lineTo(-halfL * 0.7, halfH);
        ctx.fill();

        // Hublots
        ctx.fillStyle = `${color}88`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        const frontX = halfL * 0.6;
        const backX = -halfL * 0.2;
        const spanX = frontX - backX;
        
        for (let i = 0; i < 5; i++) {
            const wx = backX + (spanX / 4) * i;
            const winRadius = 6;
            ctx.beginPath();
            ctx.arc(wx, -halfH * 0.4, winRadius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Étoiles
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const groundY = height * 0.8;
        
        // On positionne le centre de la fusée pour que sa queue touche le sol (moins la place des ailerons)
        const baseY = groundY - (this.L0 / 2) - (this.H0 * 0.4) - 10; 

        // Pas de tir (sol)
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, groundY, width, height - groundY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(width, groundY); ctx.stroke();
        
        // Structure de lancement (mât)
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 6;
        ctx.beginPath(); 
        ctx.moveTo(cx + 60, groundY); 
        ctx.lineTo(cx + 60, groundY - this.L0 - 60); 
        ctx.stroke();
        
        // Bras de maintien
        ctx.lineWidth = 4;
        ctx.beginPath(); 
        ctx.moveTo(cx + 60, groundY - this.L0 * 0.3); 
        ctx.lineTo(cx + 30, groundY - this.L0 * 0.3); 
        ctx.stroke();
        ctx.beginPath(); 
        ctx.moveTo(cx + 60, groundY - this.L0 * 0.7); 
        ctx.lineTo(cx + 30, groundY - this.L0 * 0.7); 
        ctx.stroke();

        ctx.restore();

        // Fusée (on passe isVertical = true)
        this.drawFusee(ctx, cx, baseY, this.L0, '#06b6d4', true);

        // Mesure (règle)
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        const xMeasure = cx - 80;
        const topY = baseY - this.L0/2;
        const bottomY = baseY + this.L0/2;
        
        ctx.beginPath();
        ctx.moveTo(xMeasure, topY);
        ctx.lineTo(xMeasure, bottomY);
        // Tirets de mesure
        ctx.moveTo(xMeasure - 5, topY); ctx.lineTo(xMeasure + 5, topY);
        ctx.moveTo(xMeasure - 5, bottomY); ctx.lineTo(xMeasure + 5, bottomY);
        ctx.stroke();
        
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText("50 m (au repos)", xMeasure - 15, baseY);
        ctx.restore();

        // Message
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Fusée immobile sur son pas de tir — tout le monde est d'accord sur sa longueur.", cx, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};