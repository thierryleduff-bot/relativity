// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 6/6)
// ---------------------------------------------------------------------
// La limite absolue. Monde rapide atténué, sphère métallique, jauges.
// =====================================================================

window.Stages['3_5'] = {
    time: 0,
    stars: [],
    
    velocityRatio: 0.5,
    gamma: 1.154,
    isLimitReached: false,
    
    starOffset: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "La Limite Absolue";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>6. La limite absolue</strong></p>
                <p>Pour accélérer un objet, il faut lui fournir de l'énergie.</p>
                <p>Plus l'objet va vite, plus son énergie cinétique augmente et plus sa <span class="tooltip-trigger" data-tooltip-content="La masse relativiste||La masse d'un objet augmente avec sa vitesse.||La formule est : m = γm₀||Où γ est le facteur de Lorentz : γ = 1 / √(1 - v²/c²).||Quand v (la vitesse) se rapproche de c, γ tend vers l'infini.||Donc la masse tend vers l'infini.">masse <span class="tooltip-icon">ⓘ</span></span> augmente.</p>
                <p>En effet, en relativité, toute cette énergie ne se transforme pas seulement en vitesse, mais également en masse. L'objet devient de plus en plus "lourd" (il résiste de plus en plus à l'accélération).</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Poussez le curseur pour voir ce qui se passe.</p>
            `;

            const triggers = narrativeEl.querySelectorAll('.tooltip-trigger');
            const citationZone = document.getElementById('citation-zone');
            if (citationZone) {
                triggers.forEach(trigger => {
                    const content = trigger.getAttribute('data-tooltip-content');
                    if (!content) return;
                    trigger.addEventListener('mouseenter', () => {
                        const parts = content.split('||');
                        let html = `<div class="citation-title">${parts[0]}</div>`;
                        parts.slice(1).forEach(line => { html += `<div class="citation-line">${line}</div>`; });
                        citationZone.innerHTML = html;
                        citationZone.classList.add('active');
                    });
                    trigger.addEventListener('mouseleave', () => {
                        citationZone.innerHTML = '';
                        citationZone.classList.remove('active');
                    });
                });
            }
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
                    <div style="font-size:0.85rem; color:#cbd5e1;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span>Vitesse</span>
                            <strong id="val-v-kms" style="color:#06b6d4;">0 km/s</strong>
                        </div>
                        <input id="slider-v" type="range" min="50" max="99.99" step="0.01" value="50" 
                            style="width:100%; accent-color:#06b6d4; cursor:pointer;">
                    </div>
                    <div style="font-size:1rem; color:#f59e0b; text-align:center; padding-top:10px; border-top:1px solid rgba(255,255,255,0.06);">
                        Énergie nécessaire : <span id="val-energy" style="font-weight:bold;">1,15</span> E₀
                    </div>
                </div>
            `;

            const slider = document.getElementById('slider-v');
            if (slider) {
                slider.oninput = (e) => {
                    let val = parseFloat(e.target.value);
                    if (val > 99.99) val = 99.99;
                    this.velocityRatio = val / 100;
                    
                    if (this.velocityRatio > 0.9998) {
                        this.isLimitReached = true;
                    } else {
                        this.isLimitReached = false;
                    }
                    this.gamma = 1 / Math.sqrt(1 - this.velocityRatio * this.velocityRatio);
                    this.updateLabels();
                };
            }
            this.updateLabels();
        }

        this.reset();
        
        // CORRECTION : On vide le tableau d'étoiles avant de le remplir
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.6 + 0.2
            });
        }
    },

    updateLabels: function() {
        const vEl = document.getElementById('val-v-kms');
        const eEl = document.getElementById('val-energy');
        
        if (vEl) {
            const vKms = this.velocityRatio * 299792.458;
            const pc = (this.velocityRatio * 100).toFixed(2);
            vEl.innerHTML = `${Math.round(vKms).toLocaleString('fr-FR')} km/s <span style="font-size:0.8rem; color:#94a3b8;">(${pc} % c)</span>`;
        }
        if (eEl) {
            eEl.textContent = this.gamma.toFixed(2).replace('.', ',');
            if (this.velocityRatio > 0.9998) eEl.textContent = "∞";
        }
    },

    reset: function() {
        this.time = 0;
        this.velocityRatio = 0.5;
        this.gamma = 1.154;
        this.isLimitReached = false;
        this.starOffset = 0;
        
        const slider = document.getElementById('slider-v');
        if (slider) slider.value = 50;
        this.updateLabels();
    },

    getCurrentStep: function() { return 6; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(4); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('3_4'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        // 1. Monde qui défile (vitesse d'origine, opacité atténuée à 15%)
        const scrollSpeed = 100 + (this.velocityRatio * 2000); 
        this.starOffset += scrollSpeed * dt;
        
        this.stars.forEach(star => {
            let x = (star.x * width - this.starOffset) % width;
            if (x < 0) x += width;
            
            const trailLength = 10 + (this.velocityRatio * 100);
            
            // Opacité atténuée à 15%
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.alpha * 0.15})`;
            ctx.lineWidth = star.size * 0.8;
            ctx.beginPath(); 
            ctx.moveTo(x, star.y * height); 
            ctx.lineTo(x + trailLength, star.y * height); 
            ctx.stroke();
        });

        const cx = width / 2;
        const cy = height / 2;
        
        // 2. La masse (contraction limitée, aspect métal brossé)
        const baseRadius = 40;
        const contractFactor = Math.max(0.4, Math.sqrt(1 - this.velocityRatio * this.velocityRatio));
        const massW = baseRadius * contractFactor;
        const massH = baseRadius;
        
        // Couleur métal brossé
        const grad = ctx.createLinearGradient(cx - massW, cy - massH, cx + massW, cy + massH);
        grad.addColorStop(0, '#e2e8f0');
        grad.addColorStop(0.4, '#94a3b8');
        grad.addColorStop(0.6, '#475569');
        grad.addColorStop(1, '#1e293b');
        
        // Dessin de la sphère
        ctx.fillStyle = grad;
        ctx.beginPath(); 
        ctx.ellipse(cx, cy, massW, massH, 0, 0, Math.PI * 2); 
        ctx.fill();
        
        // Petit reflet pour le volume
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath(); 
        ctx.ellipse(cx - massW * 0.3, cy - massH * 0.3, massW * 0.2, massH * 0.2, 0, 0, Math.PI * 2); 
        ctx.fill();

        // 3. Jauges verticales (avec cadre)
        const gaugeW = 20;
        const gaugeH = 200;
        const gaugeX = width - 180;
        const gaugeY1 = height / 2 - 120;
        const gaugeY2 = height / 2 + 120;

        // Jauge Vitesse
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(gaugeX, gaugeY1, gaugeW, gaugeH);
        
        const vFill = this.velocityRatio; 
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(gaugeX, gaugeY1 + gaugeH * (1 - vFill), gaugeW, gaugeH * vFill);
        
        // Cadre
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(gaugeX, gaugeY1, gaugeW, gaugeH);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("Vitesse", gaugeX + 30, gaugeY1 + 20);
        
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText("299 792 km/s", gaugeX + 30, gaugeY1 + gaugeH - 20);
        ctx.font = '12px sans-serif';
        ctx.fillText("(100 % c)", gaugeX + 30, gaugeY1 + gaugeH);

        // Jauge Énergie
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(gaugeX, gaugeY2, gaugeW, gaugeH);
        
        const eFill = Math.min(1, Math.log10(this.gamma) / 2); 
        ctx.fillStyle = this.isLimitReached ? '#ef4444' : '#f59e0b';
        ctx.fillRect(gaugeX, gaugeY2 + gaugeH * (1 - eFill), gaugeW, gaugeH * eFill);
        
        // Cadre
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(gaugeX, gaugeY2, gaugeW, gaugeH);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText("Énergie", gaugeX + 30, gaugeY2 + 20);
        
        if (this.isLimitReached) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText("∞", gaugeX + 30, gaugeY2 + gaugeH - 10);
        }

        // 4. Message final
        if (this.isLimitReached) {
            ctx.save();
            ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
            ctx.fillRect(0, height * 0.75, width, height * 0.25);
            
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            
            ctx.fillText("À 299 792 km/s, la masse tend vers l'infini.", cx, height * 0.8);
            ctx.fillText("Il faudrait une énergie infinie pour continuer à accélérer.", cx, height * 0.84);
            ctx.fillStyle = '#f59e0b';
            ctx.fillText("C'est pourquoi aucun objet massif ne peut atteindre la vitesse de la lumière.", cx, height * 0.88);
            ctx.restore();
        }

        ctx.restore();
    },

    destroy: function() {}
};