// =====================================================================
// CHAPITRE 12 — LES TROUS NOIRS (ÉTAPE 2/5)
// ---------------------------------------------------------------------
// La vitesse de libération : 5 tirs pour comprendre qu'il faut aller
// de plus en plus vite pour s'échapper.
// =====================================================================

window.Stages['12_1'] = {
    time: 0,
    activeTir: null,
    pierre: null,
    pierreTrail: [],
    fullTrail: [],
    animationProgress: 0,
    simulationDone: false,
    bonhommeTouché: false,
    bonhommeChuteProgress: 0,
    bonhommeHitIndex: -1,
    outcome: null,
    
    G: 2000,
    masse: 3375,
    rayon: 120,
    
    vitesses: {
        lent: 140,
        moyen: 210,
        rapide: 216,
        orbite: 224,
        liberation: 290
    },
    
    animationSpeed: 1.3,
    
    stars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "L'Horizon des Événements";
        if (numberEl) numberEl.textContent = "CHAPITRE 12 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. S'échapper d'une masse</strong></p>
                <p>Un homme lance une pierre. Plus elle va vite, plus elle va loin avant de retomber. Sa trajectoire dépend de la gravité et de sa vitesse.</p>
                <p>Si elle va assez vite, elle tourne. Au-delà d'une certaine vitesse (la vitesse de libération), elle s'échappe.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Plus un corps est massif, plus la vitesse nécessaire pour s'échapper est grande.<br><br>Le problème : quand la masse est telle que cette vitesse dépasse celle de la lumière.</p>
            `;
        }

        this.reset();
        this.setupControls(controlsEl);

        this.stars = [];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    setupControls: function(controlsEl) {
        if (!controlsEl) return;
        controlsEl.classList.add('visible');
        controlsEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:8px; width:100%;">
                <button class="step-btn tir-btn" data-tir="lent" style="width:100%; height:36px;">
                    Lancé
                </button>
                <button class="step-btn tir-btn" data-tir="moyen" style="width:100%; height:36px;">
                    Plus fort
                </button>
                <button class="step-btn tir-btn" data-tir="rapide" style="width:100%; height:36px;">
                    Encore plus fort
                </button>
                <button class="step-btn tir-btn" data-tir="orbite" style="width:100%; height:36px;">
                    Démentiel
                </button>
                <button class="step-btn tir-btn" data-tir="liberation" style="width:100%; height:36px;">
                    Superman
                </button>
            </div>
        `;

        document.querySelectorAll('.tir-btn').forEach(btn => {
            btn.onclick = () => {
                this.activeTir = btn.dataset.tir;
                this.lancerTir();
                this.updateButtonHighlight();
            };
        });
    },

    updateButtonHighlight: function() {
        document.querySelectorAll('.tir-btn').forEach(btn => {
            if (btn.dataset.tir === this.activeTir) {
                btn.style.background = '#06b6d4';
                btn.style.color = '#ffffff';
                btn.style.borderColor = '#06b6d4';
            } else {
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }
        });
    },

    reset: function() {
        this.time = 0;
        this.pierre = null;
        this.pierreTrail = [];
        this.fullTrail = [];
        this.animationProgress = 0;
        this.simulationDone = false;
        this.bonhommeTouché = false;
        this.bonhommeChuteProgress = 0;
        this.bonhommeHitIndex = -1;
        this.outcome = null;
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('12_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(12); },

    lancerTir: function() {
        this.reset();
        this.simulationDone = false;
    },

    simulateTrajectory: function(cx, cy, rayon, vx0) {
        const trail = [];
        let x = cx;
        let y = cy - rayon - 15;
        let vx = vx0;
        let vy = 0;
        const dt = 1/60;
        const maxSteps = 2000;
        
        let cumulativeAngle = 0;
        let lastAngle = Math.atan2(y - cy, x - cx);
        let toursComplets = 0;
        let bonhommeHit = false;
        let bonhommeHitIndex = -1;
        
        const bonhommeX = cx;
        const bonhommeY = cy - rayon - 15;
        
        trail.push({ x, y });
        
        for (let step = 0; step < maxSteps; step++) {
            const dx = cx - x;
            const dy = cy - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const distBonhomme = Math.sqrt((x - bonhommeX) ** 2 + (y - bonhommeY) ** 2);
            
            // CORRECTION : Condition simplifiée. On touche le bonhomme si on est proche et qu'on a avancé.
            if (!bonhommeHit && step > 20 && distBonhomme < 25) {
                bonhommeHit = true;
                bonhommeHitIndex = trail.length;
            }
            
            if (dist < rayon) {
                trail.push({ x, y });
                return { trail, outcome: 'impact', bonhommeHit, bonhommeHitIndex };
            }
            
            if (x < -500 || x > 1700 || y < -500 || y > 1100) {
                trail.push({ x, y });
                return { trail, outcome: 'escape', bonhommeHit, bonhommeHitIndex };
            }
            
            const force = (this.G * this.masse) / (dist * dist);
            const ax = (dx / dist) * force;
            const ay = (dy / dist) * force;
            
            vx += ax * dt;
            vy += ay * dt;
            x += vx * dt;
            y += vy * dt;
            
            const currentAngle = Math.atan2(y - cy, x - cx);
            let deltaAngle = currentAngle - lastAngle;
            while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
            while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
            cumulativeAngle += deltaAngle;
            lastAngle = currentAngle;
            
            if (Math.abs(cumulativeAngle) >= 2 * Math.PI) {
                toursComplets++;
                cumulativeAngle = 0;
                if (toursComplets >= 1) {
                    trail.push({ x, y, orbiteComplete: true });
                    return { trail, outcome: 'orbite', bonhommeHit, bonhommeHitIndex };
                }
            }
            
            trail.push({ x, y });
        }
        
        return { trail, outcome: 'timeout', bonhommeHit, bonhommeHitIndex };
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        const cx = width / 2;
        const cy = height / 2;
        const rayon = this.rayon;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.6})`;
            ctx.beginPath();
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Sphère
        const grad = ctx.createRadialGradient(
            cx - rayon * 0.35, cy - rayon * 0.35, rayon * 0.05,
            cx, cy, rayon
        );
        grad.addColorStop(0, '#f1f5f9');
        grad.addColorStop(0.3, '#94a3b8');
        grad.addColorStop(0.7, '#475569');
        grad.addColorStop(1, '#1e293b');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rayon, 0, Math.PI * 2);
        ctx.fill();
        
        // Simulation
        if (this.activeTir && !this.simulationDone) {
            const vitesse = this.vitesses[this.activeTir];
            const result = this.simulateTrajectory(cx, cy, rayon, vitesse);
            this.fullTrail = result.trail;
            this.outcome = result.outcome;
            this.bonhommeHitIndex = result.bonhommeHitIndex;
            this.pierreTrail = [];
            this.animationProgress = 0;
            this.simulationDone = true;
        }
        
        // Animation
        if (this.simulationDone && this.animationProgress < 1) {
            this.animationProgress += dt * this.animationSpeed;
            if (this.animationProgress > 1) this.animationProgress = 1;
            
            const totalPoints = this.fullTrail.length;
            const visiblePoints = Math.floor(totalPoints * this.animationProgress);
            this.pierreTrail = this.fullTrail.slice(0, Math.max(2, visiblePoints));
            
            if (this.pierreTrail.length > 0) {
                const lastPoint = this.pierreTrail[this.pierreTrail.length - 1];
                this.pierre = { x: lastPoint.x, y: lastPoint.y };
                
                if (this.bonhommeHitIndex > 0 && visiblePoints > this.bonhommeHitIndex && !this.bonhommeTouché) {
                    this.bonhommeTouché = true;
                }
            }
        }
        
        if (this.bonhommeTouché) {
            if (this.bonhommeChuteProgress < 1) {
                this.bonhommeChuteProgress += dt * 2;
                if (this.bonhommeChuteProgress > 1) this.bonhommeChuteProgress = 1;
            }
        }
        
        // Bonhomme
        const bonhommeX = cx;
        const bonhommeY = cy - rayon - 15;
        
        ctx.save();
        ctx.translate(bonhommeX, bonhommeY);
        
        if (this.bonhommeTouché) {
            ctx.rotate(this.bonhommeChuteProgress * Math.PI / 2);
        }
        
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-2, -4, 4, 8);
        ctx.fillRect(-4, 4, 3, 6);
        ctx.fillRect(1, 4, 3, 6);
        ctx.fillRect(2, -6, 8, 2);
        
        ctx.restore();
        
        // Trajectoire
        if (this.pierreTrail.length > 1) {
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.7)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.pierreTrail[0].x, this.pierreTrail[0].y);
            for (let i = 1; i < this.pierreTrail.length; i++) {
                ctx.lineTo(this.pierreTrail[i].x, this.pierreTrail[i].y);
            }
            ctx.stroke();
        }
        
        // Pierre
        if (this.pierre && this.pierreTrail.length > 0) {
            ctx.fillStyle = '#fde047';
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.pierre.x, this.pierre.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Message
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        
        let message = "Cliquez sur un bouton pour voir la trajectoire.";
        if (this.activeTir) {
            if (this.outcome === 'impact') {
                const last = this.fullTrail[this.fullTrail.length - 1];
                const dx = last.x - cx;
                const angle = Math.atan2(dx, -(last.y - cy)) * 180 / Math.PI;
                if (angle < 30) message = "La pierre retombe devant le bonhomme.";
                else if (angle < 90) message = "La pierre retombe à 'midi quinze'.";
                else message = "La pierre retombe à '18 heures'.";
            } else if (this.outcome === 'escape') {
                message = "La pierre s'échappe et file tout droit.";
            } else if (this.outcome === 'orbite') {
                message = "La pierre tourne autour de la masse. Elle est en orbite.";
            } else {
                message = "La pierre suit une trajectoire longue.";
            }
        }
        ctx.fillText(message, cx, height - 40);
        
        ctx.restore();
    },

    destroy: function() {}
};