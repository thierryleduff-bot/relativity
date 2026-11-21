// =====================================================================
// CHAPITRE 9 — LA COURBURE DE L'ESPACE-TEMPS (ÉTAPE 5/5)
// ---------------------------------------------------------------------
// Calcul des décalages temporels (RR + RG) pour un satellite.
// =====================================================================

window.Stages['9_4'] = {
    time: 0,
    stars: [],
    curveData: [],
    
    // Paramètres physiques
    G: 6.674e-11,       
    M: 5.972e24,        
    c: 299792458,       
    R_terre: 6371,      
    
    // Altitude en km
    altitudeKm: 400,    
    
    // Objet visuel (satellite)
    satelliteAngle: 0,
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Le temps d'un satellite";
        if (numberEl) numberEl.textContent = "CHAPITRE 9 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>5. Le temps d'un satellite</strong></p>
                <p>Un satellite autour de la Terre subit deux effets opposés, par rapport à une horloge posée au sol.</p>
                <p><strong>La vitesse (RR)</strong> ralentit son temps. <strong>La distance (RG)</strong> l'accélère, car la gravité y est plus faible.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Faites varier l'altitude pour voir l'équilibre entre les deux effets.</p>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #94a3b8;">
                    Pour un satellite GPS (20 200 km d'altitude), le temps avance d'environ 38 µs par jour. Sans correction, la position dériverait de 10 km par jour.
                </p>
                <p style="margin-top: 15px;">
                    <span class="tooltip-trigger" data-tooltip-content="Formules||Vitesse orbitale : v = √(GM/r)||Décalage cinématique (RR) : Δτ/τ = -v²/(2c²)||Décalage gravitationnel (RG) : Δτ/τ = (GM/c²) × (1/R - 1/r)||Total : RR + RG||Note : r est le rayon orbital (R_terre + altitude).">Voir les formules <span class="tooltip-icon">ⓘ</span></span>
                </p>
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
                <div style="display:flex; flex-direction:column; gap:12px; width:100%; font-size:0.85rem; color:#cbd5e1;">
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span>Altitude</span>
                            <strong id="val-altitude" style="color:#f59e0b;">400 km</strong>
                        </div>
                        <input id="slider-altitude" type="range" min="0" max="1000" step="1" value="89" 
                            style="width:100%; accent-color:#f59e0b; cursor:pointer;">
                    </div>
                </div>
            `;

            const slider = document.getElementById('slider-altitude');
            if (slider) {
                slider.oninput = (e) => {
                    const t = parseFloat(e.target.value) / 1000;
                    const logMin = Math.log(200);
                    const logMax = Math.log(500000);
                    this.altitudeKm = Math.exp(logMin + t * (logMax - logMin));
                    
                    document.getElementById('val-altitude').textContent = 
                        this.altitudeKm.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' km';
                };
            }
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

        this.curveData = this.computeCurveData();
    },

    reset: function() {
        this.time = 0;
        this.satelliteAngle = 0;
        this.altitudeKm = 400;
        
        const slider = document.getElementById('slider-altitude');
        if (slider) slider.value = 89; 
        
        const val = document.getElementById('val-altitude');
        if (val) val.textContent = "400 km";
    },

    getCurrentStep: function() { return 5; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(10); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('9_3'); },

    computeCurveData: function() {
        const data = [];
        for (let i = 0; i < 120; i++) {
            const t = i / 119;
            const logMin = Math.log(200);
            const logMax = Math.log(500000);
            const altKm = Math.exp(logMin + t * (logMax - logMin));
            
            const r = (this.R_terre + altKm) * 1000;
            const R = this.R_terre * 1000;
            
            const v = Math.sqrt(this.G * this.M / r);
            const rr = -(v * v) / (2 * this.c * this.c);
            const rg = (this.G * this.M) / (this.c * this.c) * ((1 / R) - (1 / r));
            const total = rr + rg;
            const factor = 86400 * 1e6;
            
            data.push({
                alt: altKm,
                rr: rr * factor,
                rg: rg * factor,
                total: total * factor
            });
        }
        return data;
    },

    computeDilations: function() {
        const r = (this.R_terre + this.altitudeKm) * 1000; 
        const R = this.R_terre * 1000;   
        
        const v_ms = Math.sqrt(this.G * this.M / r); 
        const v_kms = v_ms / 1000; 
        
        const rrFactor = -(v_ms * v_ms) / (2 * this.c * this.c);
        const rgFactor = (this.G * this.M) / (this.c * this.c) * ((1 / R) - (1 / r));
        const totalFactor = rrFactor + rgFactor;
        
        const microSecPerDay = 86400 * 1e6;
        
        return {
            v: v_kms,
            rr: rrFactor * microSecPerDay,
            rg: rgFactor * microSecPerDay,
            total: totalFactor * microSecPerDay
        };
    },

    getVisualAngularSpeed: function() {
        const logMin = Math.log(200);
        const logMax = Math.log(500000);
        const t = (Math.log(this.altitudeKm) - logMin) / (logMax - logMin);
        
        const omegaNear = 1.5; 
        const omegaFar = 0.3;  
        
        const smoothT = (1 - Math.cos(t * Math.PI)) / 2;
        return omegaNear + (omegaFar - omegaNear) * smoothT;
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

        // Recentrage : on descend la Terre
        const cx = width / 2;
        const cy = height / 2 + 80; 

        // Rayon visuel (logarithmique)
        const minVisual = 60;
        const maxVisual = Math.min(width, height) * 0.45; // Légèrement agrandi
        const logMin = Math.log(200);
        const logMax = Math.log(500000);
        const visualRadius = minVisual + (Math.log(this.altitudeKm) - logMin) / (logMax - logMin) * (maxVisual - minVisual);

        // Calcul des décalages
        const dilations = this.computeDilations();

        // Mise à jour de la vitesse angulaire
        const omega = this.getVisualAngularSpeed();
        this.satelliteAngle += omega * dt;

        // 1. La Terre
        ctx.save();
        const earthGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, 40);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = earthGrad;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 2. Le satellite
        const satX = cx + Math.cos(this.satelliteAngle) * visualRadius;
        const satY = cy + Math.sin(this.satelliteAngle) * visualRadius;
        
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(satX, satY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. Badge GPS
        if (this.altitudeKm >= 19000 && this.altitudeKm <= 21000) {
            ctx.save();
            ctx.translate(satX, satY);
            
            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.fill();

            const text = "GPS";
            ctx.font = 'bold 12px sans-serif';
            const tw = ctx.measureText(text).width + 10;
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(-tw/2, -28, tw, 18, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#06b6d4';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, -19);
            
            ctx.restore();
        }

        // --- PANNEAU GAUCHE : LES CHIFFRES ---
        const panelLX = 40;
        const panelLY = 80;
        const panelLW = 320; // Aligné sur la largeur du graphe
        const panelLH = 240; // Aligné sur la hauteur du graphe
        
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(panelLX, panelLY, panelLW, panelLH, 10);
        ctx.fill();
        ctx.stroke();

        // Titre
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("Décalages temporels", panelLX + 20, panelLY + 30);

        // Ligne
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(panelLX + 20, panelLY + 45);
        ctx.lineTo(panelLX + panelLW - 20, panelLY + 45);
        ctx.stroke();

        // Vitesse
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText("Vitesse orbitale", panelLX + 20, panelLY + 70);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${dilations.v.toFixed(2)} km/s`, panelLX + panelLW - 20, panelLY + 70);

        // RR
        ctx.textAlign = 'left';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText("Effet vitesse (RR)", panelLX + 20, panelLY + 105);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${dilations.rr.toFixed(1)} µs/j`, panelLX + panelLW - 20, panelLY + 105);

        // RG
        ctx.textAlign = 'left';
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText("Effet gravité (RG)", panelLX + 20, panelLY + 140);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${dilations.rg > 0 ? '+' : ''}${dilations.rg.toFixed(1)} µs/j`, panelLX + panelLW - 20, panelLY + 140);

        // Ligne
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(panelLX + 20, panelLY + 160);
        ctx.lineTo(panelLX + panelLW - 20, panelLY + 160);
        ctx.stroke();

        // Total
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText("Total", panelLX + 20, panelLY + 190);
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${dilations.total > 0 ? '+' : ''}${dilations.total.toFixed(1)} µs/j`, panelLX + panelLW - 20, panelLY + 190);

        // Message de contexte
        ctx.textAlign = 'left';
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 12px sans-serif';
        let context = "";
        if (this.altitudeKm < 1000) context = "Orbite basse (ISS)";
        else if (this.altitudeKm < 30000) context = "Orbite moyenne (GPS)";
        else if (this.altitudeKm < 50000) context = "Orbite géostationnaire";
        else if (this.altitudeKm < 350000) context = "Espace lointain";
        else context = "Orbite lunaire";
        ctx.fillText(context, panelLX + 20, panelLY + 220);
        ctx.restore();

        // --- PANNEAU DROIT : LE GRAPHE ---
        const gx = width - 360;
        const gy = 80;
        const gw = 320; 
        const gh = 240;

        ctx.save();
        
        // Fond du graphe
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(gx, gy, gw, gh, 10);
        ctx.fill();
        ctx.stroke();

        // Titre du graphe
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Décalage par rapport au sol (µs/j)", gx + gw/2, gy + 25);

        // Marges internes
        const marginLeft = 35;
        const marginRight = 25; // Augmenté pour faire de la place au texte de droite
        const marginTop = 45;
        const marginBottom = 30;
        
        const plotX = gx + marginLeft;
        const plotY = gy + marginTop;
        const plotW = gw - marginLeft - marginRight;
        const plotH = gh - marginTop - marginBottom;

        // Échelles
        const minY = -35;
        const maxY = 55;
        const toY = (val) => plotY + plotH - ((val - minY) / (maxY - minY)) * plotH;
        const toX = (idx) => plotX + (idx / (this.curveData.length - 1)) * plotW;

        // Axe Zéro
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(plotX, toY(0));
        ctx.lineTo(plotX + plotW, toY(0));
        ctx.stroke();
        ctx.setLineDash([]);

        // Courbe RR
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        this.curveData.forEach((p, i) => {
            const x = toX(i);
            const y = toY(p.rr);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Courbe RG
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        this.curveData.forEach((p, i) => {
            const x = toX(i);
            const y = toY(p.rg);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Courbe TOTALE
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        this.curveData.forEach((p, i) => {
            const x = toX(i);
            const y = toY(p.total);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Point actuel (orange)
        const currentIndex = (Math.log(this.altitudeKm) - logMin) / (logMax - logMin);
        const px = plotX + currentIndex * plotW;
        const py = toY(dilations.total);

        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Point GPS
        const gpsAlt = 20200;
        const gpsIndex = (Math.log(gpsAlt) - logMin) / (logMax - logMin);
        const gpsX = plotX + gpsIndex * plotW;
        let gpsTotal = 0;
        for(let p of this.curveData) {
            if (p.alt >= gpsAlt) { gpsTotal = p.total; break; }
        }
        const gpsY = toY(gpsTotal);

        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(gpsX, gpsY, 5, 0, Math.PI * 2); // Grossi (5 au lieu de 4)
        ctx.fill();

        // Étiquettes des axes
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText("+50", plotX - 5, toY(50) + 4);
        ctx.fillText("  0", plotX - 5, toY(0) + 4);
        ctx.fillText("-35", plotX - 5, toY(-35) + 4);

        ctx.textAlign = 'center';
        ctx.fillText("200 km", plotX, plotY + plotH + 18);
        // Décalé de 5px vers la gauche pour ne pas dépasser
        ctx.fillText("500 000 km", plotX + plotW - 15, plotY + plotH + 18);

        ctx.restore();

        // 5. Message en bas
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Le mouvement ralentit le temps (négatif).", cx, height - 55);
        ctx.fillText("La gravité faible l'accélère (positif).", cx, height - 35);
        ctx.restore();
    },

    destroy: function() {}
};