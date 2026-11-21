// =====================================================================
// CHAPITRE 9 — LA COURBURE DE L'ESPACE-TEMPS (ÉTAPE 1/5)
// ---------------------------------------------------------------------
// Introduction visuelle : la géodésique.
// =====================================================================

window.Stages[9] = {
    time: 0,
    stars: [],
    photonTrail: [],
    photon: { x: 0, y: 0, vx: 0, vy: 0 },
    photonLaunched: false,

    masse: 80,
    vitesse: 150,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "La Géodésique";
        if (numberEl) numberEl.textContent = "CHAPITRE 9 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>1. La géodésique</strong></p>
                <p>Dans le chapitre 3 (le train), le photon allait parfaitement droit. C'est le wagon qui bougeait autour de lui. L'espace n'était pas courbé.</p>
                <p>Mais dans l'ascenseur (chapitre 8), on a vu que la lumière se courbe sous l'effet d'une accélération.</p>
                <p>En 1908, Minkowski a fusionné l'espace et le temps en un seul tissu. Einstein a ensuite compris que la masse de la Terre ne "tire" pas sur la lumière : <strong>elle courbe ce tissu</strong>.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">La lumière ne fait que suivre le chemin le plus droit possible dans un espace courbé. Ce chemin porte un nom : <strong>la géodésique</strong>.</p>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #94a3b8;">
                    C'est comme suivre un grand cercle à la surface de la Terre pour aller d'un point à un autre : c'est la route la plus courte, même si elle paraît courbe vue de l'espace.
                </p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        // Nettoyage des étoiles
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.2 + 0.05,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.reset();
    },

    reset: function() {
        this.time = 0;
        this.photonTrail = [];
        this.photon = { x: 0, y: 0, vx: 0, vy: 0 };
        this.photonLaunched = false;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('9_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('8_1'); },

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

        const cx = width / 2;
        const cy = height / 2;
        const earthRadius = 50;

        // 1. Grille déformée
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.lineWidth = 1;

        const gridSize = 40;

        for (let i = -15; i <= 15; i++) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 10) {
                let baseX = cx + i * gridSize;
                let dx = baseX - cx;
                let dy = y - cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let influence = Math.max(0, 1 - dist / (earthRadius * 5));
                let curve = Math.pow(influence, 2) * 25;

                let drawX = baseX - Math.sign(dx) * curve;
                if (y === 0) ctx.moveTo(drawX, y);
                else ctx.lineTo(drawX, y);
            }
            ctx.stroke();
        }

        for (let i = -15; i <= 15; i++) {
            ctx.beginPath();
            for (let x = 0; x <= width; x += 10) {
                let baseY = cy + i * gridSize;
                let dx = x - cx;
                let dy = baseY - cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let influence = Math.max(0, 1 - dist / (earthRadius * 5));
                let curve = Math.pow(influence, 2) * 25;

                let drawY = baseY - Math.sign(dy) * curve;
                if (x === 0) ctx.moveTo(x, drawY);
                else ctx.lineTo(x, drawY);
            }
            ctx.stroke();
        }
        ctx.restore();

        // 2. La Terre
        ctx.save();
        const earthGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, earthRadius);
        earthGrad.addColorStop(0, '#38bdf8');
        earthGrad.addColorStop(1, '#0c4a6e');
        ctx.fillStyle = earthGrad;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. Simulation de la géodésique
        if (!this.photonLaunched) {
            this.photon = {
                x: 50,
                y: cy - 160,
                vx: this.vitesse,
                vy: 0
            };
            this.photonTrail = [{ x: this.photon.x, y: this.photon.y }];
            this.photonLaunched = true;
        }

        if (this.photonLaunched) {
            const steps = 5;
            const subDt = dt / steps;
            let exitedOrAbsorbed = false;

            for (let s = 0; s < steps; s++) {
                // Absorption par la Terre
                const dxToCenter = this.photon.x - cx;
                const dyToCenter = this.photon.y - cy;
                const distToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter);

                if (distToCenter <= earthRadius) {
                    this.photonLaunched = false;
                    exitedOrAbsorbed = true;
                    break;
                }

                // Accélération centripète avec vitesse constante (c)
                const dx = cx - this.photon.x;
                const dy = cy - this.photon.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (dist > 1) {
                    const strength = (this.masse * 10000) / (distSq + 2500);

                    const dirX = dx / dist;
                    const dirY = dy / dist;

                    this.photon.vx += dirX * strength * subDt;
                    this.photon.vy += dirY * strength * subDt;

                    // Re-normalisation : la vitesse du photon reste constante
                    const currentSpeed = Math.sqrt(this.photon.vx ** 2 + this.photon.vy ** 2);
                    if (currentSpeed > 0) {
                        this.photon.vx = (this.photon.vx / currentSpeed) * this.vitesse;
                        this.photon.vy = (this.photon.vy / currentSpeed) * this.vitesse;
                    }
                }

                this.photon.x += this.photon.vx * subDt;
                this.photon.y += this.photon.vy * subDt;

                if (this.photon.x > width + 50 || this.photon.y < -50 || this.photon.y > height + 50) {
                    this.photonLaunched = false;
                    exitedOrAbsorbed = true;
                    break;
                }
            }

            // Enregistrement d'un point par frame pour alléger la traînée
            if (!exitedOrAbsorbed && this.photonLaunched) {
                this.photonTrail.push({ x: this.photon.x, y: this.photon.y });
            }
        }

        // Dessin de la traînée
        if (this.photonTrail.length > 1) {
            ctx.save();
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(this.photonTrail[0].x, this.photonTrail[0].y);
            for (let i = 1; i < this.photonTrail.length; i++) {
                ctx.lineTo(this.photonTrail[i].x, this.photonTrail[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // Dessin du photon
        if (this.photonLaunched) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(this.photon.x, this.photon.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Texte
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La lumière suit la courbure de l'espace-temps.", cx, height - 40);
        ctx.restore();
    },

    destroy: function() {}
};