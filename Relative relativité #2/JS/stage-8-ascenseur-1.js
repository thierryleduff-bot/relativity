// =====================================================================
// CHAPITRE 8 — L'ASCENSEUR D'EINSTEIN (ÉTAPE 2/2)
// ---------------------------------------------------------------------
// Lumière et gravité. Courbe lisse, étoiles synchronisées.
// =====================================================================

window.Stages['8_1'] = {
    time: 0,
    stars: [],
    movingStars: [],
    starOffset: 0,
    starSpeed: 50,
    
    cycleTime: 0,
    phase: 0, // 0: Chauffe, 1: Tir, 2: Impact, 3: Fade out
    phaseTimer: 0,
    
    cabinW: 160,
    cabinH: 200,
    
    laserProgress: 0,
    showLaser: false,
    messageShown: false,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Lumière et Gravité";
        if (numberEl) numberEl.textContent = "CHAPITRE 8 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. La lumière dans l'ascenseur</strong></p>
                <p>Un rayon laser traverse la cabine horizontalement.</p>
                <p>Pendant que la lumière voyage, la cabine accélère vers le haut (à droite) ou la gravité l'attire (à gauche).</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Dans les deux cas, le rayon lumineux paraît courbé vers le bas.</p>
                <p style="font-size: 0.9rem; color: #cbd5e1; margin-top: 15px; border-left: 2px solid #06b6d4; padding-left: 10px;">
                    <em>Attention :</em> dans le référentiel de la cabine, le photon va parfaitement droit. C'est la cabine (ou le sol) qui accélère vers le haut pour le rattraper. Vu de l'extérieur, sa trajectoire est courbe. En relativité, une accélération courbe donc la lumière.
                </p>
                <p>Puisque la lumière est courbée par une accélération, elle doit l'être aussi par la gravité.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        
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
        this.starOffset = 0;
        this.starSpeed = 50;
        this.cycleTime = 0;
        this.phase = 0;
        this.phaseTimer = 0;
        this.laserProgress = 0;
        this.showLaser = false;
        this.messageShown = false;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 2; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('9'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(8); },

    drawMan: function(ctx, x, y, color) {
        const headRadius = 20;
        const bodyW = 14;
        const bodyH = 50;
        const legH = 45;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - legH - bodyH - headRadius, headRadius, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - bodyW/2, y - legH - bodyH, bodyW, bodyH);
        ctx.fillRect(x - bodyW * 1.5, y - legH - bodyH + 10, bodyW * 3, 6);
        ctx.fillRect(x - bodyW * 0.8, y - legH, 6, legH);
        ctx.fillRect(x + bodyW * 0.2, y - legH, 6, legH);
        ctx.restore();
    },

    drawCabin: function(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 8);
        ctx.fill(); ctx.stroke();
        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.cycleTime += dt;
        this.phaseTimer += dt;

        const halfWidth = width / 2;
        const cx = width / 2;
        const cy = height / 2;

        this.starSpeed += 20 * dt;
        this.starOffset += this.starSpeed * dt;

        // ZONE GAUCHE
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, halfWidth, height);
        
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(0, cy + this.cabinH / 2 + 10);
        ctx.quadraticCurveTo(halfWidth / 2, cy + this.cabinH / 2 - 5, halfWidth, cy + this.cabinH / 2 + 10);
        ctx.lineTo(halfWidth, height);
        ctx.lineTo(0, height);
        ctx.fill();
        
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(0, cy + this.cabinH / 2 + 10);
        ctx.quadraticCurveTo(halfWidth / 2, cy + this.cabinH / 2 - 5, halfWidth, cy + this.cabinH / 2 + 10);
        ctx.stroke();
        ctx.restore();

        // ZONE DROITE
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); 
            ctx.arc(halfWidth + star.x * halfWidth, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });

        this.movingStars.forEach(star => {
            let y = (star.y * height + this.starOffset) % height;
            if (y < 0) y += height;
            
            const trailLength = Math.max(2, this.starSpeed * 0.2);
            
            ctx.strokeStyle = `rgba(56, 189, 248, ${star.baseAlpha})`;
            ctx.lineWidth = star.size * 0.7;
            ctx.beginPath(); 
            ctx.moveTo(halfWidth + star.x * halfWidth, y); 
            ctx.lineTo(halfWidth + star.x * halfWidth, y - trailLength); 
            ctx.stroke();
        });
        ctx.restore();

        // LOGIQUE
        if (this.phase === 0) {
            if (this.phaseTimer > 5) {
                this.phase = 1;
                this.phaseTimer = 0;
                this.laserProgress = 0;
                this.showLaser = true;
                if (window.SoundUtils) window.SoundUtils.playTic();
            }
        } else if (this.phase === 1) {
            this.laserProgress += (this.cabinW / 1.0) * dt; 
            if (this.laserProgress > this.cabinW) {
                this.phase = 2;
                this.phaseTimer = 0;
                this.messageShown = true;
            }
        } else if (this.phase === 2) {
            if (this.phaseTimer > 5) {
                this.phase = 3;
                this.phaseTimer = 0;
            }
        } else if (this.phase === 3) {
            if (this.phaseTimer > 5) {
                this.reset();
            }
        }

        // DESSIN CABINES
        const leftX = width * 0.25;
        const rightX = width * 0.75;

        this.drawCabin(ctx, leftX, cy, this.cabinW, this.cabinH);
        this.drawCabin(ctx, rightX, cy, this.cabinW, this.cabinH);

        // Correction : y = cy + cabinH/2 pour poser les pieds sur le sol
        this.drawMan(ctx, leftX, cy + this.cabinH / 2, '#94a3b8');
        this.drawMan(ctx, rightX, cy + this.cabinH / 2, '#94a3b8');

        // LASER
        if (this.showLaser) {
            ctx.save();
            let alpha = 1.0;
            if (this.phase === 3) {
                alpha = 1.0 - (this.phaseTimer / 5);
            }

            ctx.strokeStyle = `rgba(253, 224, 71, ${alpha})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = `rgba(253, 224, 71, ${alpha})`;
            ctx.shadowBlur = 10;

            const laserY = cy - 40;

            // Laser gauche
            ctx.beginPath();
            ctx.moveTo(leftX - this.cabinW / 2, laserY);
            const leftEndX = leftX - this.cabinW / 2 + this.laserProgress;
            const leftEndY = laserY + (this.laserProgress / this.cabinW) * 70; 
            const cpLeftX = leftX - this.cabinW / 2 + (this.laserProgress / 2);
            const cpLeftY = laserY + (this.laserProgress / this.cabinW) * 15;
            ctx.quadraticCurveTo(cpLeftX, cpLeftY, leftEndX, leftEndY);
            ctx.stroke();

            // Laser droite
            ctx.beginPath();
            ctx.moveTo(rightX - this.cabinW / 2, laserY);
            const rightEndX = rightX - this.cabinW / 2 + this.laserProgress;
            const rightEndY = laserY + (this.laserProgress / this.cabinW) * 70;
            const cpRightX = rightX - this.cabinW / 2 + (this.laserProgress / 2);
            const cpRightY = laserY + (this.laserProgress / this.cabinW) * 15;
            ctx.quadraticCurveTo(cpRightX, cpRightY, rightEndX, rightEndY);
            ctx.stroke();

            ctx.restore();
        }

        // CHAUFFE (Point de départ)
        if (this.phase === 0 && this.phaseTimer > 2) {
            const alpha = (this.phaseTimer - 2) / 3;
            const laserY = cy - 40;
            ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
            ctx.beginPath(); 
            ctx.arc(leftX - this.cabinW / 2, laserY, 6, 0, Math.PI * 2); 
            ctx.fill();
            ctx.beginPath(); 
            ctx.arc(rightX - this.cabinW / 2, laserY, 6, 0, Math.PI * 2); 
            ctx.fill();
        }

        // TEXTES
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Sur Terre", leftX, cy - this.cabinH/2 - 20);
        
        const accel = Math.min(15, 5 + this.cycleTime * 0.3).toFixed(1);
        ctx.fillText(`Dans l'espace (accélération : ${accel} m/s²)`, rightX, cy - this.cabinH/2 - 20);

        if (this.messageShown) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText("La gravité courbe la lumière.", cx, height - 60);
        }
        ctx.restore();
    },

    destroy: function() {}
};