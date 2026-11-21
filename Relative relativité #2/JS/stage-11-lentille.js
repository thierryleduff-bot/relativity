// =====================================================================
// CHAPITRE 11 — LA LENTILLE GRAVITATIONNELLE (ÉTAPE 1/3)
// ---------------------------------------------------------------------
// Principe optique : Lentille en verre (haut) vs Lentille opaque (bas).
// =====================================================================

window.Stages[11] = {
    time: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "La Lentille";
        if (numberEl) numberEl.textContent = "CHAPITRE 11 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. Le principe de la lentille</strong></p>
                <p>Une lentille en verre courbe les rayons lumineux. Ils convergent vers un point : la <strong>focale</strong>.</p>
                <p>Mais si on rend la lentille <strong>opaque</strong> (comme une masse), la lumière ne peut plus la traverser. Les rayons s'arrêtent.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Comment voir ce qui se cache derrière un objet opaque ?</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }
    },

    reset: function() { this.time = 0; },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 3; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('11_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('10'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        const midY = height / 2;
        
        // Séparateur horizontal
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(width, midY);
        ctx.stroke();
        
        const lensX = width / 2;
        const lensRx = 20;  // rayon horizontal (largeur/2)
        const lensRy = 80;  // rayon vertical (hauteur/2)
        
        // --- HAUT : Lentille en verre ---
        const topY = height / 4;
        
        // 1. On dessine d'abord les rayons (ils iront jusqu'au centre de la lentille)
        for (let i = -2; i <= 2; i++) {
            const y = topY + i * 30;
            
            // Rayon incident (de gauche jusqu'au centre de la lentille)
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(lensX, y);
            ctx.stroke();
            
            // Rayon réfracté (part du centre de la lentille vers la focale)
            const focalX = lensX + 200;
            ctx.beginPath();
            ctx.moveTo(lensX, y);
            ctx.lineTo(focalX, topY);
            ctx.stroke();
        }
        
        // Point focal
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(lensX + 200, topY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 2. On dessine la lentille PAR DESSUS les rayons
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(lensX, topY, lensRx, lensRy, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Lentille en verre (transparente)", lensX, topY - 100);
        
        // --- BAS : Lentille opaque ---
        const bottomY = 3 * height / 4;
        
        // 1. On dessine d'abord les rayons (ils iront jusqu'au centre)
        for (let i = -2; i <= 2; i++) {
            const y = bottomY + i * 30;
            
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(lensX, y);
            ctx.stroke();
        }
        
        // 2. On dessine la lentille PAR DESSUS (elle cache la partie centrale des rayons)
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(lensX, bottomY, lensRx, lensRy, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        
        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Lentille opaque (masse)", lensX, bottomY + 100);
        ctx.fillText("La lumière ne passe pas.", lensX, bottomY + 120);
        
        ctx.restore();
    },
    destroy: function() {}
};