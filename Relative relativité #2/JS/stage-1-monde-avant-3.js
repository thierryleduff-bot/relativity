// =====================================================================
// CHAPITRE 1 — LE MONDE D'AVANT (ÉTAPE 4/4)
// ---------------------------------------------------------------------
// Explication des deux relativités (Restreinte et Générale).
// =====================================================================

window.Stages['1_3'] = {
    time: 0,
    stars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Deux Relativités";
        if (numberEl) numberEl.textContent = "CHAPITRE 1 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. La Relativité Restreinte et la Relativité Générale</strong></p>
                
                <p style="margin-top: 15px;"><strong>Qu'est-ce qu'un référentiel ?</strong><br>
                C'est le point de vue depuis lequel on observe. Un train qui roule, la Terre qui tourne, une fusée qui accélère.</p>
                
                <p style="margin-top: 15px;"><strong>1. La Relativité Restreinte (1905)</strong><br>
                Elle a été écrite par Einstein, mais elle était déjà quasiment prête avant lui. Maxwell, Lorentz, Poincaré et Minkowski (qui en a donné la forme géométrique en 1908, après les articles d'Einstein) en avaient posé les bases.<br>
                Elle s'applique uniquement aux <strong>référentiels inertiels</strong> (vitesse constante, sans accélération ni gravité).</p>
                
                <p style="margin-top: 15px;"><strong>2. La Relativité Générale (1915)</strong><br>
                Elle généralise la première à <strong>tous les référentiels</strong>, y compris ceux qui accélèrent ou qui subissent la gravité. Einstein y explique que la gravité n'est pas une force, mais une <strong>géométrie</strong> : la masse courbe l'espace et le temps.</p>
                
                <p style="color: #f59e0b; font-weight: 600; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    En résumé : la Restreinte, c'est le cas particulier (sans gravité). La Générale, c'est la théorie complète.
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
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 4; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(2); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('1_2'); },

    drawBlock: function(ctx, x, y, w, h, title, color, items) {
        ctx.save();
        
        // Ombre portée
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, w, h, 12);
        ctx.fill();

        // Fond du bloc
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.fill();
        ctx.stroke();

        // Titre
        ctx.fillStyle = color;
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + w/2, y + 30);

        // Liste des items
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#cbd5e1';
        items.forEach((item, index) => {
            const itemY = y + 60 + index * 25;
            ctx.fillText("• " + item, x + 20, itemY);
        });

        ctx.restore();
    },

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

        const cx = width / 2;
        const cy = height / 2;
        const boxW = width * 0.35;
        const boxH = 200;

        // Bloc de gauche (Relativité Restreinte)
        this.drawBlock(
            ctx, 
            cx - boxW - 50, 
            cy - boxH/2, 
            boxW, 
            boxH, 
            "Relativité Restreinte (1905)", 
            '#06b6d4',
            ["Référentiels inertiels", "Vitesse constante", "Pas de gravité"]
        );

        // Bloc de droite (Relativité Générale)
        this.drawBlock(
            ctx, 
            cx + 50, 
            cy - boxH/2, 
            boxW, 
            boxH, 
            "Relativité Générale (1915)", 
            '#f59e0b',
            ["Tous les référentiels", "Accélérations", "Gravité = Géométrie"]
        );

        // Flèche/Implication au centre
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("⇒", cx, cy);
        ctx.restore();

        // Texte de conclusion en bas
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La Générale englobe la Restreinte.", cx, height - 60);
        ctx.restore();
    },

    destroy: function() {}
};