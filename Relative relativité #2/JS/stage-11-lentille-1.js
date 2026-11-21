// =====================================================================
// CHAPITRE 11 — LA LENTILLE GRAVITATIONNELLE (ÉTAPE 2/3)
// ---------------------------------------------------------------------
// Vue de profil. Comparaison : attente intuitive vs réalité.
// =====================================================================

window.Stages['11_1'] = {
    time: 0,
    stars: [],
    nebulaStars: [],
    
    // États pour le fade-in séquentiel
    step: 0, // 0: rien, 1: haut affiché, 2: bas affiché
    fadeTop: 0,
    fadeBottom: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "La Lentille Gravitationnelle";
        if (numberEl) numberEl.textContent = "CHAPITRE 11 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. Vue de profil (Le principe)</strong></p>
                <p>Une masse énorme (comme une galaxie) se trouve entre nous et un objet lointain.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-afficher" class="step-btn" style="width:100%; height:40px; background: #38bdf8; color: #0b0f19; font-weight: bold;">
                        Afficher
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-afficher');
            if (btn) {
                btn.onclick = () => {
                    if (this.step === 0) {
                        this.step = 1;
                        btn.textContent = "Voir la réalité";
                    } else if (this.step === 1) {
                        this.step = 2;
                        btn.disabled = true;
                        btn.style.opacity = 0.5;
                        btn.style.cursor = 'not-allowed';
                        btn.textContent = "Terminé";
                    }
                };
            }
        }

        this.reset();
        
        // Étoiles de fond
        this.stars = [];
        for (let i = 0; i < 60; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        // Nébuleuse (agrandie x1.3)
        this.nebulaStars = [];
        for (let i = 0; i < 80; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.pow(Math.random(), 2) * 78; // 60 * 1.3
            
            this.nebulaStars.push({
                angle: angle,
                dist: dist,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 2 + 1,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    reset: function() { 
        this.time = 0; 
        this.step = 0;
        this.fadeTop = 0;
        this.fadeBottom = 0;

        const btn = document.getElementById('btn-afficher');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.textContent = "Afficher";
        }
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 3; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('11_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(11); },

    drawScene: function(ctx, width, height, offsetY, isTopScene) {
        const obsX = width - 100; 
        const obsY = offsetY + height / 2;
        
        const massX = width * 0.55; 
        const massY = offsetY + height / 2;
        const massRadius = 38.5; 
        
        const srcX = 50;

        // 1. Nébuleuse à gauche (agrandie)
        const nebulaRadius = 91; // 70 * 1.3
        let nebGrad = ctx.createRadialGradient(srcX, obsY, 0, srcX, obsY, nebulaRadius);
        nebGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
        nebGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
        nebGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = nebGrad;
        ctx.beginPath(); ctx.arc(srcX, obsY, nebulaRadius, 0, Math.PI * 2); ctx.fill();

        nebGrad = ctx.createRadialGradient(srcX, obsY, 0, srcX, obsY, nebulaRadius * 0.6);
        nebGrad.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
        nebGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = nebGrad;
        ctx.beginPath(); ctx.arc(srcX, obsY, nebulaRadius * 0.6, 0, Math.PI * 2); ctx.fill();

        this.nebulaStars.forEach(ns => {
            const sx = srcX + Math.cos(ns.angle) * ns.dist;
            const sy = obsY + Math.sin(ns.angle) * ns.dist;
            const twinkle = (Math.sin(this.time * ns.twinkleSpeed + ns.phase) + 1) / 2;
            const alpha = ns.alpha * (0.4 + 0.6 * twinkle);
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, ns.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. La masse (halo + sphère)
        const massHalo = ctx.createRadialGradient(massX, massY, 0, massX, massY, massRadius * 2.5);
        massHalo.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
        massHalo.addColorStop(0.5, 'rgba(245, 158, 11, 0.05)');
        massHalo.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = massHalo;
        ctx.beginPath();
        ctx.arc(massX, massY, massRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.arc(massX, massY, massRadius, 0, Math.PI * 2); 
        ctx.fill(); 
        ctx.stroke();

        // 3. Les rayons lumineux
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
        ctx.lineWidth = 1.5;

        // Définition des positions Y des rayons (4 rayons)
        const rayOffsets = [-60, -20, 20, 60];

        if (isTopScene) {
            // SCÈNE DU HAUT : Les rayons vont tout droit et ratent la Terre
            rayOffsets.forEach((offset, index) => {
                ctx.beginPath();
                ctx.moveTo(srcX, obsY + offset);
                if (index === 1 || index === 2) {
                    // Rayons internes : s'écrasent sur la masse
                    ctx.lineTo(massX - massRadius, obsY + offset); 
                } else {
                    // Rayons externes : continuent tout droit
                    ctx.lineTo(width, obsY + offset); 
                }
                ctx.stroke();
            });
        } else {
            // SCÈNE DU BAS : Les rayons sont déviés
            rayOffsets.forEach((offset, index) => {
                if (index === 1 || index === 2) {
                    // Rayons internes : s'écrasent sur la masse (légèrement rallongés)
                    ctx.beginPath();
                    ctx.moveTo(srcX, obsY + offset);
                    ctx.lineTo(massX - massRadius + 2, obsY + offset); 
                    ctx.stroke();
                } else {
                    // Rayons externes : courbés vers la Terre
                    ctx.beginPath();
                    ctx.moveTo(srcX, obsY + offset);
                    // On adapte la courbure selon le rayon (haut ou bas)
                    const cpOffset = offset < 0 ? -20 : 20; 
                    ctx.bezierCurveTo(
                        srcX + (massX - srcX) * 0.7, obsY + offset,        
                        massX + 10, obsY + offset + cpOffset,                          
                        obsX, obsY                                      
                    );
                    ctx.stroke();
                }
            });
        }

        // 4. L'observateur (Terre)
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 15;
        ctx.beginPath(); 
        ctx.arc(obsX, obsY, 15, 0, Math.PI * 2); 
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Terre", obsX, obsY + 35);
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        // Gestion des fondus
        if (this.step >= 1 && this.fadeTop < 1) this.fadeTop += dt * 2;
        if (this.step >= 2 && this.fadeBottom < 1) this.fadeBottom += dt * 2;

        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        // Étoiles de fond globales
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fillRect(star.x * width, star.y * height, star.size + 1, star.size + 1);
        });

        // DESSIN SCÈNE DU HAUT
        if (this.fadeTop > 0) {
            ctx.save();
            ctx.globalAlpha = Math.min(1, this.fadeTop);
            
            const grad = ctx.createRadialGradient(width * 0.55, height * 0.25, 0, width * 0.55, height * 0.25, width / 2);
            grad.addColorStop(0, "rgba(245,158,11,0.15)");
            grad.addColorStop(1, "rgba(245,158,11,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height / 2);

            this.drawScene(ctx, width, height / 2, 0, true);
            
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Ce à quoi on pourrait s'attendre", width / 2, 40);
            ctx.restore();
        }

        // Ligne de séparation
        if (this.step >= 1) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();
            ctx.restore();
        }

        // DESSIN SCÈNE DU BAS
        if (this.fadeBottom > 0) {
            ctx.save();
            ctx.globalAlpha = Math.min(1, this.fadeBottom);
            
            const grad = ctx.createRadialGradient(width * 0.55, height * 0.75, 0, width * 0.55, height * 0.75, width / 2);
            grad.addColorStop(0, "rgba(245,158,11,0.15)");
            grad.addColorStop(1, "rgba(245,158,11,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, height / 2, width, height / 2);

            this.drawScene(ctx, width, height / 2, height / 2, false);
            
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("En réalité, la masse dévie la lumière.", width / 2, height / 2 + 40);
            ctx.restore();
        }

        ctx.restore();
    },

    destroy: function() {}
};