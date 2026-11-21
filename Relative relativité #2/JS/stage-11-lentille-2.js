// =====================================================================
// CHAPITRE 11 — LA LENTILLE GRAVITATIONNELLE (ÉTAPE 3/3)
// ---------------------------------------------------------------------
// Scène (gauche) et Image perçue (droite).
// Le curseur déplace la Terre. L'alignement crée l'anneau.
// =====================================================================

window.Stages['11_2'] = {
    time: 0,
    observerPos: -1,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "L'Anneau d'Einstein";
        if (numberEl) numberEl.textContent = "CHAPITRE 11 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. Ce que voit l'astronome</strong></p>
                <p>La masse dévie la lumière de la galaxie lointaine.</p>
                <p>Déplacez la Terre (en bas à gauche) pour changer l'angle de vue.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Plus l'alignement galaxie-masse-Terre est parfait, plus l'image se déforme en anneau.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:12px; width:100%; font-size:0.85rem; color:#cbd5e1;">
                    <div>
                        <div style="margin-bottom:6px;">Position de la Terre</div>
                        <input id="slider-pos" type="range" min="-100" max="100" step="1" value="-100" 
                            style="width:100%; accent-color:#06b6d4; cursor:pointer;">
                    </div>
                </div>
            `;

            document.getElementById('slider-pos').oninput = (e) => {
                this.observerPos = parseFloat(e.target.value) / 100;
            };
        }

        this.observerPos = -1;
    },

    reset: function() { 
        this.time = 0; 
        this.observerPos = -1;
        const slider = document.getElementById('slider-pos');
        if (slider) slider.value = -100;
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 3; },
    nextStep: function() {},
    prevStep: function() { if (window.Engine) window.Engine.loadStage('11_1'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        const midX = width / 2;
        const cy = height / 2;
        
        // Ligne de séparation
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(midX, 0);
        ctx.lineTo(midX, height);
        ctx.stroke();

        // =========================================================
        // PARTIE GAUCHE : LA SCÈNE PHYSIQUE
        // =========================================================
        const sceneCx = midX / 2;
        
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = 'italic 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La scène", sceneCx, 40);

        // 1. La galaxie source (en haut, loin de la masse)
        const galX = sceneCx;
        const galY = cy - 280;
        
        const galGlow = ctx.createRadialGradient(galX, galY, 0, galX, galY, 30);
        galGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        galGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = galGlow;
        ctx.beginPath(); ctx.arc(galX, galY, 30, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.ellipse(galX, galY, 10, 5, 0.5, 0, Math.PI * 2); ctx.fill();

        // 2. La masse (descendue, proche de la Terre)
        const massX = sceneCx;
        const massY = cy + 20;
        const massR = 25;
        
        const massGlow = ctx.createRadialGradient(massX, massY, 0, massX, massY, massR * 2);
        massGlow.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
        massGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = massGlow;
        ctx.beginPath(); ctx.arc(massX, massY, massR * 2, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(massX, massY, massR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // 3. La Terre (en bas, mobile)
        const earthX = sceneCx + this.observerPos * 120;
        const earthY = cy + 220;
        
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(earthX, earthY, 10, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Terre", earthX, earthY + 25);

        // Ligne d'alignement
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(galX, galY);
        ctx.lineTo(massX, massY);
        ctx.lineTo(earthX, earthY);
        ctx.stroke();
        ctx.setLineDash([]);

        // =========================================================
        // PARTIE DROITE : L'IMAGE PERÇUE
        // =========================================================
        const imgCx = midX + (width - midX) / 2;
        
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = 'italic 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Ce que voit la Terre", imgCx, 40);

        const ringRadius = 100;
        const align = 1 - Math.abs(this.observerPos);
        
        if (align < 0.3) {
            const tacheX = imgCx - 60 * Math.sign(this.observerPos || -1);
            const tacheY = cy;
            
            const tacheGlow = ctx.createRadialGradient(tacheX, tacheY, 0, tacheX, tacheY, 40);
            tacheGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
            tacheGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = tacheGlow;
            ctx.beginPath(); ctx.arc(tacheX, tacheY, 40, 0, Math.PI * 2); ctx.fill();
            
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.ellipse(tacheX, tacheY, 15, 8, 0, 0, Math.PI * 2); ctx.fill();
            
        } else if (align < 0.8) {
            const openness = (align - 0.3) / 0.5;
            const arcAngle = 0.3 + openness * 1.2;
            
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 10;
            
            ctx.beginPath();
            ctx.arc(imgCx, cy, ringRadius, -Math.PI/2 - arcAngle, -Math.PI/2 + arcAngle);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(imgCx, cy, ringRadius, Math.PI/2 - arcAngle, Math.PI/2 + arcAngle);
            ctx.stroke();
            
        } else {
            const pulse = Math.sin(this.time * 3) * 2;
            
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.arc(imgCx, cy, ringRadius + pulse, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
            ctx.lineWidth = 25;
            ctx.beginPath();
            ctx.arc(imgCx, cy, ringRadius + pulse, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (align > 0.3) {
            ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(imgCx, cy, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        ctx.restore();
    },
    destroy: function() {}
};