// =====================================================================
// CHAPITRE 5 — LA SIMULTANÉITÉ (ÉTAPE 2/2)
// ---------------------------------------------------------------------
// Vue depuis le train. Le monde défile. Les éclairs tombent, mais
// l'observateur reçoit la lumière de l'avant en premier.
// =====================================================================

window.Stages['5_1'] = {
    time: 0,
    stars: [],
    movingStars: [],
    starOffset: 0,
    
    cycleTime: 0,
    phase: 0, // 0: Attente, 1: Flash, 2: Traits, 3: Fin
    
    L0: 600,
    H0: 100,
    
    flashProgress: 0,
    hitObserver: false,
    hitFlashAlpha: 0, // NOUVEAU : feedback visuel

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
                <p><strong>2. L'observation (dans le train)</strong></p>
                <p>Pour l'observateur dans le train, c'est le monde qui défile.</p>
                <p>Les éclairs tombent sur les parois. La lumière parcourt la même distance pour l'atteindre.</p>
                <p>Mais l'observateur reçoit la lumière provenant de l'avant <strong>avant</strong> celle provenant de l'arrière.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Puisque la vitesse de la lumière est constante pour lui, il en déduit que l'éclair avant s'est produit physiquement avant l'éclair arrière. La simultanéité est brisée.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.cycleTime = 0;
        this.phase = 0;
        this.starOffset = 0;
        this.hitObserver = false;
        this.hitFlashAlpha = 0;
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

        this.movingStars = [];
        for (let i = 0; i < 80; i++) {
            this.movingStars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 2 + 0.5,
                baseAlpha: Math.random() * 0.5 + 0.2
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.cycleTime = 0;
        this.phase = 0;
        this.starOffset = 0;
        this.hitObserver = false;
        this.hitFlashAlpha = 0;
        this.flashProgress = 0;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 2; },
    nextStep: function() {},
    prevStep: function() { if (window.Engine) window.Engine.loadStage(5); },

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

        // 1. Fond étoilé fixe
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        // 2. Ciel mouvant (le monde défile)
        this.starOffset += 150 * dt;
        ctx.save();
        this.movingStars.forEach(star => {
            let x = (star.x * width - this.starOffset) % width;
            if (x < 0) x += width;
            ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
            ctx.lineWidth = star.size * 0.7;
            ctx.beginPath(); ctx.moveTo(x, star.y * height); ctx.lineTo(x - 20, star.y * height); ctx.stroke();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;
        const trainX = cx - this.L0 / 2;

        // 3. Sol et traverses qui défilent
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, cy + this.H0/2 + 20, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, cy + this.H0/2 + 20); ctx.lineTo(width, cy + this.H0/2 + 20); ctx.stroke();
        
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        for (let i = 0; i < width + 100; i += 50) {
            let x = (i - this.starOffset) % width;
            if (x < 0) x += width;
            ctx.beginPath(); ctx.moveTo(x, cy + this.H0/2 + 15); ctx.lineTo(x, cy + this.H0/2 + 25); ctx.stroke();
        }
        ctx.restore();

        // 4. Logique
        if (this.phase === 0) {
            if (this.cycleTime > 3) {
                this.phase = 1;
                this.cycleTime = 0;
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
            // L'observateur reçoit la lumière de l'avant en premier
            if (!this.hitObserver && this.flashProgress > 200) {
                this.hitObserver = true;
                this.hitFlashAlpha = 1.0; // Déclenche le feedback
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
            if (this.flashProgress > 400) {
                this.phase = 3;
                this.cycleTime = 0;
            }
        } else if (this.phase === 3) {
            if (this.cycleTime > 3) this.reset();
        }

        // 5. Dessin du train (fixe)
        this.drawTrain(ctx, trainX, cy);

        // Observateur
        this.drawMan(ctx, cx, cy - 20, '#94a3b8');
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Observateur", cx, cy + 50);
        ctx.restore();

        // 6. Flashs
        if (this.phase === 1) {
            ctx.fillStyle = `rgba(253, 224, 71, ${1 - (this.cycleTime/0.5)})`;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 4;
            
            // Éclair avant
            ctx.beginPath(); 
            ctx.moveTo(trainX + this.L0, cy - 100);
            ctx.lineTo(trainX + this.L0 - 10, cy - 50);
            ctx.lineTo(trainX + this.L0 + 5, cy - 20);
            ctx.lineTo(trainX + this.L0, cy);
            ctx.stroke();

            // Éclair arrière
            ctx.beginPath(); 
            ctx.moveTo(trainX, cy - 100);
            ctx.lineTo(trainX + 10, cy - 50);
            ctx.lineTo(trainX - 5, cy - 20);
            ctx.lineTo(trainX, cy);
            ctx.stroke();
        }

        // 7. Traits de lumière
        if (this.phase >= 2) {
            const xLeft = trainX;
            const xRight = trainX + this.L0;
            
            ctx.save();
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 10;

            const leftDist = cx - xLeft;
            const rightDist = xRight - cx;

            const progress = Math.min(1, this.flashProgress / 400);

            // Trait gauche (part de la paroi, va vers le centre)
            ctx.beginPath();
            ctx.moveTo(xLeft, cy);
            ctx.lineTo(xLeft + leftDist * progress, cy);
            ctx.stroke();

            // Trait droit (part de la paroi, va vers le centre)
            ctx.beginPath();
            ctx.moveTo(xRight, cy);
            ctx.lineTo(xRight - rightDist * progress, cy);
            ctx.stroke();

            ctx.restore();

            // Impact final
            if (this.phase === 3) {
                ctx.save();
                ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0, 1 - this.cycleTime)})`;
                ctx.beginPath(); 
                ctx.arc(cx, cy, 40, 0, Math.PI * 2); 
                ctx.fill();
                ctx.restore();
            }
        }

        // 8. Feedback visuel quand l'observateur est touché
        if (this.hitFlashAlpha > 0) {
            this.hitFlashAlpha -= dt * 2; // Disparaît en 0.5s
            if (this.hitFlashAlpha < 0) this.hitFlashAlpha = 0;
            
            ctx.save();
            ctx.fillStyle = `rgba(253, 224, 71, ${this.hitFlashAlpha * 0.6})`;
            ctx.beginPath(); 
            ctx.arc(cx, cy, 60, 0, Math.PI * 2); 
            ctx.fill();
            ctx.restore();
        }

        // Message
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Dans le train, la lumière de l'avant arrive avant celle de l'arrière.", cx, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};