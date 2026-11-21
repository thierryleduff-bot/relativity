// =====================================================================
// CHAPITRE 4 — LA CONTRACTION DES LONGUEURS (ÉTAPE 2/3)
// ---------------------------------------------------------------------
// La fusée en mouvement (50m). Curseur à 0. Vibration à haute vitesse.
// =====================================================================

window.Stages['4_1'] = {
    time: 0,
    stars: [],
    movingStars: [],
    bgOffset: 0,
    starOffset: 0,

    velocityRatio: 0.0, // Démarre à 0
    gamma: 1,
    cKmS: 299792.458,

    L0: 240, // Représentation de 50m
    H0: 48,
    baseScrollSpeed: 60,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La fusée en mouvement";
        if (numberEl) numberEl.textContent = "CHAPITRE 4 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. La fusée en mouvement</strong></p>
                <p>La fusée accélère. À 90 % de la vitesse de la lumière, quelque chose d'étrange se produit.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Vu d'un point immobile, la fusée paraît se contracter dans le sens du mouvement au fur et à mesure que la vitesse croit. Si elle décroît, la fusée paraît reprendre sa longueur normale.</p>
                <p style="margin-top: 20px; font-size: 0.85rem; color: #94a3b8;">
                    <strong>Rappel :</strong> la vitesse de la lumière dans le vide est <strong>fixe</strong> : environ <strong>300 000 km/s</strong>.
                </p>
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
                        <input id="slider-v" type="range" min="0" max="0.99" step="0.01" value="0.0" 
                            style="width:100%; accent-color:#06b6d4; cursor:pointer;">
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#94a3b8; margin-top:4px;">
                            <span>0</span>
                            <span id="val-pc" style="color:#06b6d4;">0 % c</span>
                        </div>
                    </div>
                    <div style="font-size:0.8rem; color:#94a3b8; text-align:center; padding-top:6px; border-top:1px solid rgba(255,255,255,0.06);">
                        γ = <span id="val-gamma" style="color:#06b6d4;">1,00</span> | 
                        Longueur perçue = <span id="val-length" style="color:#f59e0b;">50,0 m</span>
                    </div>
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
            this.updateLabels();
        }

        this.time = 0;
        this.bgOffset = 0;
        this.starOffset = 0;
        this.velocityRatio = 0.0;
        this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);

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
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2 + 0.5,
                baseAlpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    updateLabels: function() {
        const vKms = this.velocityRatio * this.cKmS;
        const vEl = document.getElementById('val-v-kms');
        const pcEl = document.getElementById('val-pc');
        const gEl = document.getElementById('val-gamma');
        const lEl = document.getElementById('val-length');

        if (vEl) vEl.textContent = this.formatKms(vKms);
        if (pcEl) pcEl.textContent = (this.velocityRatio * 100).toFixed(0) + ' % c';
        if (gEl) gEl.textContent = this.gamma.toFixed(2).replace('.', ',');
        if (lEl) lEl.textContent = (50 / this.gamma).toFixed(1).replace('.', ',') + ' m';
    },

    formatKms: function(kms) {
        return Math.round(kms).toLocaleString('fr-FR') + ' km/s';
    },

    reset: function() {
        this.time = 0;
        this.bgOffset = 0;
        this.starOffset = 0;
        this.velocityRatio = 0.0;
        this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);

        const slider = document.getElementById('slider-v');
        if (slider) slider.value = 0.0;
        this.updateLabels();
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 3; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('4_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(4); },

    drawFusee: function(ctx, x, y, length, color, showFlame = true) {
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
            const flameLength = (20 + Math.random() * 30) * (length / this.L0); 
            ctx.lineTo(x - halfL - flameLength, y);
            ctx.lineTo(x - halfL, y + halfH * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        const speedFactor = this.velocityRatio > 0.01 ? Math.pow(this.velocityRatio, 1.5) : 0;
        this.starOffset += this.baseScrollSpeed * speedFactor * 5 * dt * 1.5;

        // 1. Ciel fixe
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        // 2. Ciel mouvant
        ctx.save();
        this.movingStars.forEach(star => {
            let x = (star.x * width - this.starOffset) % width;
            if (x < 0) x += width;

            const trailLength = (1 + this.velocityRatio * this.velocityRatio * 80) / 2;

            if (trailLength > 3) {
                ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                ctx.lineWidth = star.size * 0.7;
                ctx.beginPath(); ctx.moveTo(x, star.y * height); ctx.lineTo(x - trailLength, star.y * height); ctx.stroke();
            } else {
                ctx.fillStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
                ctx.beginPath(); ctx.arc(x, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
            }
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        const displayL = this.L0 / this.gamma;

        // 3. Fantôme de la fusée au repos (L0) - FIXE
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const halfL0 = this.L0 / 2;
        const halfH0 = this.H0 / 2;
        ctx.moveTo(cx + halfL0, cy);
        ctx.quadraticCurveTo(cx + halfL0 * 0.7, cy - halfH0, cx + halfL0 * 0.5, cy - halfH0);
        ctx.lineTo(cx - halfL0 * 0.7, cy - halfH0);
        ctx.quadraticCurveTo(cx - halfL0, cy - halfH0 * 0.5, cx - halfL0, cy);
        ctx.quadraticCurveTo(cx - halfL0, cy + halfH0 * 0.5, cx - halfL0 * 0.7, cy + halfH0);
        ctx.lineTo(cx + halfL0 * 0.5, cy + halfH0);
        ctx.quadraticCurveTo(cx + halfL0 * 0.7, cy + halfH0, cx + halfL0, cy);
        ctx.stroke();
        ctx.restore();

        // 4. Fusée contractée (AVEC vibration)
        const vibrationX = (Math.random() - 0.5) * (this.velocityRatio * 6);
        const vibrationY = (Math.random() - 0.5) * (this.velocityRatio * 6);

        ctx.save();
        ctx.translate(vibrationX, vibrationY);
        this.drawFusee(ctx, cx, cy, displayL, '#06b6d4');
        ctx.restore();

        // 5. Indication
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Vu d'un point immobile — la fusée est contractée", cx, 40);

        // Comparaison des longueurs
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - this.L0/2, cy + 70); ctx.lineTo(cx + this.L0/2, cy + 70); ctx.stroke();
        ctx.fillStyle = '#f59e0b';
        ctx.font = '12px sans-serif';
        ctx.fillText(`50 m (au repos)`, cx, cy + 90);

        ctx.strokeStyle = '#06b6d4';
        ctx.beginPath(); ctx.moveTo(cx - displayL/2, cy + 110); ctx.lineTo(cx + displayL/2, cy + 110); ctx.stroke();
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`${(50/this.gamma).toFixed(1)} m (Longueur perçue)`, cx, cy + 130);
        ctx.restore();
    },

    destroy: function() {}
};