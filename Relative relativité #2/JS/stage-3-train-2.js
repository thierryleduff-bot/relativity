// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 3/7)
// ---------------------------------------------------------------------
// Comparaison : wagon au repos (haut) vs wagon en mouvement (bas).
// =====================================================================

window.Stages['3_2'] = {
    time: 0,
    stars: [],
    
    topPhotonY: 0,
    topPhotonDir: -1,
    topTics: 0,
    
    bottomWagonX: 0,
    bottomPhotonY: 0,
    bottomPhotonDir: -1,
    bottomTics: 0,
    bottomTrail: [],
    isFinished: false,
    isStarted: false,
    
    WAGON_W: 200,
    WAGON_H: 120,
    C: 100,
    V: 40,
    maxTics: 100,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La comparaison";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. La comparaison</strong></p>
                <p>En haut : le wagon est au repos. Le photon monte et descend verticalement.</p>
                <p>En bas : le wagon avance. Le photon doit suivre le wagon. Son trajet devient un <strong>zigzag</strong>, donc plus long.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Pourtant, la vitesse de la lumière est la même. Regardez les compteurs.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.stars = [];
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
        this.isFinished = false;
        this.isStarted = false;
        
        this.topPhotonY = this.WAGON_H / 2;
        this.topPhotonDir = -1;
        this.topTics = 0;
        
        this.bottomWagonX = -this.WAGON_W;
        this.bottomPhotonY = this.WAGON_H / 2;
        this.bottomPhotonDir = -1;
        this.bottomTics = 0;
        this.bottomTrail = [];
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('3_3'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('3_1'); },

    draw: function(ctx, width, height, dt) {
        if (!this.isFinished) this.time += dt;

        if (!this.isStarted && this.bottomWagonX > -this.WAGON_W / 2) {
            this.isStarted = true;
        }

        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const midY = height / 2;
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, midY); ctx.lineTo(width, midY);
        ctx.stroke();
        ctx.restore();

        this.drawCounters(ctx, width, height);
        this.drawTopPanel(ctx, width, height, midY, dt);
        this.drawBottomPanel(ctx, width, height, midY, dt);
    },

    drawTopPanel: function(ctx, width, height, midY, dt) {
        const cx = width / 2;
        const cy = height / 4 + 30; 
        const halfH = this.WAGON_H / 2;
        const halfW = this.WAGON_W / 2;

        if (this.isStarted && !this.isFinished) {
            this.topPhotonY += this.C * this.topPhotonDir * dt;
            
            if (this.topPhotonY <= -halfH) {
                this.topPhotonY = -halfH;
                if (this.topPhotonDir === -1) {
                    this.topPhotonDir = 1;
                    if (window.SoundUtils) window.SoundUtils.playBeep(880, 0.03, 0.02);
                }
            } else if (this.topPhotonY >= halfH) {
                this.topPhotonY = halfH;
                if (this.topPhotonDir === 1) {
                    this.topPhotonDir = -1;
                    this.topTics++;
                    if (this.topTics > this.maxTics) this.topTics = 0;
                    if (window.SoundUtils) window.SoundUtils.playBeep(587, 0.03, 0.02);
                }
            }
        }

        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.fillRect(0, cy + halfH + 20, width, height / 4 - 60);
        ctx.restore();

        this.drawWagon(ctx, cx, cy, this.WAGON_W, this.WAGON_H, '#38bdf8');
        this.drawPhoton(ctx, cx, cy + this.topPhotonY);
        this.drawMan(ctx, cx + 140, cy + halfH + 50, '#38bdf8', false);
    },

    drawBottomPanel: function(ctx, width, height, midY, dt) {
        const cy = 3 * height / 4;
        const halfH = this.WAGON_H / 2;
        const halfW = this.WAGON_W / 2;

        if (!this.isFinished) {
            this.bottomWagonX += this.V * dt;
            if (this.bottomWagonX > width - halfW - 20) {
                this.bottomWagonX = width - halfW - 20;
                this.isFinished = true;
            }
        }

        const vy = Math.sqrt(this.C * this.C - this.V * this.V);

        if (this.isStarted && !this.isFinished) {
            this.bottomPhotonY += vy * this.bottomPhotonDir * dt;
            
            if (this.bottomPhotonY <= -halfH) {
                this.bottomPhotonY = -halfH;
                if (this.bottomPhotonDir === -1) {
                    this.bottomPhotonDir = 1;
                    if (window.SoundUtils) window.SoundUtils.playBeep(1100, 0.03, 0.02);
                }
            } else if (this.bottomPhotonY >= halfH) {
                this.bottomPhotonY = halfH;
                if (this.bottomPhotonDir === 1) {
                    this.bottomPhotonDir = -1;
                    this.bottomTics++;
                    if (this.bottomTics > this.maxTics) this.bottomTics = 0;
                    if (window.SoundUtils) window.SoundUtils.playBeep(700, 0.03, 0.02);
                }
            }
        }

        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
        ctx.fillRect(0, cy + halfH + 20, width, height / 4 - 60);
        ctx.restore();

        if (this.bottomTrail.length > 1) {
            ctx.save();
            ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < this.bottomTrail.length; i++) {
                const pt = this.bottomTrail[i];
                if (i === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            ctx.restore();
        }

        this.drawWagon(ctx, this.bottomWagonX, cy, this.WAGON_W, this.WAGON_H, '#22c55e');
        this.drawPhoton(ctx, this.bottomWagonX, cy + this.bottomPhotonY);

        if (this.isStarted && !this.isFinished && this.bottomWagonX > 0 && this.bottomWagonX < width) {
            this.bottomTrail.push({ x: this.bottomWagonX, y: cy + this.bottomPhotonY });
            if (this.bottomTrail.length > 1000) this.bottomTrail.shift();
        }
        
        this.drawMan(ctx, width / 2 + 150, cy + halfH + 50, '#38bdf8', false);
    },

    drawCounters: function(ctx, width, height) {
        const y = 40;
        const cx1 = width / 2 - 80;
        const cx2 = width / 2 + 80;
        
        ctx.save();
        ctx.fillStyle = this.isFinished ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = this.isFinished ? 2 : 1;
        ctx.shadowColor = this.isFinished ? '#38bdf8' : 'transparent';
        ctx.shadowBlur = this.isFinished ? 10 : 0;
        ctx.beginPath();
        ctx.roundRect(cx1 - 60, y - 25, 120, 50, 6);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.topTics}`, cx1, y - 5);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('REPOS', cx1, y + 15);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = this.isFinished ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = this.isFinished ? 2 : 1;
        ctx.shadowColor = this.isFinished ? '#22c55e' : 'transparent';
        ctx.shadowBlur = this.isFinished ? 10 : 0;
        ctx.beginPath();
        ctx.roundRect(cx2 - 60, y - 25, 120, 50, 6);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${this.bottomTics}`, cx2, y - 5);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('MOUVEMENT', cx2, y + 15);
        ctx.restore();
    },

    drawWagon: function(ctx, x, y, w, h, color) {
        const halfW = w / 2;
        const halfH = h / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - halfW, y - halfH, w, h, 8);
        ctx.fill(); ctx.stroke();

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 40, y - halfH); ctx.lineTo(x + 40, y - halfH);
        ctx.moveTo(x - 40, y + halfH); ctx.lineTo(x + 40, y + halfH);
        ctx.stroke();
        ctx.restore();
    },

    drawPhoton: function(ctx, x, y) {
        ctx.save();
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },

    drawMan: function(ctx, x, y, color, isMoving) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - 20, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - 3, y - 14, 6, 14);
        ctx.fillRect(x - 5, y, 4, 8);
        ctx.fillRect(x + 1, y, 4, 8);
        ctx.fillRect(x - 8, y - 10, 5, 2);
        ctx.fillRect(x + 3, y - 10, 5, 2);
        ctx.restore();
    },

    destroy: function() {}
};