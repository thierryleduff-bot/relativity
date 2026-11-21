// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 4/7)
// ---------------------------------------------------------------------
// La conclusion : le temps ralentit. Explication mathématique pas à pas.
// =====================================================================

window.Stages['3_3'] = {
    time: 0,
    stars: [],
    
    step: 0, // 0: vide, 1: lettres, 2: chiffres, 3: quai, 4: train + texte
    fadeAlpha: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "Le temps ralentit";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. La conclusion</strong></p>
                <p>Le trajet du photon est plus long dans le wagon en mouvement.</p>
                <p>Pourtant, la vitesse de la lumière est la même (postulat).</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Donc le temps doit ralentir.</p>
                <p style="margin-top: 15px;">Suivez les étapes pour comprendre la logique mathématique.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-next-math" class="step-btn" style="width:100%; height:40px; background: #f59e0b; color: #0b0f19; font-weight: bold;">
                        Étape suivante
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-next-math');
            if (btn) {
                btn.onclick = () => {
                    if (this.step < 4) {
                        this.step++;
                        this.fadeAlpha = 0; // Reset du fade pour le nouvel élément
                        
                        if (this.step === 4) {
                            btn.disabled = true;
                            btn.style.opacity = 0.5;
                            btn.style.cursor = 'not-allowed';
                            btn.textContent = "Terminé";
                        }
                    }
                };
            }
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
        this.step = 0;
        this.fadeAlpha = 0;
        
        const btn = document.getElementById('btn-next-math');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.textContent = "Étape suivante";
        }
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('3_4'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('3_2'); },

    drawFormula: function(ctx, x, y, text, color, fontSize = 32, isMono = true) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillStyle = color;
        ctx.font = `${isMono ? 'bold' : 'italic'} ${fontSize}px ${isMono ? 'monospace' : 'sans-serif'}`;
        ctx.fillText(text, x, y);
        
        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Gestion du fade in
        if (this.fadeAlpha < 1 && this.step > 0) {
            this.fadeAlpha += dt * 2; // Vitesse du fade
            if (this.fadeAlpha > 1) this.fadeAlpha = 1;
        }

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.5})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        
        // Position des colonnes du bas
        const leftColX = width * 0.25;
        const rightColX = width * 0.75;

        // 1. Lignes de séparation
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        
        // Ligne horizontale séparant le haut du bas
        ctx.beginPath();
        ctx.moveTo(40, 280);
        ctx.lineTo(width - 40, 280);
        ctx.stroke();

        // Ligne verticale séparant les deux colonnes du bas
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, 300);
        ctx.lineTo(cx, height - 120);
        ctx.stroke();
        ctx.restore();

        // 2. Titre principal
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La courbure du temps, juste une histoire de maths.", cx, 50);
        ctx.restore();

        // 3. Formules du haut (centrées)
        const topY = 130;
        
        if (this.step >= 1) {
            ctx.globalAlpha = this.step === 1 ? this.fadeAlpha : 1;
            this.drawFormula(ctx, cx, topY, "v = d / t", '#f8fafc', 38, false);
        }

        if (this.step >= 2) {
            ctx.globalAlpha = this.step === 2 ? this.fadeAlpha : 1;
            // Couleur ambre pour la formule de référence (la lumière)
            this.drawFormula(ctx, cx, topY + 60, "3 = 6 / 2", '#f59e0b', 36);
        }
        ctx.globalAlpha = 1;

        // 4. Titres du bas
        const bottomY = cy + 80;

        if (this.step >= 3) {
            ctx.save();
            ctx.globalAlpha = this.step === 3 ? this.fadeAlpha : 1;
            // CYAN pour le quai (au repos)
            ctx.fillStyle = '#06b6d4'; 
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Sur le quai", leftColX, bottomY - 40);
            ctx.font = 'italic 20px sans-serif';
            ctx.fillStyle = '#67e8f9';
            ctx.fillText("(ou train à l'arrêt)", leftColX, bottomY);
            ctx.restore();
        }

        if (this.step >= 4) {
            ctx.save();
            ctx.globalAlpha = this.fadeAlpha;
            // VERT pour le train (en mouvement)
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Dans le train", rightColX, bottomY - 40);
            ctx.font = 'italic 20px sans-serif';
            ctx.fillStyle = '#86efac';
            ctx.fillText("vu du quai", rightColX, bottomY);
            ctx.restore();
        }
        ctx.globalAlpha = 1;

        // 5. Formules du bas
        const formulaBottomY = bottomY + 80;

        if (this.step >= 3) {
            ctx.globalAlpha = this.step === 3 ? this.fadeAlpha : 1;
            this.drawFormula(ctx, leftColX, formulaBottomY, "v(3) = d(6) / t(2)", '#06b6d4', 32);
        }

        if (this.step >= 4) {
            ctx.globalAlpha = this.fadeAlpha;
            this.drawFormula(ctx, rightColX, formulaBottomY, "v(3) = d(9) / t(3)", '#22c55e', 32);
        }
        ctx.globalAlpha = 1;

        // 6. Commentaire en bas
        if (this.step >= 4) {
            ctx.save();
            ctx.globalAlpha = this.fadeAlpha;
            
            const textY = height - 70;
            const textW = 800;
            const textH = 70;
            
            // Fond stylé
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(cx - textW/2, textY - textH/2, textW, textH, 10);
            ctx.fill();
            ctx.stroke();

            // Texte
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'italic 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("Puisque le postulat est 'la vitesse de la lumière est absolue',", cx, textY - 12);
            ctx.fillText("si la distance augmente, alors le temps augmente sa durée (ralentit par rapport au quai).", cx, textY + 15);
            
            ctx.restore();
        }
    },

    destroy: function() {}
};