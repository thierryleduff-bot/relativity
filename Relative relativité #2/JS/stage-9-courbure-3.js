// =====================================================================
// CHAPITRE 9 — LA COURBURE DE L'ESPACE-TEMPS (ÉTAPE 4/4)
// ---------------------------------------------------------------------
// Synthèse : espace et temps ne sont pas séparés.
// =====================================================================

window.Stages['9_3'] = {
    time: 0,
    stars: [],
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Une Seule Réalité";
        if (numberEl) numberEl.textContent = "CHAPITRE 9 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. Une seule réalité</strong></p>
                <p>La masse courbe l'espace. La masse courbe le temps.</p>
                <p>Ce ne sont pas deux effets séparés. C'est un seul et même phénomène : <strong>la courbure de l'espace-temps</strong>.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">L'espace et le temps ne sont pas des décors fixes. Ils réagissent à la présence de la masse.</p>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #94a3b8;">
                    L'image du puits gravitationnel, au chapitre 10, est une autre façon de représenter cette courbure.
                </p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
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
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('9_4'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('9_2'); },

    traceLine: function(ctx, startX, startY, initialAngle, cx, cy, width, height, masse) {
        const dxLine = Math.cos(initialAngle);
        const dyLine = Math.sin(initialAngle);
        const dxToCenter = cx - startX;
        const dyToCenter = cy - startY;
        const cross = dxToCenter * dyLine - dyToCenter * dxLine;
        const minDist = Math.abs(cross);
        
        const innerRadius = 30;
        const ignoreDeviation = (minDist < innerRadius);

        let px = startX;
        let py = startY;
        let angle = initialAngle;
        
        ctx.beginPath();
        ctx.moveTo(px, py);

        const stepSize = 5; 
        let maxSteps = 600; 

        while (maxSteps > 0) {
            if (px < -150 || px > width + 150 || py < -150 || py > height + 150) break;

            if (!ignoreDeviation) {
                const dx = cx - px;
                const dy = cy - py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 350) {
                    const force = (masse / 100) * 0.065; 
                    const influence = Math.pow(1 - (dist / 350), 2);
                    const angleVersMasse = Math.atan2(dy, dx);
                    
                    let diff = angleVersMasse - angle;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;

                    let delta = diff * force * influence;
                    if (delta > 0.05) delta = 0.05;
                    if (delta < -0.05) delta = -0.05;

                    angle += delta;
                }
            }

            px += Math.cos(angle) * stepSize;
            py += Math.sin(angle) * stepSize;

            ctx.lineTo(px, py);
            maxSteps--;
        }
        ctx.stroke();
    },

    drawMass: function(ctx, x, y, radius) {
        if (radius <= 0) return;
        
        const grad = ctx.createRadialGradient(
            x - radius * 0.35, y - radius * 0.35, radius * 0.05,
            x, y, radius
        );
        grad.addColorStop(0, '#f1f5f9');
        grad.addColorStop(0.3, '#94a3b8');
        grad.addColorStop(0.7, '#475569');
        grad.addColorStop(1, '#1e293b');

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.beginPath(); 
        ctx.arc(x, y, radius, 0, Math.PI * 2); 
        ctx.fill();
        ctx.shadowBlur = 0;
    },

    drawClock: function(ctx, x, y, radius, angle, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = i % 3 === 0 ? radius - 6 : radius - 3;
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

        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.5})`;
            ctx.beginPath(); 
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); 
            ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        const cy = height / 2;

        const gridAlpha = 0.25;
        const masse = 80;

        const spacing = 48;
        let idx = 0;
        
        for (let y = 0; y < height; y += spacing) {
            const isEven = (idx % 2 === 0);
            const baseAlpha = isEven ? 0.5 : 0.2;
            ctx.strokeStyle = `rgba(56, 189, 248, ${baseAlpha * gridAlpha})`;
            ctx.lineWidth = 1;
            this.traceLine(ctx, -spacing, y, 0, cx, cy, width, height, masse);
            idx++;
        }

        idx = 0;
        for (let x = 0; x < width; x += spacing) {
            const isEven = (idx % 2 === 0);
            const baseAlpha = isEven ? 0.5 : 0.2;
            ctx.strokeStyle = `rgba(56, 189, 248, ${baseAlpha * gridAlpha})`;
            ctx.lineWidth = 1;
            this.traceLine(ctx, x, -spacing, Math.PI / 2, cx, cy, width, height, masse);
            idx++;
        }

        this.drawMass(ctx, cx, cy, 30);

        const baseSpeed = (Math.PI * 2) / 16;
        
        const clocks = [
            { x: 0.15, y: 0.25, radius: 25 },
            { x: 0.85, y: 0.25, radius: 25 },
            { x: 0.2, y: 0.75, radius: 25 },
            { x: 0.8, y: 0.75, radius: 25 },
            { x: 0.5, y: 0.2, radius: 25 },
            { x: 0.65, y: 0.5, radius: 25 }
        ];

        clocks.forEach((clock, i) => {
            const x = clock.x * width;
            const y = clock.y * height;
            
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const r = Math.max(dist, 30);
            const intensity = (masse / 100) * 8000;
            const factor = 1 / (1 + intensity / (r * r));
            const slowFactor = Math.max(0.15, factor);
            
            const offset = (i * Math.PI) / 3;
            const localAngle = (this.time * baseSpeed * slowFactor) + offset;
            
            this.drawClock(ctx, x, y, clock.radius, localAngle, '#38bdf8', 0.9);
        });

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Espace et temps sont un seul et même tissu.", cx, height - 60);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 14px sans-serif';
        ctx.fillText("C'est la courbure de l'espace-temps.", cx, height - 35);

        ctx.restore();
    },

    destroy: function() {}
};