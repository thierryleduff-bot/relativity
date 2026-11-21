// =====================================================================
// CHAPITRE 9 — LA COURBURE DE L'ESPACE-TEMPS (ÉTAPE 2/4)
// ---------------------------------------------------------------------
// Le monde plat : sans masse, la grille est droite, le temps est uniforme.
// =====================================================================

window.Stages['9_1'] = {
    time: 0,
    stars: [],
    entities: [],
    
    clockPositions: [
        { x: 15, y: 20 }, { x: 50, y: 15 }, { x: 85, y: 25 },
        { x: 25, y: 45 }, { x: 75, y: 50 },
        { x: 10, y: 75 }, { x: 40, y: 80 }, { x: 60, y: 70 }, { x: 90, y: 85 },
        { x: 50, y: 50 }
    ],
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Le Monde Plat";
        if (numberEl) numberEl.textContent = "CHAPITRE 9 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. Sans masse, tout est plat</strong></p>
                <p>Voici notre point de départ : un espace sans masse.</p>
                <p>La grille est parfaitement droite. Les horloges battent toutes à la même fréquence.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">L'espace est plat, le temps s'écoule partout pareil. C'est notre point de référence.</p>
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

        this.entities = [];
        this.spawnEntity(true);
        this.spawnEntity(false);
    },

    reset: function() {
        this.time = 0;
        this.entities = [];
        this.spawnEntity(true);
        this.spawnEntity(false);
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('9_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('9'); },

    spawnEntity: function(isRocket) {
        const edge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = 0.01875; 

        if (edge === 0) { 
            x = Math.random(); y = -0.1; 
            vx = (Math.random() - 0.5) * 0.4; vy = speed;
        } else if (edge === 1) { 
            x = 1.1; y = Math.random(); 
            vx = -speed; vy = (Math.random() - 0.5) * 0.4;
        } else if (edge === 2) { 
            x = Math.random(); y = 1.1; 
            vx = (Math.random() - 0.5) * 0.4; vy = -speed;
        } else { 
            x = -0.1; y = Math.random(); 
            vx = speed; vy = (Math.random() - 0.5) * 0.4;
        }

        const len = Math.sqrt(vx*vx + vy*vy);
        vx = (vx / len) * speed;
        vy = (vy / len) * speed;

        this.entities.push({
            x, y, vx, vy,
            isRocket: isRocket,
            hasTurned: false
        });
    },

    updateEntities: function(dt) {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const e = this.entities[i];
            
            e.x += e.vx * dt;
            e.y += e.vy * dt;

            if (e.isRocket && !e.hasTurned) {
                if (Math.random() < 0.25 * dt) {
                    const angle = Math.atan2(e.vy, e.vx) + (Math.PI / 4) * (Math.random() > 0.5 ? 1 : -1);
                    const speed = Math.sqrt(e.vx*e.vx + e.vy*e.vy);
                    e.vx = Math.cos(angle) * speed;
                    e.vy = Math.sin(angle) * speed;
                    e.hasTurned = true;
                }
            }

            if (e.x < -0.2 || e.x > 1.2 || e.y < -0.2 || e.y > 1.2) {
                this.entities.splice(i, 1);
            }
        }

        if (this.entities.length < 2) {
            const hasRocket = this.entities.some(e => e.isRocket);
            const hasImpactor = this.entities.some(e => !e.isRocket);
            
            if (!hasRocket) this.spawnEntity(true);
            else if (!hasImpactor) this.spawnEntity(false);
        }
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

    drawEntity: function(ctx, e, width, height) {
        const px = e.x * width;
        const py = e.y * height;
        const angle = Math.atan2(e.vy, e.vx);
        const alpha = 0.7;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.globalAlpha = alpha;

        if (e.isRocket) {
            const L = 20;
            const H = 6;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.moveTo(L/2, 0);
            ctx.quadraticCurveTo(L/4, -H/2, 0, -H/2);
            ctx.lineTo(-L/2, -H/2);
            ctx.lineTo(-L/2, H/2);
            ctx.lineTo(0, H/2);
            ctx.quadraticCurveTo(L/4, H/2, L/2, 0);
            ctx.closePath();
            ctx.fill(); 
            ctx.stroke();

            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(-L/2, -H/3);
            ctx.lineTo(-L/2 - 8, 0);
            ctx.lineTo(-L/2, H/3);
            ctx.fill();

        } else {
            const r = 7;
            const grad = ctx.createRadialGradient(-r*0.3, -r*0.3, 1, 0, 0, r);
            grad.addColorStop(0, '#f1f5f9');
            grad.addColorStop(1, '#475569');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fill();
        }

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

        const spacing = 48;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;

        for (let y = 0; y < height; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }
        for (let x = 0; x < width; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }

        this.updateEntities(dt);
        this.entities.forEach(e => this.drawEntity(ctx, e, width, height));

        const clockAngle = ((this.time / 16) % 1) * Math.PI * 2;
        
        this.clockPositions.forEach(pos => {
            const x = (pos.x / 100) * width;
            const y = (pos.y / 100) * height;
            this.drawClock(ctx, x, y, 30, clockAngle, '#38bdf8');
        });

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Sans masse : espace plat, temps uniforme.", cx, height - 40);

        ctx.restore();
    },

    destroy: function() {}
};