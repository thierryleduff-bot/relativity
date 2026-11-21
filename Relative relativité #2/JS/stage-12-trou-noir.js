// =====================================================================
// CHAPITRE 12 — LES TROUS NOIRS (ÉTAPE 1/5)
// ---------------------------------------------------------------------
// La naissance : étoile bleue → géante rouge → effondrement → supernova
// → dispersion → trou noir.
// =====================================================================

window.Stages[12] = {
    time: 0,
    phase: 0,
    phaseTimer: 0,
    pendingTimer: -1,
    stars: [],
    debris: [],
    refletProgress: 0, 
    
    VIEILLISSEMENT_DELAY: 3.0,
    VIEILLISSEMENT_DURATION: 3.5,
    GEANTE_ROUGE_DURATION: 2.0,
    EFFONDREMENT_DURATION: 1.0,
    SUPERNOVA_DURATION: 0.6,
    DISPERSION_DURATION: 2.5,
    FONDU_NOIR_DURATION: 5.0,
    REFLET_CYCLE_DURATION: 6.0, 

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "La Naissance d'un Trou Noir";
        if (numberEl) numberEl.textContent = "CHAPITRE 12 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. La naissance</strong></p>
                <p>Une étoile très massive (20 fois la masse du Soleil) vit sa vie, paisiblement, en équilibre entre la gravité qui la comprime et la fusion qui la pousse vers l'extérieur.</p>
                <p>Quand elle a consommé tout son carburant, cet équilibre se brise.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Cliquez sur "Vieillir l'étoile" pour accélérer le temps.</p>
            `;
        }

        this.reset();
        this.setupControls(controlsEl);

        this.stars = [];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    setupControls: function(controlsEl) {
        if (!controlsEl) return;
        controlsEl.classList.add('visible');
        controlsEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                <button id="btn-vieillir" class="step-btn" style="width:100%; height:40px;">
                    ⏳ Vieillir l'étoile
                </button>
                <button id="btn-effondrer" class="step-btn" style="width:100%; height:40px; display:none; background: #7f1d1d; border-color: #ef4444;">
                    💥 Provoquer l'effondrement
                </button>
            </div>
        `;

        document.getElementById('btn-vieillir').onclick = () => {
            if (this.phase !== 0) return;
            this.pendingTimer = this.VIEILLISSEMENT_DELAY;
            const btn = document.getElementById('btn-vieillir');
            btn.disabled = true;
            btn.textContent = "⏳ Vieillissement en cours...";
            btn.style.opacity = 0.5;
            btn.style.cursor = 'not-allowed';
        };

        document.getElementById('btn-effondrer').onclick = () => {
            if (this.phase !== 3) return;
            this.startEffondrement();
        };
    },

    startEffondrement: function() {
        this.phase = 4;
        this.phaseTimer = 0;
        
        const btn = document.getElementById('btn-effondrer');
        if (btn) btn.style.display = 'none';
        
        const narrativeEl = document.getElementById('narrative-text');
        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>L'effondrement</strong></p>
                <p>Le cœur de fer s'effondre en une fraction de seconde.</p>
                <p>Les couches externes rebondissent violemment sur ce cœur : c'est la supernova.</p>
            `;
        }
    },

    reset: function() {
        this.time = 0;
        this.phase = 0;
        this.phaseTimer = 0;
        this.pendingTimer = -1;
        this.refletProgress = 0;
        this.debris = [];
        
        const btn = document.getElementById('btn-vieillir');
        if (btn) {
            btn.disabled = false;
            btn.textContent = "⏳ Vieillir l'étoile";
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.style.display = 'block';
        }
        const btnEff = document.getElementById('btn-effondrer');
        if (btnEff) btnEff.style.display = 'none';
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('12_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('11_2'); },

    createDebris: function(cx, cy) {
        this.debris = [];
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 200;
            this.debris.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 6,
                alpha: 1,
                color: Math.random() > 0.5 ? [255, 200, 100] : [255, 100, 50]
            });
        }
    },

    drawSunReference: function(ctx, width, height) {
        const sunX = width - 100;
        const sunY = 80;

        ctx.save();
        
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sunX + 15, sunY - 10);
        ctx.lineTo(sunX + 5, sunY - 2);
        ctx.lineTo(sunX + 8, sunY);
        ctx.moveTo(sunX + 5, sunY - 2);
        ctx.lineTo(sunX + 7, sunY - 5);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = 'italic 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText("Le Soleil", sunX + 20, sunY - 10);

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.phaseTimer += dt;
        
        const cx = width / 2;
        const cy = height / 2;
        
        if (this.pendingTimer > 0) {
            this.pendingTimer -= dt;
            if (this.pendingTimer <= 0) {
                this.pendingTimer = -1;
                this.phase = 1;
                this.phaseTimer = 0;
            }
        }

        if (this.phase === 1 && this.phaseTimer >= this.VIEILLISSEMENT_DURATION) {
            this.phase = 2;
            this.phaseTimer = 0;
        } else if (this.phase === 2 && this.phaseTimer >= this.GEANTE_ROUGE_DURATION) {
            this.phase = 3;
            this.phaseTimer = 0;
            
            const btn = document.getElementById('btn-effondrer');
            if (btn) btn.style.display = 'block';
            
            const narrativeEl = document.getElementById('narrative-text');
            if (narrativeEl) {
                narrativeEl.innerHTML = `
                    <p><strong>La géante rouge</strong></p>
                    <p>L'étoile a épuisé son carburant. Son cœur se contracte et chauffe. Son enveloppe gonfle démesurément.</p>
                    <p style="color: #ef4444; font-weight: 600; margin-top: 15px;">Elle est instable. L'effondrement est imminent.</p>
                `;
            }
        } else if (this.phase === 4 && this.phaseTimer >= this.EFFONDREMENT_DURATION) {
            this.phase = 5;
            this.phaseTimer = 0;
            this.createDebris(cx, cy);
        } else if (this.phase === 5 && this.phaseTimer >= this.SUPERNOVA_DURATION) {
            this.phase = 5.5;
            this.phaseTimer = 0;
        } else if (this.phase === 5.5 && this.phaseTimer >= this.DISPERSION_DURATION) {
            this.phase = 6;
            this.phaseTimer = 0;
            
            const narrativeEl = document.getElementById('narrative-text');
            if (narrativeEl) {
                narrativeEl.innerHTML = `
                    <p><strong>Le trou noir</strong></p>
                    <p>Toute la matière du cœur s'est effondrée. Il ne reste qu'une région de l'espace où la gravité est si intense que rien, pas même la lumière, ne peut s'échapper.</p>
                    <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Le trou noir est né.</p>
                `;
            }
        }
        
        if (this.phase === 5.5) {
            this.debris.forEach(d => {
                d.x += d.vx * dt;
                d.y += d.vy * dt;
                d.alpha -= 0.4 * dt;
            });
            this.debris = this.debris.filter(d => d.alpha > 0);
        }
        
        if (this.phase >= 5.5) {
            this.refletProgress += dt / this.REFLET_CYCLE_DURATION;
            if (this.refletProgress >= 1) {
                this.refletProgress -= 1; 
            }
        }

        // === DESSIN ===
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        // 1. Fond étoilé
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.6})`;
            ctx.beginPath();
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Dessin selon la phase
        if (this.phase === 0 || this.phase === 1) {
            let progress = 0;
            if (this.phase === 1) progress = this.phaseTimer / this.VIEILLISSEMENT_DURATION;
            const radius = 40 + progress * 20;
            this.drawStar(ctx, cx, cy, radius, 'blue', progress);
            
        } else if (this.phase === 2 || this.phase === 3) {
            let progress = 1;
            if (this.phase === 2) progress = this.phaseTimer / this.GEANTE_ROUGE_DURATION;
            const radius = 60 + progress * 160;
            this.drawStar(ctx, cx, cy, radius, 'red', progress);
            
        } else if (this.phase === 4) {
            // Phase d'effondrement : L'étoile se contracte brutalement
            const progress = this.phaseTimer / this.EFFONDREMENT_DURATION;
            const starRadius = 220 * (1 - progress * 0.95);
            
            if (starRadius > 1) {
                this.drawStar(ctx, cx, cy, starRadius, 'red', 1);
            }
            
        } else if (this.phase === 5) {
            // Supernova : Flash et début des débris
            const progress = this.phaseTimer / this.SUPERNOVA_DURATION;
            const intensity = 1 - progress;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
            ctx.fillRect(0, 0, width, height);
            
            const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
            flashGrad.addColorStop(0, `rgba(255, 255, 200, ${intensity})`);
            flashGrad.addColorStop(0.3, `rgba(255, 200, 100, ${intensity * 0.8})`);
            flashGrad.addColorStop(1, `rgba(255, 100, 50, 0)`);
            ctx.fillStyle = flashGrad;
            ctx.fillRect(0, 0, width, height);
            
        } else if (this.phase === 5.5) {
            // Dispersion : Les débris s'éloignent, le trou noir apparaît
            const progress = this.phaseTimer / this.DISPERSION_DURATION;
            
            const haloAlpha = Math.max(0, 1 - progress * 1.5);
            if (haloAlpha > 0) {
                const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 + progress * 300);
                haloGrad.addColorStop(0, `rgba(255, 200, 100, ${haloAlpha * 0.6})`);
                haloGrad.addColorStop(0.5, `rgba(255, 100, 50, ${haloAlpha * 0.3})`);
                haloGrad.addColorStop(1, `rgba(255, 50, 0, 0)`);
                ctx.fillStyle = haloGrad;
                ctx.fillRect(0, 0, width, height);
            }
            
            // Le trou noir est révélé
            this.drawBlackHole(ctx, cx, cy, 25);

            this.debris.forEach(d => {
                ctx.fillStyle = `rgba(${d.color[0]}, ${d.color[1]}, ${d.color[2]}, ${d.alpha})`;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
        } else if (this.phase === 6) {
            const fadeProgress = Math.min(1, this.phaseTimer / this.FONDU_NOIR_DURATION);
            
            const veilAlpha = fadeProgress * 0.85;
            ctx.fillStyle = `rgba(11, 15, 25, ${veilAlpha})`;
            ctx.fillRect(0, 0, width, height);
            
            this.drawBlackHole(ctx, cx, cy, 25);
        }

        // 3. Le point de référence : Le Soleil
        if (this.phase === 0 && this.pendingTimer === -1) {
            this.drawSunReference(ctx, width, height);
        }

        ctx.restore();
    },

    drawStar: function(ctx, cx, cy, radius, colorType, progress) {
        let colorStops;
        if (colorType === 'blue') {
            if (progress > 0) {
                colorStops = [
                    { stop: 0, color: [255, 255, 255] },
                    { stop: 0.3, color: [186, 230, 253] },
                    { stop: 0.7, color: [56, 189, 248] },
                    { stop: 1, color: [3, 105, 161] }
                ];
                const redMix = progress;
                colorStops = colorStops.map(cs => ({
                    stop: cs.stop,
                    color: [
                        cs.color[0] + (239 - cs.color[0]) * redMix,
                        cs.color[1] + (68 - cs.color[1]) * redMix,
                        cs.color[2] + (68 - cs.color[2]) * redMix
                    ]
                }));
            } else {
                colorStops = [
                    { stop: 0, color: [255, 255, 255] },
                    { stop: 0.3, color: [186, 230, 253] },
                    { stop: 0.7, color: [56, 189, 248] },
                    { stop: 1, color: [3, 105, 161] }
                ];
            }
        } else {
            colorStops = [
                { stop: 0, color: [255, 255, 255] },
                { stop: 0.15, color: [255, 183, 0] },
                { stop: 0.5, color: [234, 88, 12] },
                { stop: 0.85, color: [220, 38, 38] },
                { stop: 1, color: [127, 29, 29] }
            ];
        }

        const haloColor = colorType === 'blue' 
            ? (progress > 0 ? `rgba(220, 38, 38, ${0.5 + progress * 0.3})` : 'rgba(56, 189, 248, 0.6)')
            : 'rgba(239, 68, 68, 0.6)';
        
        const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.8);
        outerGlow.addColorStop(0, haloColor);
        outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        colorStops.forEach(cs => {
            grad.addColorStop(cs.stop, `rgb(${Math.round(cs.color[0])}, ${Math.round(cs.color[1])}, ${Math.round(cs.color[2])})`);
        });
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    },

    drawBlackHole: function(ctx, cx, cy, radius) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        
        const refletXOffset = (this.refletProgress - 0.5) * 2; 
        const refletX = cx + refletXOffset * radius * 0.6;
        const refletY = cy - radius * 0.35 + Math.abs(refletXOffset) * radius * 0.15;
        
        let refletAlpha = 1;
        if (this.refletProgress < 0.15) {
            refletAlpha = this.refletProgress / 0.15;
        } else if (this.refletProgress > 0.85) {
            refletAlpha = (1 - this.refletProgress) / 0.15;
        }
        
        const refletSize = radius * (0.35 - Math.abs(refletXOffset) * 0.1);
        
        if (refletAlpha > 0) {
            const refletGrad = ctx.createRadialGradient(refletX, refletY, 0, refletX, refletY, refletSize);
            refletGrad.addColorStop(0, `rgba(148, 163, 184, ${0.6 * refletAlpha})`);
            refletGrad.addColorStop(1, `rgba(148, 163, 184, 0)`);
            ctx.fillStyle = refletGrad;
            ctx.beginPath();
            ctx.arc(refletX, refletY, refletSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
    },

    destroy: function() {}
};