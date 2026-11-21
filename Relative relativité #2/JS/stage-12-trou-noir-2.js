// =====================================================================
// CHAPITRE 12 — LES TROUS NOIRS (ÉTAPE 3/5)
// ---------------------------------------------------------------------
// L'horizon et la singularité : une image décentrée qui respire.
// =====================================================================

window.Stages['12_2'] = {
    time: 0,
    stars: [],
    
    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ GÉNÉRALE";
            domainBadgeEl.style.borderColor = "var(--accent-rg)";
            domainBadgeEl.style.color = "var(--accent-rg)";
        }
        if (titleEl) titleEl.textContent = "Le Trou Noir";
        if (numberEl) numberEl.textContent = "CHAPITRE 12 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. L'horizon et la singularité</strong></p>
                <p>Un trou noir se forme lorsqu'une quantité de matière est tellement comprimée que même la lumière ne peut plus s'en échapper.</p>
                <p>Cette limite possède une taille précise appelée <span class="tooltip-trigger" data-tooltip-content="Rayon de Schwarzschild||Le physicien Karl Schwarzschild a été le premier à calculer la taille de l'horizon, fin 1915.||La formule est : R_s = 2GM/c²||G : constante gravitationnelle||M : masse du trou noir||c : vitesse de la lumière||Pour un trou noir de 10 masses solaires : R_s ≈ 30 km||Pour un trou noir supermassif (4 milliards de masses solaires) : R_s ≈ 12 milliards de km">rayon de Schwarzschild <span class="tooltip-icon">ⓘ</span></span>.</p>
				<p>Un trou noir, c'est une région, pas un objet. La seule chose qui le définit, c'est que la lumière ne peut plus en sortir. Et le critère pour savoir si un corps en est un, c'est : <em>est-ce que son rayon est plus petit que son rayon de Schwarzschild ?</em></p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Vu de loin, le temps d'un objet qui s'approche de l'horizon paraît ralentir indéfiniment. Au cœur, les équations de la relativité générale cessent d'avoir un sens. C'est la singularité.</p>
				<p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Si le Soleil devait devenir un trou noir, il faudrait compresser son volume actuel d'un facteur d'environ 1,3 × 10¹⁶ (soit plus de 10 millions de milliards de fois). Son diamètre passerait alors d'environ 1,4 million de km à environ 6 km. Malgré tout, les planètes continueraient à tourner autour de lui (la masse ne change pas), mais le système solaire plongerait dans l'obscurité totale.</p>
            `;

            // Gestion du tooltip
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
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        
        // Champ d'étoiles
        this.stars = [];
        for (let i = 0; i < 200; i++) {
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

    reset: function() {
        this.time = 0;
        // Nettoyage du tooltip
        const citationZone = document.getElementById('citation-zone');
        if (citationZone) {
            citationZone.innerHTML = '';
            citationZone.classList.remove('active');
        }
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 5; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('12_3'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('12_1'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        const cx = width * 0.68;
        const cy = height * 0.57;
        
        const masseRadius = 40;
        const horizonPulse = Math.sin(this.time * 1.5) * 3;
        const horizonRadius = 90 + horizonPulse;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        // Fond étoilé avec déformation
        this.stars.forEach(star => {
            let sx = star.x * width;
            let sy = star.y * height;
            
            const dx = sx - cx;
            const dy = sy - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const influenceRadius = 250;
            if (dist < influenceRadius && dist > 1) {
                const influence = Math.pow(1 - dist / influenceRadius, 2);
                const deformFactor = 1 + influence * 0.4;
                sx = cx + dx * deformFactor;
                sy = cy + dy * deformFactor;
            }
            
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            const alpha = star.alpha * (0.4 + 0.6 * twinkle) * 0.8;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Halo
        const haloGrad = ctx.createRadialGradient(cx, cy, masseRadius, cx, cy, horizonRadius);
        haloGrad.addColorStop(0, 'rgba(30, 41, 59, 0.6)');
        haloGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.2)');
        haloGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Masse
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx, cy, masseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, masseRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Horizon (ultra-discret)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.restore();
    },

    destroy: function() {}
};