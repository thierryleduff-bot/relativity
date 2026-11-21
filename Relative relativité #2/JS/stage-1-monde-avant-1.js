// =====================================================================
// CHAPITRE 1 — LE MONDE D'AVANT (ÉTAPE 2/3)
// ---------------------------------------------------------------------
// L'addition des vitesses. 3 trains, un quai, sans bulles de relativité.
// =====================================================================

window.Stages['1_1'] = {
    time: 0,
    stars: [],
    
    state: 'idle',
    
    trainAX: 0,
    trainBX: 0,
    trainCX: 0,
    
    speed: 60, 
    
    trainW: 80,
    trainH: 40,
    quaiH: 60,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "L'addition des vitesses";
        if (numberEl) numberEl.textContent = "CHAPITRE 1 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>2. L'addition des vitesses</strong></p>
                <p>Le bon sens nous dit que les vitesses s'additionnent. Si deux trains roulent l'un vers l'autre à 50 km/h, ils se rapprochent à 100 km/h.</p>
                <p>Un troisième train roule à 80 km/h. Les vitesses relatives dépendent de qui regarde qui.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Lancez le départ et observez les vitesses relatives quand les trains se croisent.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-depart" class="step-btn" style="width:100%; height:40px; background: #f59e0b; color: #0b0f19; font-weight: bold;">
                        Départ !
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-depart');
            if (btn) {
                btn.onclick = () => {
                    if (this.state === 'idle') {
                        this.state = 'moving';
                        btn.disabled = true;
                        btn.style.opacity = 0.5;
                        btn.style.cursor = 'not-allowed';
                        btn.textContent = "En cours...";
                    }
                };
            }
        }

        this.reset();
        
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.state = 'idle';
        this.trainAX = -150;
        this.trainBX = 1500; 
        this.trainCX = -300;
        
        const btn = document.getElementById('btn-depart');
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = 1;
            btn.style.cursor = 'pointer';
            btn.textContent = "Départ !";
        }
    },

    getCurrentStep: function() { return 2; },
    getTotalSteps: function() { return 4; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('1_2'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage(1); },

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

    drawTrain: function(ctx, x, y, color, direction) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        const halfW = this.trainW / 2;
        const halfH = this.trainH / 2;

        ctx.beginPath();
        if (direction === 1) {
            ctx.moveTo(x + halfW, y);
            ctx.quadraticCurveTo(x + halfW * 0.8, y - halfH, x + halfW * 0.5, y - halfH);
            ctx.lineTo(x - halfW, y - halfH);
            ctx.lineTo(x - halfW, y + halfH);
            ctx.lineTo(x + halfW * 0.5, y + halfH);
            ctx.quadraticCurveTo(x + halfW * 0.8, y + halfH, x + halfW, y);
        } else {
            ctx.moveTo(x - halfW, y);
            ctx.quadraticCurveTo(x - halfW * 0.8, y - halfH, x - halfW * 0.5, y - halfH);
            ctx.lineTo(x + halfW, y - halfH);
            ctx.lineTo(x + halfW, y + halfH);
            ctx.lineTo(x - halfW * 0.5, y + halfH);
            ctx.quadraticCurveTo(x - halfW * 0.8, y + halfH, x - halfW, y);
        }
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = `${color}88`;
        for (let i = 0; i < 4; i++) {
            const wx = x - halfW * 0.6 + (i * halfW * 0.4);
            ctx.beginPath();
            ctx.roundRect(wx, y - halfH * 0.6, 8, 12, 2);
            ctx.fill();
        }

        ctx.fillStyle = '#334155';
        for (let i = 0; i < 3; i++) {
            const wx = x - halfW * 0.5 + (i * halfW * 0.5);
            ctx.beginPath(); ctx.arc(wx, y + halfH + 5, 5, 0, Math.PI * 2); ctx.fill();
        }

        ctx.restore();
    },

    drawSpeedPanel: function(ctx, x, y, text, color) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        
        const panelW = 80;
        const panelH = 25;
        
        ctx.beginPath();
        ctx.roundRect(x - panelW/2, y - panelH/2, panelW, panelH, 4);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        if (this.trainBX === 1500) this.trainBX = width + 150;

        if (this.state === 'moving') {
            this.trainAX += this.speed * dt;
            this.trainBX -= this.speed * dt;
            this.trainCX += this.speed * 1.6 * dt; 

            if (this.trainAX > width + this.trainW) this.trainAX = -this.trainW;
            if (this.trainBX < -this.trainW) this.trainBX = width + this.trainW;
            if (this.trainCX > width + this.trainW) this.trainCX = -this.trainW;
        }

        // --- DESSIN ---
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        this.stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        const bandA = height * 0.25;
        const bandB = height * 0.50;
        const bandC = height * 0.75;
        const bandQuai = height - this.quaiH;

        // Rails (descendus de 3px, épaisseur 4px)
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, bandA + 28); ctx.lineTo(width, bandA + 28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, bandB + 28); ctx.lineTo(width, bandB + 28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, bandC + 28); ctx.lineTo(width, bandC + 28); ctx.stroke();
        ctx.restore();

        // Trains et panneaux de vitesse
        this.drawTrain(ctx, this.trainAX, bandA, '#38bdf8', 1);
        this.drawMan(ctx, this.trainAX + 10, bandA - 5, '#38bdf8');
        this.drawSpeedPanel(ctx, this.trainAX, bandA - 50, "50 km/h", '#38bdf8');

        this.drawTrain(ctx, this.trainBX, bandB, '#ef4444', -1);
        this.drawMan(ctx, this.trainBX - 10, bandB - 5, '#ef4444');
        this.drawSpeedPanel(ctx, this.trainBX, bandB - 50, "50 km/h", '#ef4444');

        this.drawTrain(ctx, this.trainCX, bandC, '#a855f7', 1);
        this.drawMan(ctx, this.trainCX + 10, bandC - 5, '#a855f7');
        this.drawSpeedPanel(ctx, this.trainCX, bandC - 50, "80 km/h", '#a855f7');

        // Quai
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, bandQuai, width, this.quaiH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, bandQuai); ctx.lineTo(width, bandQuai); ctx.stroke();
        ctx.restore();

        // Observateur (bien centré dans le quai)
        this.drawMan(ctx, width / 2, bandQuai + this.quaiH / 2 + 10, '#94a3b8');

        // Texte de conclusion (en haut du canvas)
        if (this.state === 'moving') {
            ctx.save();
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'italic 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Les vitesses s'additionnent ou se soustraient selon l'observateur.", width / 2, 30);
            ctx.restore();
        }
    },

    destroy: function() {}
};