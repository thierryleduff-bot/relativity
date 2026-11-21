// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 2/7)
// ---------------------------------------------------------------------
// L'horloge à lumière au repos.
// =====================================================================

window.Stages['3_1'] = {
    time: 0,
    stars: [],
    bgOffset: 0,
    
    photonY: 0,
    photonDir: -1,
    tics: 0,
    maxTics: 100,
    
    WAGON_W: 200,
    WAGON_H: 150,
    C: 100,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "L'horloge à lumière";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. L'horloge au repos</strong></p>
                <p>Pour mesurer le temps, on utilise une <strong>horloge à lumière</strong> : un wagon avec deux miroirs.</p>
                <p>Un photon part du miroir du bas, monte, touche le miroir du haut, puis redescend.</p>
                <p>Un <strong>"tic"</strong> = un aller-retour complet.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Le temps, c'est ce que mesure cette horloge.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.bgOffset = 0;
        this.photonY = this.WAGON_H / 2;
        this.photonDir = -1;
        this.tics = 0;
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

    reset: function() {
        this.time = 0;
        this.bgOffset = 0;
        this.photonY = this.WAGON_H / 2;
        this.photonDir = -1;
        this.tics = 0;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('3_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(3); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.bgOffset += 20 * dt;

        ctx.save();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
        ctx.lineWidth = 1;
        const spacing = 40;
        const offset = (this.bgOffset % spacing);
        for (let x = -spacing; x < width + spacing; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x - offset, 0); ctx.lineTo(x - offset, height); ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        const halfH = this.WAGON_H / 2;
        const halfW = this.WAGON_W / 2;

        this.photonY += this.C * this.photonDir * dt;

        if (this.photonY <= -halfH) {
            this.photonY = -halfH;
            if (this.photonDir === -1) {
                this.photonDir = 1;
                if (window.SoundUtils) window.SoundUtils.playBeep(880, 0.03, 0.02);
            }
        } else if (this.photonY >= halfH) {
            this.photonY = halfH;
            if (this.photonDir === 1) {
                this.photonDir = -1;
                this.tics++;
                if (this.tics > this.maxTics) this.tics = 0;
                if (window.SoundUtils) window.SoundUtils.playBeep(587, 0.03, 0.02);
            }
        }

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx - halfW, cy - halfH, this.WAGON_W, this.WAGON_H, 8);
        ctx.fill(); ctx.stroke();

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx - 40, cy - halfH); ctx.lineTo(cx + 40, cy - halfH);
        ctx.moveTo(cx - 40, cy + halfH); ctx.lineTo(cx + 40, cy + halfH);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, cy - halfH);
        ctx.lineTo(cx, cy + halfH);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy + this.photonY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Tics : ${this.tics}`, cx, cy + halfH + 60);
        ctx.restore();
    },

    destroy: function() {}
};