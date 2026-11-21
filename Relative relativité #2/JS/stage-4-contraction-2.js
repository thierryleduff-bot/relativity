// =====================================================================
// CHAPITRE 4 — LA CONTRACTION DES LONGUEURS (ÉTAPE 3/3)
// ---------------------------------------------------------------------
// La réciprocité : Lunette (Terre) vs Hublot (Fusée).
// =====================================================================

window.Stages['4_2'] = {
    time: 0,
    stars: [],
    movingStars: [],
    starOffset: 0,

    currentRef: 'terre',
    velocityRatio: 0.1, // Démarre à 10%
    gamma: 1,
    cKmS: 299792.458,
    
    earthRadius: 100, 
    shipLength: 200,
    H0: 40, 

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La réciprocité";
        if (numberEl) numberEl.textContent = "CHAPITRE 4 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. La réciprocité</strong></p>
                <p>Le principe de relativité affirme que les lois de la physique sont les mêmes pour tous les observateurs en mouvement rectiligne uniforme.</p>
                <p>Aucun des deux ne peut prétendre être "au repos absolu". L'observateur sur Terre considère que la fusée bouge. Le voyageur considère que c'est la Terre qui bouge.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">C'est pourquoi la Terre voit la fusée contractée, et la fusée voit la Terre contractée. Les deux ont raison dans leur propre référentiel.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <div style="font-size:0.85rem; color:#cbd5e1;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span>Vitesse</span>
                            <strong id="val-v-kms" style="color:#06b6d4;">0 km/s</strong>
                        </div>
                        <input id="slider-v" type="range" min="0" max="0.99" step="0.01" value="0.1" 
                            style="width:100%; accent-color:#06b6d4; cursor:pointer;">
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#94a3b8; margin-top:4px;">
                            <span>0</span>
                            <span id="val-pc" style="color:#06b6d4;">10 % c</span>
                        </div>
                    </div>
                    <button id="btn-switch-ref" class="step-btn" style="width:100%; height:36px; margin-top: 10px;">
                        👁 Voir depuis la fusée
                    </button>
                </div>
            `;

            const slider = document.getElementById('slider-v');
            if (slider) {
                slider.oninput = (e) => {
                    this.velocityRatio = parseFloat(e.target.value);
                    this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);
                    this.updateLabels();
                };
            }

            const btn = document.getElementById('btn-switch-ref');
            if (btn) {
                btn.onclick = () => {
                    this.currentRef = (this.currentRef === 'terre') ? 'fusee' : 'terre';
                    btn.textContent = (this.currentRef === 'terre') 
                        ? "👁 Voir depuis la fusée" 
                        : "👁 Voir depuis la Terre";
                };
            }
            this.updateLabels();
        }

        this.time = 0;
        this.currentRef = 'terre';
        this.velocityRatio = 0.1;
        this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);
        this.starOffset = 0;
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

        this.movingStars = [];
        for (let i = 0; i < 80; i++) {
            this.movingStars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 2 + 0.5,
                baseAlpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    updateLabels: function() {
        const vKms = this.velocityRatio * this.cKmS;
        const vEl = document.getElementById('val-v-kms');
        const pcEl = document.getElementById('val-pc');

        if (vEl) vEl.textContent = Math.round(vKms).toLocaleString('fr-FR') + ' km/s';
        if (pcEl) pcEl.textContent = (this.velocityRatio * 100).toFixed(0) + ' % c';
    },

    reset: function() {
        this.time = 0;
        this.currentRef = 'terre';
        this.starOffset = 0;
        this.velocityRatio = 0.1;
        this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);
        
        const slider = document.getElementById('slider-v');
        if (slider) slider.value = 0.1;
        this.updateLabels();

        const btn = document.getElementById('btn-switch-ref');
        if (btn) btn.textContent = "👁 Voir depuis la fusée";
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 3; },
    nextStep: function() {},
    prevStep: function() { if (window.Engine) window.Engine.loadStage('4_1'); },

    drawFusee: function(ctx, x, y, length, color, showFlame = false) {
        const halfL = length / 2;
        const halfH = this.H0 / 2;

        ctx.save();
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + halfL, y);
        ctx.quadraticCurveTo(x + halfL * 0.7, y - halfH, x + halfL * 0.5, y - halfH);
        ctx.lineTo(x - halfL * 0.7, y - halfH);
        ctx.quadraticCurveTo(x - halfL, y - halfH * 0.5, x - halfL, y);
        ctx.quadraticCurveTo(x - halfL, y + halfH * 0.5, x - halfL * 0.7, y + halfH);
        ctx.lineTo(x + halfL * 0.5, y + halfH);
        ctx.quadraticCurveTo(x + halfL * 0.7, y + halfH, x + halfL, y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - halfL * 0.7, y - halfH);
        ctx.lineTo(x - halfL * 0.7 - (length * 0.15), y - halfH - (this.H0 * 0.4));
        ctx.lineTo(x - halfL, y);
        ctx.lineTo(x - halfL * 0.7 - (length * 0.15), y + halfH + (this.H0 * 0.4));
        ctx.lineTo(x - halfL * 0.7, y + halfH);
        ctx.fill();

        ctx.fillStyle = `${color}88`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        const frontX = x + halfL * 0.6;
        const backX = x - halfL * 0.2;
        const spanX = frontX - backX;
        
        for (let i = 0; i < 5; i++) {
            const wx = backX + (spanX / 4) * i;
            const winRadius = 6;
            ctx.beginPath();
            ctx.arc(wx, y - halfH * 0.4, winRadius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }

        if (showFlame && this.velocityRatio > 0) {
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(x - halfL, y - halfH * 0.4);
            const flameLength = (20 + Math.random() * 30) * (length / 200); 
            ctx.lineTo(x - halfL - flameLength, y);
            ctx.lineTo(x - halfL, y + halfH * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    },

    drawTerre: function(ctx, x, y, radius, color, isOval) {
        ctx.save();
        
        const grad = ctx.createRadialGradient(x - radius*0.3, y - radius*0.3, radius*0.1, x, y, radius);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.6, '#0ea5e9');
        grad.addColorStop(1, '#082f49');

        ctx.fillStyle = grad;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (isOval) {
            ctx.ellipse(x, y, radius / this.gamma, radius, 0, 0, Math.PI * 2);
        } else {
            ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.beginPath();
        if (isOval) {
            ctx.ellipse(x - radius*0.2/this.gamma, y - radius*0.1, radius*0.4/this.gamma, radius*0.3, 0.3, 0, Math.PI*2);
            ctx.ellipse(x + radius*0.3/this.gamma, y + radius*0.2, radius*0.2/this.gamma, radius*0.4, -0.5, 0, Math.PI*2);
        } else {
            ctx.ellipse(x - radius*0.2, y - radius*0.1, radius*0.4, radius*0.3, 0.3, 0, Math.PI*2);
            ctx.ellipse(x + radius*0.3, y + radius*0.2, radius*0.2, radius*0.4, -0.5, 0, Math.PI*2);
        }
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        if (isOval) {
            ctx.ellipse(x + radius*0.1/this.gamma, y - radius*0.3, radius*0.3/this.gamma, radius*0.1, 0.2, 0, Math.PI*2);
        } else {
            ctx.ellipse(x + radius*0.1, y - radius*0.3, radius*0.3, radius*0.1, 0.2, 0, Math.PI*2);
        }
        ctx.fill();
        
        ctx.restore();
    },

    drawPeriscopeOverlay: function(ctx, cx, cy, radius) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;

        // Croix de visée
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.2, cy); ctx.lineTo(cx + radius * 0.2, cy);
        ctx.moveTo(cx, cy - radius * 0.2); ctx.lineTo(cx, cy + radius * 0.2);
        ctx.stroke();

        // Graduations horizontales (axe X)
        const step = radius / 5;
        for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            const x = cx + i * step;
            const y = cy;
            const lineH = (i % 2 === 0) ? 15 : 8;
            ctx.beginPath();
            ctx.moveTo(x, y - lineH);
            ctx.lineTo(x, y + lineH);
            ctx.stroke();
        }

        // Graduations verticales (axe Y)
        for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            const x = cx;
            const y = cy + i * step;
            const lineW = (i % 2 === 0) ? 15 : 8;
            ctx.beginPath();
            ctx.moveTo(x - lineW, y);
            ctx.lineTo(x + lineW, y);
            ctx.stroke();
        }
        ctx.restore();
    },

    drawCockpitInterior: function(ctx, cx, cy, radius) {
        ctx.save();
        
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.rect(0, 0, cx * 2, cy * 2);
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 20;
        ctx.beginPath(); ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2); ctx.stroke();
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2); ctx.stroke();
        
        ctx.fillStyle = '#94a3b8';
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bx = cx + Math.cos(angle) * (radius + 10);
            const by = cy + Math.sin(angle) * (radius + 10);
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        const speedFactor = this.velocityRatio > 0.01 ? Math.pow(this.velocityRatio, 1.5) : 0;
        this.starOffset += 200 * speedFactor * dt;

        // Étoiles fixes (fond)
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        
        const radius = Math.min(width, height) * 0.45;

        if (this.currentRef === 'terre') {
            // --- VUE DEPUIS LA TERRE (Lunette) ---
            
            ctx.save();
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
            
            this.movingStars.forEach(star => {
                let x = (star.x * width - this.starOffset) % width;
                if (x < 0) x += width;
                if (x > cx - radius && x < cx + radius) {
                    const trailLength = (1 + this.velocityRatio * this.velocityRatio * 80) / 2;
                    if (trailLength > 3) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                        ctx.lineWidth = star.size * 0.7;
                        ctx.beginPath(); ctx.moveTo(x, star.y * height); ctx.lineTo(x - trailLength, star.y * height); ctx.stroke();
                    } else {
                        ctx.fillStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                        ctx.beginPath(); ctx.arc(x, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
                    }
                }
            });
            
            const displayL = this.shipLength / this.gamma;
            this.drawFusee(ctx, cx, cy, displayL, '#22c55e', true);
            ctx.restore();

            // Cadre de la lunette (noir)
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
            
            // Ajout du périscope (règles X & Y)
            this.drawPeriscopeOverlay(ctx, cx, cy, radius);
            
            ctx.restore();

            // Légende
            ctx.save();
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Vue depuis la Terre — la fusée est contractée", cx, 30);
            ctx.restore();

        } else {
            // --- VUE DEPUIS LA FUSÉE (Hublot) ---
            
            // Effet de vibration
            const vibrationX = (Math.random() - 0.5) * (this.velocityRatio * 6);
            const vibrationY = (Math.random() - 0.5) * (this.velocityRatio * 6);

            ctx.save();
            ctx.translate(vibrationX, vibrationY);
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
            
            // Défilement vers la droite
            this.movingStars.forEach(star => {
                let x = (star.x * width + this.starOffset) % width;
                if (x < 0) x += width;
                if (x > cx - radius && x < cx + radius) {
                    const trailLength = (1 + this.velocityRatio * this.velocityRatio * 80) / 2;
                    if (trailLength > 3) {
                        ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                        ctx.lineWidth = star.size * 0.7;
                        ctx.beginPath(); ctx.moveTo(x, star.y * height); ctx.lineTo(x + trailLength, star.y * height); ctx.stroke();
                    } else {
                        ctx.fillStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                        ctx.beginPath(); ctx.arc(x, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
                    }
                }
            });
            
            // La Terre contractée
            this.drawTerre(ctx, cx, cy, this.earthRadius, '#06b6d4', true);
            
            ctx.restore();

            // Habillage intérieur
            this.drawCockpitInterior(ctx, cx, cy, radius);

            // Légende
            ctx.save();
            ctx.fillStyle = '#06b6d4';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Vue depuis la fusée — la Terre est contractée dans le sens du mouvement", cx, 30);
            ctx.restore();
        }

        // Message final
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Chacun voit l'autre contracté. Aucun ne voit son propre monde rétrécir.", cx, height - 30);
        ctx.restore();
    },

    destroy: function() {}
};