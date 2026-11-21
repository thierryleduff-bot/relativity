// =====================================================================
// CHAPITRE 12 — LES TROUS NOIRS (ÉTAPE 4/5)
// ---------------------------------------------------------------------
// Tomber dedans. Vue extérieure (figement, rougissement) vs
// Vue de la sonde (temps normal, l'extérieur accélère).
// Les compteurs de temps sont le "héros" de l'écran.
// =====================================================================

window.Stages['12_3'] = {
    time: 0,
    
    currentRef: 'exterieur',
    chuteProgress: 0,
    timeExt: 0,
    timeSonde: 0,
    
    stars: [],
    movingStars: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Tomber dedans";
        if (numberEl) numberEl.textContent = "CHAPITRE 12 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. Tomber dedans</strong></p>
                <p>Une sonde tombe vers le trou noir. Que voit-on depuis l'extérieur ? Que ressent-on à l'intérieur ?</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">
                    Le paradoxe : pour l'observateur lointain, la sonde ne franchit jamais l'horizon, elle se fige. Pour la sonde, elle l'a franchi. Les deux sont vrais en même temps, c'est la relativité.
                </p>
                <p style="color: #06b6d4; margin-top: 15px;">
                    La lumière va toujours à la même vitesse. Mais près du trou noir, son temps ralentit. Vue de la Terre, elle paraît se figer et rougir (décalage vers le rouge).
                </p>
                <p style="color: #94a3b8; font-size: 0.85rem; font-style: italic; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    Note : Si le trou noir était petit (de masse stellaire), les forces de marée te déchireraient avant même que tu ne franchisses l'horizon. Ici, on suppose un trou noir supermassif, où ces forces sont négligeables à l'horizon.
                </p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-switch-ref" class="step-btn" style="width:100%; height:36px;">
                        👁 Voir depuis la sonde
                    </button>
                </div>
            `;

            const btn = document.getElementById('btn-switch-ref');
            if (btn) {
                btn.onclick = () => {
                    this.currentRef = (this.currentRef === 'exterieur') ? 'sonde' : 'exterieur';
                    btn.textContent = (this.currentRef === 'exterieur') 
                        ? "👁 Voir depuis la sonde" 
                        : "👁 Voir depuis la Terre";
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
        
        for (let i = 0; i < 80; i++) {
            this.movingStars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.2,
                colorShift: Math.random()
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.currentRef = 'exterieur';
        this.chuteProgress = 0;
        this.timeExt = 0;
        this.timeSonde = 0;
        
        const btn = document.getElementById('btn-switch-ref');
        if (btn) btn.textContent = "👁 Voir depuis la sonde";
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('12_4'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('12_2'); },

    drawCounters: function(ctx, width, height) {
        ctx.save();
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        
        ctx.fillStyle = '#22c55e';
        ctx.fillText(`Sonde : ${Math.floor(this.timeSonde)} min`, width / 2 - 160, 50);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`Terre : ${Math.floor(this.timeExt)} ans`, width / 2 + 160, 50);
        
        ctx.restore();
    },

    drawPeriscopeOverlay: function(ctx, cx, cy, radius) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.2, cy); ctx.lineTo(cx + radius * 0.2, cy);
        ctx.moveTo(cx, cy - radius * 0.2); ctx.lineTo(cx, cy + radius * 0.2);
        ctx.stroke();

        const step = radius / 5;
        for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            const x = cx + i * step;
            const y = cy;
            const lineH = (i % 2 === 0) ? 15 : 8;
            ctx.beginPath(); ctx.moveTo(x, y - lineH); ctx.lineTo(x, y + lineH); ctx.stroke();
            
            const x2 = cx;
            const y2 = cy + i * step;
            const lineW = (i % 2 === 0) ? 15 : 8;
            ctx.beginPath(); ctx.moveTo(x2 - lineW, y2); ctx.lineTo(x2 + lineW, y2); ctx.stroke();
        }
        ctx.restore();
    },

    drawCockpitInterior: function(ctx, cx, cy, radius) {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.rect(0, 0, cx * 2, cy * 2);
        ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 20;
        ctx.beginPath(); ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2); ctx.stroke();
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2); ctx.stroke();
        
        ctx.fillStyle = '#94a3b8';
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bx = cx + Math.cos(angle) * (radius + 10);
            const by = cy + Math.sin(angle) * (radius + 10);
            ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    },

    drawVoyant: function(ctx, cx, cy, radius) {
        const angle = Math.PI * 0.85; 
        const dist = radius * 0.8;
        const vx = cx + Math.cos(angle) * dist;
        const vy = cy + Math.sin(angle) * dist;

        const isPassed = this.chuteProgress > 0.9;

        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(vx - 15, vy - 10, 30, 20, 4);
        ctx.fill(); ctx.stroke();

        const ledColor = isPassed ? '#ef4444' : '#334155';
        const glowColor = isPassed ? 'rgba(239, 68, 68, 0.5)' : 'transparent';

        if (isPassed) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15;
        }

        ctx.fillStyle = ledColor;
        ctx.beginPath();
        ctx.arc(vx, vy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isPassed ? '#ef4444' : '#64748b';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("HORIZON", vx, vy + 16);

        ctx.restore();
    },

    drawSonde: function(ctx, x, y, progress) {
        ctx.save();
        ctx.translate(x, y);
        
        // Couleur de la sonde : cyan au départ, rouge sombre à la fin
        const r = Math.floor(56 + (150 - 56) * progress);
        const g = Math.floor(189 + (50 - 189) * progress);
        const b = Math.floor(248 + (50 - 248) * progress);
        const color = `rgb(${r}, ${g}, ${b})`;

        // Corps de la sonde (petit rectangle)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-6, -4, 12, 8, 2);
        ctx.fill(); ctx.stroke();

        // Panneaux solaires (ailes)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(-12, -2, 4, 4);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(8, -2, 4, 4);
        ctx.fill();

        // Antenne
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(0, -10);
        ctx.stroke();

        // Petit point lumineux (réacteur)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(-6, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        if (this.chuteProgress < 1) {
            let speed = 0.1;
            if (this.currentRef === 'exterieur') {
                speed = 0.1 * Math.pow(1 - this.chuteProgress, 0.5);
            }
            this.chuteProgress += speed * dt;
            if (this.chuteProgress > 1) this.chuteProgress = 1;
        }

        if (this.currentRef === 'exterieur') {
            const timeFactor = 1 + Math.pow(this.chuteProgress, 4) * 80;
            this.timeExt += dt * timeFactor;
            this.timeSonde += dt; 
        } else {
            this.timeSonde += dt;
            this.timeExt += dt * 80;
        }

        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2 + 20;
        const radius = Math.min(width, height) * 0.4;

        if (this.currentRef === 'exterieur') {
            ctx.save();
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
            
            this.stars.forEach(star => {
                if (star.x > cx - radius && star.x < cx + radius) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                    ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
                }
            });

            const bhRadius = 40;
            
            const haloGrad = ctx.createRadialGradient(cx, cy, bhRadius, cx, cy, bhRadius * 2.5);
            haloGrad.addColorStop(0, 'rgba(30, 41, 59, 0.6)');
            haloGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath(); ctx.arc(cx, cy, bhRadius * 2.5, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#000000';
            ctx.beginPath(); ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2); ctx.fill();

            // Calcul de la position de la sonde
            const startX = cx - 250;
            const endX = cx - bhRadius - 25;
            const sondeX = startX + (endX - startX) * this.chuteProgress;
            const sondeY = cy;

            // Dessin de la sonde
            this.drawSonde(ctx, sondeX, sondeY, this.chuteProgress);

            ctx.restore();

            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
            
            this.drawPeriscopeOverlay(ctx, cx, cy, radius);
            ctx.restore();

            ctx.save();
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("La sonde se fige. Sa lumière ne nous parvient plus.", cx, height - 30);
            ctx.restore();

        } else {
            ctx.save();
            ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
            
            const timeFactor = 1 + this.chuteProgress * 20;
            this.movingStars.forEach(star => {
                let x = (star.x * width + this.time * 80 * timeFactor) % width;
                if (x < 0) x += width;
                if (x > cx - radius && x < cx + radius) {
                    const trailLength = 20 + this.chuteProgress * 100;
                    
                    const age = (this.time * 0.1 + star.colorShift) % 1;
                    const r = 56 + age * 200;
                    const g = 189 - age * 150;
                    const b = 248 - age * 200;
                    
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${star.alpha})`;
                    ctx.lineWidth = star.size * 0.7;
                    ctx.beginPath(); 
                    ctx.moveTo(x, star.y * height); 
                    ctx.lineTo(x - trailLength, star.y * height); 
                    ctx.stroke();
                }
            });

            if (this.chuteProgress > 0.8) {
                const alpha = (this.chuteProgress - 0.8) / 0.2;
                ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.8})`;
                ctx.fillRect(0, 0, width, height);
            }

            ctx.restore();

            this.drawCockpitInterior(ctx, cx, cy, radius);
            this.drawVoyant(ctx, cx, cy, radius);

            ctx.save();
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("Pour la sonde, le temps s'écoule normalement. L'horizon n'est pas un mur.", cx, height - 30);
            ctx.restore();
        }

        this.drawCounters(ctx, width, height);

        ctx.restore();
    },

    destroy: function() {}
};