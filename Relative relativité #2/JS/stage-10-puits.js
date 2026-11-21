// =====================================================================
// CHAPITRE 10 — LE PUITS GRAVITATIONNEL (ÉTAPE UNIQUE)
// ---------------------------------------------------------------------
// L'image classique : le puits gravitationnel en 3D.
// =====================================================================

window.Stages[10] = {
    time: 0,
    masse: 60,
    angles: [0, 2, 4],
    G: 15000,
    INCLINATION: 0.55,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Le Puits Gravitationnel";
        if (numberEl) numberEl.textContent = "CHAPITRE 10 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Le puits gravitationnel</strong></p>
                <p>Voici l'image la plus célèbre de la relativité générale.</p>
                <p>La masse creuse l'espace-temps comme une boule sur un trampoline.</p>
                <p>Les planètes roulent sur les parois de ce puits, sans jamais tomber au fond.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Ce n'est pas un trou réel. C'est une autre façon de représenter la géométrie de l'espace-temps.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:14px; width:100%;">
                    <div style="font-size:0.85rem; color:#cbd5e1;">
                        <div style="margin-bottom:6px;">Masse centrale</div>
                        <input id="slider-m" type="range" min="20" max="120" step="1"
                            value="${this.masse}"
                            style="width:100%; accent-color:#f59e0b; cursor:pointer;">
                    </div>
                </div>
            `;

            const sliderM = document.getElementById('slider-m');
            if (sliderM) {
                sliderM.oninput = (e) => {
                    this.masse = parseFloat(e.target.value);
                };
            }
        }

        this.reset();
    },

    reset: function() {
        this.time = 0;
        this.masse = 60;
        this.angles = [0, 2, 4];
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 1; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage(11); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('9_5'); },

    project3D: function(x, y, z) {
        const inc = this.INCLINATION;
        return {
            x: x,
            y: y * Math.sin(inc) - z * Math.cos(inc)
        };
    },

    getZ: function(r) {
        return -(this.masse * 85) / (Math.pow(r, 0.65) + 12);
    },

    drawRings: function(ctx, rings, sectors, maxRadius, arcStart, arcEnd, isFront) {
        for (let i = 1; i <= rings; i++) {
            const r = (i / rings) * maxRadius;
            const z = this.getZ(r);

            ctx.beginPath();
            const step = (arcEnd - arcStart) / (sectors / 2);
            for (let a = arcStart; a <= arcEnd + 0.001; a += step) {
                const x = r * Math.cos(a);
                const y = r * Math.sin(a);
                const p = this.project3D(x, y, z);
                if (a === arcStart) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }

            const ratio = i / rings;
            const red = Math.floor(245 * (1 - ratio) + 56 * ratio);
            const green = Math.floor(158 * (1 - ratio) + 189 * ratio);
            const blue = Math.floor(11 * (1 - ratio) + 248 * ratio);

            const fadeEdge = 1 - Math.pow(ratio, 3);
            const baseAlpha = (isFront ? 0.30 + 0.55 * ratio : 0.10 + 0.25 * ratio) * fadeEdge;

            ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${baseAlpha})`;
            ctx.lineWidth = isFront ? 1.2 : 0.8;
            ctx.stroke();
        }
    },

    drawMeridians: function(ctx, rings, sectors, maxRadius, arcStart, arcEnd, isFront) {
        for (let j = 0; j < sectors; j++) {
            const theta = (j / sectors) * Math.PI * 2;
            if (theta < arcStart || theta > arcEnd + 0.01) continue;

            ctx.beginPath();
            for (let i = 1; i <= rings; i++) {
                const r = (i / rings) * maxRadius;
                const z = this.getZ(r);
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                const p = this.project3D(x, y, z);
                if (i === 1) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }

            const baseColor = isFront ? 0.35 : 0.12;
            ctx.strokeStyle = `rgba(148, 163, 184, ${baseColor})`;
            ctx.lineWidth = isFront ? 1 : 0.7;
            ctx.stroke();
        }
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2 - height * 0.10;
        ctx.translate(cx, cy);

        const rings = 30;
        const sectors = 48;
        const maxRadius = Math.sqrt(width * width + height * height) * 0.6;

        // 1. Dessin de la grille (arrière)
        this.drawRings(ctx, rings, sectors, maxRadius, Math.PI, Math.PI * 2, false);
        this.drawMeridians(ctx, rings, sectors, maxRadius, Math.PI, Math.PI * 2, false);

        // 2. Halo de la masse
        const zCenter = this.getZ(12);
        const pCenter = this.project3D(0, 0, zCenter);
        const centerRadius = 10 + this.masse * 0.14;

        ctx.save();
        const haloGrad = ctx.createRadialGradient(
            pCenter.x, pCenter.y, centerRadius * 0.8,
            pCenter.x, pCenter.y, centerRadius * 2.8
        );
        haloGrad.addColorStop(0, 'rgba(245, 158, 11, 0.30)');
        haloGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.10)');
        haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(pCenter.x, pCenter.y, centerRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Ombre de la masse
        ctx.save();
        const shadowGrad = ctx.createRadialGradient(
            pCenter.x, pCenter.y + centerRadius * 0.4, 0,
            pCenter.x, pCenter.y + centerRadius * 0.4, centerRadius * 2
        );
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(pCenter.x, pCenter.y + centerRadius * 0.45, centerRadius * 2, centerRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. La masse elle-même
        const centerGrad = ctx.createRadialGradient(
            pCenter.x - centerRadius * 0.4, pCenter.y - centerRadius * 0.4, centerRadius * 0.05,
            pCenter.x, pCenter.y, centerRadius
        );
        centerGrad.addColorStop(0, '#fef3c7');
        centerGrad.addColorStop(0.35, '#f59e0b');
        centerGrad.addColorStop(1, '#7c2d12');

        ctx.fillStyle = centerGrad;
        ctx.beginPath();
        ctx.arc(pCenter.x, pCenter.y, centerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Reflet
        ctx.save();
        const reflGrad = ctx.createRadialGradient(
            pCenter.x - centerRadius * 0.4, pCenter.y - centerRadius * 0.45, 0,
            pCenter.x - centerRadius * 0.4, pCenter.y - centerRadius * 0.45, centerRadius * 0.7
        );
        reflGrad.addColorStop(0, 'rgba(255, 255, 255, 0.60)');
        reflGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = reflGrad;
        ctx.beginPath();
        ctx.arc(pCenter.x - centerRadius * 0.4, pCenter.y - centerRadius * 0.45, centerRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 5. Dessin de la grille (avant)
        this.drawRings(ctx, rings, sectors, maxRadius, 0, Math.PI, true);
        this.drawMeridians(ctx, rings, sectors, maxRadius, 0, Math.PI, true);

        // 6. Les planètes
        const timeScale = 450.0;
        const planetDistances = [140, 200, 270];
        const planetColors = ['#38bdf8', '#a855f7', '#22d3ee'];

        planetDistances.forEach((dist, idx) => {
            const omega = Math.sqrt((this.G * this.masse) / Math.pow(dist, 3)) * 0.005 * timeScale;
            this.angles[idx] += omega * dt;
            if (this.angles[idx] > Math.PI * 2) this.angles[idx] -= Math.PI * 2;

            const a = this.angles[idx];
            const x = dist * Math.cos(a);
            const y = dist * Math.sin(a);
            const z = this.getZ(dist);
            const p = this.project3D(x, y, z);

            ctx.fillStyle = planetColors[idx];
            ctx.shadowColor = planetColors[idx];
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, idx === 2 ? 8 : 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // 7. Texte
        ctx.fillStyle = '#94a3b8';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Le puits gravitationnel : la masse creuse l'espace-temps.", 0, height * 0.35);

        ctx.restore();
    },

    destroy: function() {}
};