// =====================================================================
// CHAPITRE 9 — LA COURBURE DE L'ESPACE-TEMPS (ÉTAPE 3/4)
// ---------------------------------------------------------------------
// Grille opposée : lignes grasses de gauche/haut, atténuées de droite/bas.
// Les lignes centrales ne sont jamais déviées.
// =====================================================================

window.Stages['9_2'] = {
    time: 0,
    stars: [],
    masse: 0,
    paramForce: 0.065,
    paramPuissance: 1,
    showTime: false,
    
    clockAngles: [0, 0, 0],
    
    clockPositions: [
        { x: 8, y: 12 },
        { x: 50, y: 25 },
        { x: 63, y: 50 }
    ],
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "La Courbure";
        if (numberEl) numberEl.textContent = "CHAPITRE 9 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. La masse apparaît</strong></p>
                <p>Une masse déforme l'espace et le temps autour d'elle. Pour un observateur lointain : </p>
				<p> - L'espace se contractant, un mètre local parait plus petit.</p>
                <p> - Le temps local ralentit. </p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">L'espace n'est pas un cadre rigide, et le temps ne s'écoule pas partout pareil.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            
            if (!document.getElementById('ios-toggle-style')) {
                const style = document.createElement('style');
                style.id = 'ios-toggle-style';
                style.innerHTML = `
                    .ios-switch {
                        position: relative;
                        display: inline-block;
                        width: 44px;
                        height: 24px;
                    }
                    .ios-switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .ios-slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-color: #475569;
                        transition: .3s;
                        border-radius: 24px;
                    }
                    .ios-slider:before {
                        position: absolute;
                        content: "";
                        height: 18px;
                        width: 18px;
                        left: 3px;
                        bottom: 3px;
                        background-color: white;
                        transition: .3s;
                        border-radius: 50%;
                    }
                    .ios-switch input:checked + .ios-slider {
                        background-color: #06b6d4;
                    }
                    .ios-switch input:checked + .ios-slider:before {
                        transform: translateX(20px);
                    }
                `;
                document.head.appendChild(style);
            }

            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:12px; width:100%; font-size:0.85rem; color:#cbd5e1;">
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>Masse</span>
                            <strong id="val-masse" style="color:#f59e0b;">0</strong>
                        </div>
                        <input id="slider-masse" type="range" min="0" max="100" step="1" value="0" 
                            style="width:100%; accent-color:#f59e0b; cursor:pointer;">
                    </div>
                    
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>Force</span>
                            <strong id="val-force" style="color:#06b6d4;">0.065</strong>
                        </div>
                        <input id="slider-force" type="range" min="0" max="0.10" step="0.001" value="0.065" 
                            style="width:100%; accent-color:#06b6d4; cursor:pointer;">
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>Puissance</span>
                            <strong id="val-puissance" style="color:#c084fc;">1.0</strong>
                        </div>
                        <input id="slider-puissance" type="range" min="0.5" max="3" step="0.1" value="1" 
                            style="width:100%; accent-color:#c084fc; cursor:pointer;">
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <span style="font-weight: 600; color: #f8fafc;">Afficher le temps</span>
                        <label class="ios-switch">
                            <input type="checkbox" id="toggle-time">
                            <span class="ios-slider"></span>
                        </label>
                    </div>
                </div>
            `;

            document.getElementById('slider-masse').oninput = (e) => {
                this.masse = parseFloat(e.target.value);
                document.getElementById('val-masse').textContent = this.masse;
            };
            document.getElementById('slider-force').oninput = (e) => {
                this.paramForce = parseFloat(e.target.value);
                document.getElementById('val-force').textContent = this.paramForce.toFixed(3);
            };
            document.getElementById('slider-puissance').oninput = (e) => {
                this.paramPuissance = parseFloat(e.target.value);
                document.getElementById('val-puissance').textContent = this.paramPuissance.toFixed(1);
            };
            document.getElementById('toggle-time').onchange = (e) => {
                this.showTime = e.target.checked;
            };
        }

        this.time = 0;
        this.masse = 0;
        this.showTime = false;
        this.clockAngles = [0, 0, 0];
        
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
        this.masse = 0;
        this.paramForce = 0.065;
        this.paramPuissance = 1;
        this.showTime = false;
        this.clockAngles = [0, 0, 0];
        const elMasse = document.getElementById('slider-masse');
        if (elMasse) elMasse.value = 0;
        const elForce = document.getElementById('slider-force');
        if (elForce) elForce.value = 0.065;
        const elPuis = document.getElementById('slider-puissance');
        if (elPuis) elPuis.value = 1;
        const elToggle = document.getElementById('toggle-time');
        if (elToggle) elToggle.checked = false;
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('9_3'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('9_1'); },

    getTimeFactor: function(x, y, cx, cy) {
        if (this.masse === 0) return 1;
        
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const r = Math.max(dist, 30);
        const intensity = (this.masse / 100) * 8000;
        const factor = 1 / (1 + intensity / (r * r));
        
        return Math.max(0.15, factor);
    },

    traceLine: function(ctx, startX, startY, initialAngle, cx, cy, width, height, isCenterLine, direction) {
        // direction : 1 = de gauche à droite (ou de haut en bas)
        //            -1 = de droite à gauche (ou de bas en haut)
        let px, py, angle;
        
        if (direction === 1) {
            px = startX;
            py = startY;
            angle = initialAngle;
        } else {
            // Pour les lignes horizontales : on part de la droite
            // Pour les lignes verticales : on part du bas
            if (initialAngle === 0) {
                px = width + 150;
                py = startY;
            } else {
                px = startX;
                py = height + 150;
            }
            angle = initialAngle + Math.PI;
        }
        
        ctx.beginPath();
        ctx.moveTo(px, py);

        const stepSize = 5; 
        let maxSteps = 600; 

        while (maxSteps > 0) {
            if (px < -150 || px > width + 150 || py < -150 || py > height + 150) break;

            if (!isCenterLine) {
                const dx = cx - px;
                const dy = cy - py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 350) {
                    const force = Math.pow(this.masse / 100, this.paramPuissance) * this.paramForce; 
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

    drawClock: function(ctx, x, y, radius, angle, color, alpha, tours) {
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

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${tours}`, x, y + radius + 14);

        ctx.restore();
    },

        draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        const centerX = width / 2;
        const centerY = height / 2;

        const baseSpeed = (Math.PI * 2) / 16;
        const intermediateSoftening = 0.6;

        for (let i = 0; i < this.clockPositions.length; i++) {
            const pos = this.clockPositions[i];
            const x = (pos.x / 100) * width;
            const y = (pos.y / 100) * height;
            
            let factor = this.getTimeFactor(x, y, centerX, centerY);
            
            if (i === 1) {
                factor = 1 - (1 - factor) * intermediateSoftening;
            }
            
            this.clockAngles[i] += baseSpeed * factor * dt;
        }

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

        const gridAlpha = this.showTime ? 0.3 : 1.0;
        
        const spacing = 48;
        
        const nbHorizontal = Math.ceil(height / (2 * spacing)) + 1;
        const nbVertical = Math.ceil(width / (2 * spacing)) + 1;

        // Lignes horizontales : alternance grasses / atténuées
        // On part de l'index le plus négatif, on va jusqu'au plus positif.
        // L'index de départ détermine la parité.
        let idxH = 0;
        for (let i = -nbHorizontal; i <= nbHorizontal; i++) {
            const y = centerY + i * spacing;
            const isCenter = (i === 0);
            
            // Alternance : on utilise un compteur indépendant de i
            const isBold = (idxH % 2 === 0);
            const baseAlpha = isBold ? 0.5 : 0.2;
            const direction = isBold ? 1 : -1; // grasses : gauche→droite, atténuées : droite→gauche
            
            ctx.strokeStyle = `rgba(56, 189, 248, ${baseAlpha * gridAlpha})`;
            ctx.lineWidth = 1;
            this.traceLine(ctx, -spacing, y, 0, centerX, centerY, width, height, isCenter, direction);
            idxH++;
        }

        // Lignes verticales : alternance grasses / atténuées
        let idxV = 0;
        for (let i = -nbVertical; i <= nbVertical; i++) {
            const x = centerX + i * spacing;
            const isCenter = (i === 0);
            
            const isBold = (idxV % 2 === 0);
            const baseAlpha = isBold ? 0.5 : 0.2;
            const direction = isBold ? 1 : -1; // grasses : haut→bas, atténuées : bas→haut
            
            ctx.strokeStyle = `rgba(56, 189, 248, ${baseAlpha * gridAlpha})`;
            ctx.lineWidth = 1;
            this.traceLine(ctx, x, -spacing, Math.PI / 2, centerX, centerY, width, height, isCenter, direction);
            idxV++;
        }

        const massRadius = this.masse > 0 ? 10 + (this.masse / 100) * 25 : 0;
        if (massRadius > 0) {
            this.drawMass(ctx, centerX, centerY, massRadius);
        }

        if (this.showTime) {
            this.clockPositions.forEach((pos, i) => {
                const x = (pos.x / 100) * width;
                const y = (pos.y / 100) * height;
                
                const clockAngle = this.clockAngles[i];
                const tours = Math.floor(clockAngle / (Math.PI * 2));
                
                this.drawClock(ctx, x, y, 30, clockAngle, '#38bdf8', 1.0, tours);
            });
        }

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        
        let message = "";
        if (!this.showTime) message = "La masse courbe l'espace autour d'elle.";
        else message = "Près de la masse, le temps ralentit (compteur de tours).";
        
        ctx.fillText(message, centerX, height - 40);

        ctx.restore();
    },

    destroy: function() {}
};