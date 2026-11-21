// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 2/6)
// ---------------------------------------------------------------------
// Lorentz : La démonstration de la limite absolue.
// =====================================================================

window.Stages['7_1'] = {
    time: 0,
    stars: [],
    step: 0, 
    fadeTimer: 0,
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La limite absolue";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>La limite absolue</strong></p>
                <p>Le facteur de Lorentz nous montre que la vitesse de la lumière est une limite infranchissable.</p>
                
                
                <p id="conclusion-text" style="display: none; color: #ef4444; font-weight: 600; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    Cela n'a aucun sens mathématique !<br><br>
                    Aucune vitesse ne peut donc égaler C.<br><br>
                    Et une vitesse >c donnerait une racine carrée négative, ce qui n'aurait pas plus de sens.
                </p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-next-math" class="step-btn" style="width:100%; height:40px; background: #38bdf8; color: #0b0f19; font-weight: bold;">
                        Étape suivante
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-next-math');
            if (btn) {
                btn.onclick = () => {
                    if (this.step < 4) {
                        this.step++;
                        this.fadeTimer = 0;
                        
                        if (this.step === 4) {
                            btn.disabled = true;
                            btn.style.opacity = 0.5;
                            btn.style.cursor = 'not-allowed';
                            btn.textContent = "Démonstration terminée";
                            
                            const conclusion = document.getElementById('conclusion-text');
                            if (conclusion) conclusion.style.display = 'block';
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
                alpha: Math.random() * 0.3 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.step = 0;
        this.fadeTimer = 0;
        
        const btn = document.getElementById('btn-next-math');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.textContent = "Étape suivante";
        }

        const conclusion = document.getElementById('conclusion-text');
        if (conclusion) conclusion.style.display = 'none';
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('7_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(7); },

    drawFormula: function(ctx, cx, cy, state) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(0.75, 0.75); 
        ctx.textBaseline = 'middle';

        const colorNormal = '#f8fafc';
        const colorChange = '#ef4444'; 

        // 1. Gamma et =
        ctx.fillStyle = colorNormal;
        ctx.strokeStyle = colorNormal;
        ctx.textAlign = 'center';
        ctx.font = 'italic 46px "Georgia", "Times New Roman", serif';
        ctx.fillText("γ", -120, 0);
        ctx.font = '40px "Georgia", "Times New Roman", serif';
        ctx.fillText("=", -60, 0);

        // 2. Barre de fraction
        const fracStartX = -20;
        const fracEndX = 160;
        const fracCenterX = (fracStartX + fracEndX) / 2;
        const mainBarY = -15;

        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(fracStartX, mainBarY);
        ctx.lineTo(fracEndX, mainBarY);
        ctx.stroke();

        // 3. Numérateur (Toujours blanc, ne change jamais)
        ctx.fillStyle = colorNormal;
        ctx.font = '34px "Georgia", "Times New Roman", serif';
        ctx.fillText("1", fracCenterX, mainBarY - 30);

        if (state === 4) {
            // Étape finale : gamma = 1/0
            ctx.fillStyle = colorChange;
            ctx.font = 'bold 44px "Georgia", "Times New Roman", serif';
            ctx.fillText("0", fracCenterX, mainBarY + 40); // Le 0 en bas est rouge
            ctx.restore();
            return; 
        }

        // 4. Racine carrée
        const sqrtStartX = -5;
        const sqrtTopY = mainBarY + 15;
        const sqrtBottomY = mainBarY + 70;
        const sqrtEndX = 150;

        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sqrtStartX, sqrtTopY + 28);
        ctx.lineTo(sqrtStartX + 8, sqrtTopY + 24);
        ctx.lineTo(sqrtStartX + 20, sqrtBottomY);
        ctx.lineTo(sqrtStartX + 35, sqrtTopY);
        ctx.lineTo(sqrtEndX, sqrtTopY);
        ctx.stroke();

        // 5. Contenu sous la racine
        const innerY = sqrtTopY + 32;
        ctx.font = '32px "Georgia", "Times New Roman", serif';
        ctx.textAlign = 'left';

        if (state === 3) {
            // state 3 : racine de 0 (on enlève le 1-)
            ctx.fillStyle = colorChange;
            ctx.font = 'bold 32px "Georgia", "Times New Roman", serif';
            ctx.textAlign = 'center';
            ctx.fillText("0", sqrtStartX + 75, innerY); 
            
        } else if (state === 2) {
            // state 2 : on a 1 - 1
            ctx.fillStyle = colorNormal;
            ctx.fillText("1 −", sqrtStartX + 40, innerY);
            
            ctx.fillStyle = colorChange;
            ctx.font = 'bold 32px "Georgia", "Times New Roman", serif';
            ctx.fillText("1", sqrtStartX + 105, innerY); 
            
        } else {
            // state 0 ou 1 : fraction
            ctx.fillStyle = colorNormal;
            ctx.fillText("1 −", sqrtStartX + 40, innerY);

            const subFracStartX = 90;
            const subFracEndX = 145;
            const subFracCenterX = (subFracStartX + subFracEndX) / 2;

            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(subFracStartX, innerY);
            ctx.lineTo(subFracEndX, innerY);
            ctx.stroke();

            // Numérateur (v ou c)
            ctx.textAlign = 'center';
            ctx.font = 'italic 26px "Georgia", "Times New Roman", serif';
            
            if (state === 1) {
                ctx.fillStyle = colorChange;
                ctx.font = 'bold italic 26px "Georgia", "Times New Roman", serif';
                ctx.fillText("c", subFracCenterX - 4, innerY - 18);
            } else {
                ctx.fillStyle = colorNormal;
                ctx.fillText("v", subFracCenterX - 4, innerY - 18);
            }
            
            ctx.font = 'bold 16px "Georgia", "Times New Roman", serif';
            ctx.fillText("2", subFracCenterX + 9, innerY - 26);

            // Dénominateur (c)
            ctx.fillStyle = colorNormal;
            ctx.font = 'italic 26px "Georgia", "Times New Roman", serif';
            ctx.fillText("c", subFracCenterX - 4, innerY + 18);
            ctx.font = 'bold 16px "Georgia", "Times New Roman", serif';
            ctx.fillText("2", subFracCenterX + 9, innerY + 10);
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        if (this.step > 0) this.fadeTimer += dt;

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.3})`;
            ctx.beginPath(); 
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        
        let currentY = 70;
        const spacing = 130; 

        // --- ÉTAPE 0 : Formule de base ---
        this.drawFormula(ctx, cx, currentY, 0);
        
        // --- ÉTAPE 1 ---
        if (this.step >= 1) {
            const alpha = this.step === 1 ? Math.min(1, this.fadeTimer / 0.5) : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            currentY += spacing;
            this.drawFormula(ctx, cx, currentY, 1);
            
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.font = 'bold italic 18px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText("→ On remplace v par c", cx + 160, currentY);
            ctx.restore();
        }

        // --- ÉTAPE 2 ---
        if (this.step >= 2) {
            const alpha = this.step === 2 ? Math.min(1, this.fadeTimer / 0.5) : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            currentY += spacing;
            this.drawFormula(ctx, cx, currentY, 2);
            
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.font = 'bold italic 18px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText("→ c²/c² = 1, donc 1 - 1", cx + 160, currentY);
            ctx.restore();
        }

        // --- ÉTAPE 3 ---
        if (this.step >= 3) {
            const alpha = this.step === 3 ? Math.min(1, this.fadeTimer / 0.5) : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            currentY += spacing;
            this.drawFormula(ctx, cx, currentY, 3);
            
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.font = 'bold italic 18px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText("→ La racine carrée de 1 - 1 est 0", cx + 160, currentY);
            ctx.restore();
        }

        // --- ÉTAPE 4 : Le drame ---
        if (this.step >= 4) {
            const alpha = this.step === 4 ? Math.min(1, this.fadeTimer / 0.5) : 1;
            ctx.save();
            ctx.globalAlpha = alpha;
            currentY += spacing + 20; 
            this.drawFormula(ctx, cx, currentY, 4);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 36px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Division par 0 impossible !", cx, currentY + 80);
            
            ctx.restore();
        }
    },

    destroy: function() {}
};