// =====================================================================
// CHAPITRE 5 — LA SIMULTANÉITÉ (ÉTAPE 1/2)
// ---------------------------------------------------------------------
// Vue depuis le quai. Le train avance et s'arrête. Les éclairs sont
// simultanés, les traits de lumière arrivent en même temps au centre.
// =====================================================================

window.Stages[5] = {
    time: 0,
    stars: [],
    
    cycleTime: 0,
    phase: 0, // 0: Approche, 1: Flash, 2: Traits, 3: Fin
    
    trainX: 0,
    trainV: 150,
    L0: 600,
    H0: 100,
    
    flashProgress: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La Simultanéité";
        if (numberEl) numberEl.textContent = "CHAPITRE 5 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. Le constat (sur le quai)</strong></p>
                <p>Un train traverse la gare.</p>
                <p>Deux éclairs frappent ses extrémités au même moment.</p>
                <p>L'observateur est exactement au milieu.</p>
                <p>La lumière des deux éclairs parcourt la même distance.</p>
                <p>Il reçoit les deux signaux en même temps. Les éclairs sont simultanés.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.cycleTime = 0;
        this.phase = 0;
        this.trainX = -this.L0;
        this.flashProgress = 0;
        
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
        this.cycleTime = 0;
        this.phase = 0;
        this.trainX = -this.L0;
        this.flashProgress = 0;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('5_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('4_2'); },

    drawMan: function(ctx, x, y, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - 10, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - 2, y - 5, 4, 8);
        ctx.fillRect(x - 7, y - 3, 14, 2);
        ctx.fillRect(x - 4, y + 3, 2, 6);
        ctx.fillRect(x + 2, y + 3, 2, 6);
        ctx.restore();
    },

    drawTrain: function(ctx, x, y) {
        const halfH = this.H0 / 2;
        
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(x + this.L0, y);
        ctx.quadraticCurveTo(x + this.L0 * 0.9, y - halfH, x + this.L0 * 0.7, y - halfH);
        ctx.lineTo(x, y - halfH);
        ctx.quadraticCurveTo(x - 20, y - halfH * 0.5, x - 20, y);
        ctx.quadraticCurveTo(x - 20, y + halfH * 0.5, x, y + halfH);
        ctx.lineTo(x + this.L0 * 0.7, y + halfH);
        ctx.quadraticCurveTo(x + this.L0 * 0.9, y + halfH, x + this.L0, y);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = `#06b6d488`;
        for (let i = 0; i < 7; i++) {
            const wx = x + this.L0 * 0.1 + (this.L0 * 0.1) * i;
            ctx.beginPath();
            ctx.roundRect(wx, y - halfH * 0.6, 20, 20, 4);
            ctx.fill();
        }

        ctx.fillStyle = '#334155';
        for (let i = 0; i < 4; i++) {
            const wx = x + this.L0 * 0.2 + (this.L0 * 0.2) * i;
            ctx.beginPath(); ctx.arc(wx, y + halfH + 10, 10, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.cycleTime += dt;

        // 1. Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;

        // Sol
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, cy + this.H0/2 + 20, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, cy + this.H0/2 + 20); ctx.lineTo(width, cy + this.H0/2 + 20); ctx.stroke();
        ctx.restore();

        // 2. Logique
        if (this.phase === 0) {
            this.trainX += this.trainV * dt;
            if (this.trainX >= cx - this.L0/2) {
                this.phase = 1;
                this.cycleTime = 0;
                this.trainX = cx - this.L0/2;
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
        } else if (this.phase === 1) {
            if (this.cycleTime > 0.5) {
                this.phase = 2;
                this.cycleTime = 0;
                this.flashProgress = 0;
            }
        } else if (this.phase === 2) {
            this.flashProgress += dt * 300;
            if (this.flashProgress > 400) {
                this.phase = 3;
                this.cycleTime = 0;
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
        } else if (this.phase === 3) {
            if (this.cycleTime > 3) this.reset();
        }

        // 3. Dessin du train
        this.drawTrain(ctx, this.trainX, cy);

        // Observateur dans le train
        this.drawMan(ctx, this.trainX + this.L0/2, cy - 20, '#94a3b8');

        // Observateur sur le quai (fixe au centre)
        this.drawMan(ctx, cx, cy + this.H0/2 + 20, '#38bdf8');
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Observateur", cx, cy + this.H0/2 + 50);
        ctx.restore();

        // 4. Flashs et traits de lumière
        if (this.phase === 1) {
            ctx.fillStyle = `rgba(253, 224, 71, ${1 - (this.cycleTime/0.5)})`;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 4;
            
            // Éclair avant
            ctx.beginPath(); 
            ctx.moveTo(this.trainX + this.L0, cy - 100);
            ctx.lineTo(this.trainX + this.L0 - 10, cy - 50);
            ctx.lineTo(this.trainX + this.L0 + 5, cy - 20);
            ctx.lineTo(this.trainX + this.L0, cy);
            ctx.stroke();

            // Éclair arrière
            ctx.beginPath(); 
            ctx.moveTo(this.trainX, cy - 100);
            ctx.lineTo(this.trainX + 10, cy - 50);
            ctx.lineTo(this.trainX - 5, cy - 20);
            ctx.lineTo(this.trainX, cy);
            ctx.stroke();
        }

        if (this.phase >= 2) {
            const xLeft = this.trainX;
            const xRight = this.trainX + this.L0;
            
            // Les traits de lumière vont des parois vers le centre
            ctx.save();
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 10;

            const leftDist = cx - xLeft;
            const rightDist = xRight - cx;

            // On anime la longueur des traits
            const progress = Math.min(1, this.flashProgress / 400);

            // Trait gauche (part de la paroi xLeft, va vers cx)
            ctx.beginPath();
            ctx.moveTo(xLeft, cy);
            ctx.lineTo(xLeft + leftDist * progress, cy);
            ctx.stroke();

            // Trait droit (part de la paroi xRight, va vers cx)
            ctx.beginPath();
            ctx.moveTo(xRight, cy);
            ctx.lineTo(xRight - rightDist * progress, cy);
            ctx.stroke();

            ctx.restore();

            // Impact final (les deux traits touchent en même temps)
            if (this.phase === 3) {
                ctx.save();
                ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0, 1 - this.cycleTime)})`;
                ctx.beginPath(); 
                ctx.arc(cx, cy, 40, 0, Math.PI * 2); 
                ctx.fill();
                ctx.restore();
            }
        }

        // Message
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Les deux traits de lumière ont la même longueur. Ils arrivent en même temps.", cx, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};