// =====================================================================
// CHAPITRE 2 — LE MYSTÈRE DE LA LUMIÈRE (ÉTAPE 1/4)
// ---------------------------------------------------------------------
// Contexte : L'éther et la lumière.
// Visuel : 2 bandes (Terre+bonhomme, Ampoule). Brouillard d'éther.
// =====================================================================

window.Stages[2] = {
    time: 0,
    stars: [],
    canvas: null,
    
    earthX: 0,
    lampX: 0,
    
    // Particules du brouillard d'éther
    etherParticles: [],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Le Mystère de la Lumière";
        if (numberEl) numberEl.textContent = "CHAPITRE 2 / 14";
        
        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p>En 1672, Newton imagine la lumière comme un flux de petites particules.</p>
                <p>En 1865, Maxwell démontre que la lumière est une <strong>onde électromagnétique</strong>.</p>
                <p>Or, une onde a besoin d'un milieu pour se propager. Ce milieu invisible, c'est <strong>l'éther</strong>.</p>
                <p>La Terre qui tourne autour du Soleil se déplace dans cet éther à environ 30 km/s. Donc, la vitesse de la lumière devrait varier selon la direction. Elle devrait même aller plus vite puisque le vent d'éther la pousse.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        this.canvas = document.getElementById('sim-canvas');

        this.initStars();
        this.initEther();
    },

    initStars: function() {
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    initEther: function() {
        this.etherParticles = [];
        for (let i = 0; i < 150; i++) {
            this.etherParticles.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 4 + 2, 
                alpha: Math.random() * 0.1 + 0.02, 
                speed: 60 // Même vitesse que les objets (60 px/s)
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.earthX = -100;
        this.lampX = -150;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 4; },

    nextStep: function() {
        if (window.Engine) window.Engine.loadStage('2_1');
    },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('1_3'); },

    drawMan: function(ctx, x, y, scale, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(0, -10, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-2, -5, 4, 8);
        ctx.fillRect(-7, -3, 14, 2);
        ctx.fillRect(-4, 3, 2, 6);
        ctx.fillRect(2, 3, 2, 6);
        ctx.restore();
    },

    drawLamp: function(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        
        // Le culot (métal)
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.roundRect(-8, 8, 16, 10, 2);
        ctx.fill();
        
        // Les stries du culot
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-8, 10 + i * 3);
            ctx.lineTo(8, 10 + i * 3);
            ctx.stroke();
        }

        // Le verre (bulbe)
        ctx.fillStyle = 'rgba(253, 224, 71, 0.8)';
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Le filament (petit trait blanc)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-3, -3);
        ctx.lineTo(0, 4);
        ctx.lineTo(3, -3);
        ctx.stroke();

        // Lueur
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253, 224, 71, 0.2)';
        ctx.fill();

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // Fond étoilé (très discret)
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.3})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        // --- DÉFINITION DES 2 BANDES ---
        const bandH = height / 2;
        const earthY = bandH * 0.5;
        const lampY = bandH * 1.5;
        const separationY = bandH;

        // --- 1. DESSIN DU BROUILLARD D'ÉTHER ---
        ctx.save();
        this.etherParticles.forEach(p => {
            // Les particules se déplacent de gauche à droite
            let px = (p.x * width + this.time * p.speed) % width;
            let py = p.y * height + Math.sin(this.time * 2 + p.x * 10) * 5;
            
            ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // --- 2. FLÈCHE DU VENT D'ÉTHER (discrète) ---
        const arrowY = height - 30;
        const arrowXStart = width - 200;
        const arrowXEnd = width - 50;
        
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        
        // Ligne
        ctx.beginPath();
        ctx.moveTo(arrowXStart, arrowY);
        ctx.lineTo(arrowXEnd, arrowY);
        ctx.stroke();
        
        // Pointe
        ctx.beginPath();
        ctx.moveTo(arrowXEnd, arrowY);
        ctx.lineTo(arrowXEnd - 8, arrowY - 4);
        ctx.lineTo(arrowXEnd - 8, arrowY + 4);
        ctx.closePath();
        ctx.fill();
        
        // Texte
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = 'italic 12px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText("Vent d'éther", arrowXStart - 10, arrowY);
        ctx.restore();

        // --- 3. LIGNE DE SÉPARATION ---
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, separationY);
        ctx.lineTo(width, separationY);
        ctx.stroke();
        ctx.restore();

        // --- 4. BANDE 1 : LA TERRE + BONHOMME ---
        if (this.earthX === -100) this.earthX = -50;
        this.earthX += 60 * dt;
        if (this.earthX > width + 50) this.earthX = -50;

        // Terre (2x plus grosse)
        ctx.save();
        ctx.fillStyle = '#0ea5e9';
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.earthX, earthY, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Bonhomme sur la Terre
        this.drawMan(ctx, this.earthX, earthY - 50, 1.5, '#ffffff');

        // Labels "La Terre" et "30 km/s"
        ctx.save();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La Terre", this.earthX, earthY + 70);
        ctx.fillText("30 km/s", this.earthX, earthY + 85);
        ctx.restore();

        // --- 5. BANDE 2 : L'AMPOULE + ONDE ---
        if (this.lampX === -150) this.lampX = -50;
        this.lampX += 60 * dt;
        if (this.lampX > width + 50) this.lampX = -50;

        // L'onde
        const waveRadius = (this.time * 80) % 400; 
        const vRatio = 0.4; 
        const speedRight = waveRadius * (1 + vRatio);
        const speedLeft = waveRadius * (1 - vRatio);
        const offsetX = (speedRight - speedLeft) / 2;
        
        ctx.save();
        
        // On coupe l'onde pour qu'elle ne dépasse pas la ligne de séparation
        ctx.beginPath();
        ctx.rect(0, separationY + 2, width, height - separationY);
        ctx.clip();

        ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
            this.lampX + offsetX, 
            lampY, 
            (speedRight + speedLeft) / 2, 
            waveRadius * (1 - vRatio * 0.5), 
            0, 0, Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();

        // L'ampoule
        this.drawLamp(ctx, this.lampX, lampY);
    },

    destroy: function() {}
};