// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 1/6)
// ---------------------------------------------------------------------
// Lorentz : Le décor (formule, fusées, horloges).
// =====================================================================

window.Stages[7] = {
    time: 0,
    stars: [],
    L0: 192,
    H0: 38,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "Le facteur de Lorentz";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Le facteur de Lorentz</strong></p>
                <p>Ce chapitre est la conclusion de la relativité restreinte. Nous allons voir la formule qui relie tout ce qu'on a appris.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
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
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('7_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('6_1'); },

    // Dessin de la formule gamma (typographie mathématique soignée)
    drawGammaFormula: function(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        const textColor = '#f8fafc';
        ctx.fillStyle = textColor;
        ctx.strokeStyle = textColor;
        ctx.textBaseline = 'middle';

        // --- 1. GAMMA ET EGAL ---
        ctx.textAlign = 'center';
        ctx.font = 'italic 46px "Georgia", "Times New Roman", serif';
        ctx.fillText("γ", -135, 2);

        ctx.font = '40px "Georgia", "Times New Roman", serif';
        ctx.fillText("=", -75, 2);

        // --- 2. BARRE DE FRACTION PRINCIPALE ---
        const fracStartX = -30;
        const fracEndX = 145;
        const fracCenterX = (fracStartX + fracEndX) / 2;
        const mainBarY = -12;

        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(fracStartX, mainBarY);
        ctx.lineTo(fracEndX, mainBarY);
        ctx.stroke();

        // Numérateur : 1
        ctx.font = '34px "Georgia", "Times New Roman", serif';
        ctx.fillText("1", fracCenterX, mainBarY - 26);

        // --- 3. RACINE CARRÉE (DÉNOMINATEUR) ---
        const sqrtStartX = -18;
        const sqrtTopY = mainBarY + 14;
        const sqrtBottomY = mainBarY + 68;
        const sqrtEndX = 135;

        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'miter';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sqrtStartX, sqrtTopY + 26);
        ctx.lineTo(sqrtStartX + 6, sqrtTopY + 22);
        ctx.lineTo(sqrtStartX + 16, sqrtBottomY);
        ctx.lineTo(sqrtStartX + 30, sqrtTopY);
        ctx.lineTo(sqrtEndX, sqrtTopY);
        ctx.stroke();

        // --- 4. CONTENU SOUS LA RACINE : 1 - v²/c² ---
        const innerY = sqrtTopY + 32;

        ctx.font = '32px "Georgia", "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText("1 −", sqrtStartX + 34, innerY);

        const subFracStartX = 82;
        const subFracEndX = 128;
        const subFracCenterX = (subFracStartX + subFracEndX) / 2;

        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(subFracStartX, innerY);
        ctx.lineTo(subFracEndX, innerY);
        ctx.stroke();

        const drawSquaredTerm = (letter, cx, cy) => {
            ctx.textAlign = 'center';
            ctx.font = 'italic 26px "Georgia", "Times New Roman", serif';
            ctx.fillText(letter, cx - 4, cy);

            ctx.font = '16px "Georgia", "Times New Roman", serif';
            ctx.fillText("2", cx + 9, cy - 8);
        };

        drawSquaredTerm("v", subFracCenterX, innerY - 15);
        drawSquaredTerm("c", subFracCenterX, innerY + 18);

        ctx.restore();
    },

    // Dessin de la fusée (reprise du chap 4)
    drawFusee: function(ctx, x, y, length, color, isVertical = false) {
        const halfL = length / 2;
        const halfH = this.H0 / 2;

        ctx.save();
        ctx.translate(x, y);
        if (isVertical) {
            ctx.rotate(-Math.PI / 2);
        }
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(halfL, 0);
        ctx.quadraticCurveTo(halfL * 0.7, -halfH, halfL * 0.5, -halfH);
        ctx.lineTo(-halfL * 0.7, -halfH);
        ctx.quadraticCurveTo(-halfL, -halfH * 0.5, -halfL, 0);
        ctx.quadraticCurveTo(-halfL, halfH * 0.5, -halfL * 0.7, halfH);
        ctx.lineTo(halfL * 0.5, halfH);
        ctx.quadraticCurveTo(halfL * 0.7, halfH, halfL, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Ailerons
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(-halfL * 0.7, -halfH);
        ctx.lineTo(-halfL * 0.7 - (length * 0.15), -halfH - (this.H0 * 0.4));
        ctx.lineTo(-halfL, 0);
        ctx.lineTo(-halfL * 0.7 - (length * 0.15), halfH + (this.H0 * 0.4));
        ctx.lineTo(-halfL * 0.7, halfH);
        ctx.fill();

        // Hublots
        ctx.fillStyle = `${color}88`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        const frontX = halfL * 0.6;
        const backX = -halfL * 0.2;
        const spanX = frontX - backX;
        
        for (let i = 0; i < 5; i++) {
            const wx = backX + (spanX / 4) * i;
            const winRadius = 4;
            ctx.beginPath();
            ctx.arc(wx, -halfH * 0.4, winRadius, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        }

        ctx.restore();
    },

    drawClock: function(ctx, x, y, radius, angle, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = i % 3 === 0 ? radius - 5 : radius - 2;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
            ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
            ctx.stroke();
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle - Math.PI / 2) * (radius * 0.7), y + Math.sin(angle - Math.PI / 2) * (radius * 0.7));
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); 
        ctx.arc(x, y, 3, 0, Math.PI * 2); 
        ctx.fill();

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); 
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;

        // 1. La formule
        this.drawGammaFormula(ctx, cx, 80);

        // 2. Ligne de séparation
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, 160);
        ctx.lineTo(cx, height - 40);
        ctx.stroke();
        ctx.restore();

        // 3. Panneau de gauche (Fusée verticale + pas de tir)
        const leftX = width * 0.25;
        
        const groundY = height * 0.75;
        const rocketY = groundY - this.L0/2 - 10; 
        
        const clockY = rocketY - this.L0/2 - 50;
        const clockAngleLeft = (this.time * 1.5) % (Math.PI * 2);
        this.drawClock(ctx, leftX, clockY, 22, clockAngleLeft, '#38bdf8');
        
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.rect(0, groundY, width/2, height - groundY); 
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width/2, groundY);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.beginPath(); 
        ctx.moveTo(leftX + 50, groundY); 
        ctx.lineTo(leftX + 50, rocketY - this.L0/2 - 20); 
        ctx.stroke();
        
        ctx.lineWidth = 4;
        ctx.beginPath(); 
        ctx.moveTo(leftX + 50, rocketY - this.L0*0.2); 
        ctx.lineTo(leftX + 20, rocketY - this.L0*0.2); 
        ctx.stroke();
        ctx.beginPath(); 
        ctx.moveTo(leftX + 50, rocketY + this.L0*0.2); 
        ctx.lineTo(leftX + 20, rocketY + this.L0*0.2); 
        ctx.stroke();

        this.drawFusee(ctx, leftX, rocketY, this.L0, '#38bdf8', true);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Fusée au repos (Terre)", leftX, groundY + 30);

        // 4. Panneau de droite (Fusée horizontale)
        const rightX = width * 0.75;
        const rightY = rocketY; 

        const clockAngleRight = (this.time * 1.5) % (Math.PI * 2);
        this.drawClock(ctx, rightX, clockY, 22, clockAngleRight, '#f59e0b');
        
        this.drawFusee(ctx, rightX, rightY, this.L0, '#f59e0b', false);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Fusée en mouvement", rightX, rightY + 60);

        ctx.restore();
    },

    destroy: function() {}
};