// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 5/6)
// ---------------------------------------------------------------------
// Croisement face à face. Formule dans le tooltip.
// =====================================================================

window.Stages['3_4'] = {
    time: 0,
    stars: [],
    
    ship1X: 0,
    ship2X: 0,
    
    visualSpeed: 70,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "Le Croisement";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>5. Le croisement (Face à face)</strong></p>
                <p>Deux vaisseaux foncent l'un vers l'autre à 0,95c (95 % de la vitesse de la lumière).</p>
                
                <p style="margin-top: 15px;"><strong>Question 1 : À quelle vitesse se rapprochent-ils ?</strong></p>
                <p>Le bon sens dirait : 0,95 + 0,95 = 1,9c. Mais c'est faux. La relativité interdit de dépasser c.</p>
                <p style="color: #22c55e; font-weight: 600;">En réalité, ils se rapprochent à <span class="tooltip-trigger" data-tooltip-content="D'où vient 0,998c ?||À haute vitesse, les vitesses ne s'additionnent pas simplement.||La formule est :||v = (v1 + v2) / (1 + (v1 · v2) / c²)||Si on remplace v1 et v2 par 0,95c :||v = (0,95 + 0,95) / (1 + 0,95 · 0,95)||v = 1,9 / 1,9025 = 0,998c||Soit 99,8 % de la vitesse de la lumière.">0,998c <span class="tooltip-icon">ⓘ</span></span>.</p>

                <p style="margin-top: 15px;"><strong>Question 2 : Que voit chaque bonhomme ?</strong></p>
                <p>Chacun voit l'autre vaisseau approcher à 0,998c.</p>
                <p style="color: #f59e0b; font-weight: 600;">Mais la lumière, elle, va toujours à c. Peu importe la vitesse des vaisseaux.</p>
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

        this.time = 0;
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
        this.reset();
    },

    reset: function() {
        this.time = 0;
        this.ship1X = 0; 
        this.ship2X = 9999; 
    },

    getCurrentStep: function() { return 5; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('3_5'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('3_3'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        // Étoiles
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });

        const cy1 = height / 2 - 30; // Voie du haut
        const cy2 = height / 2 + 30; // Voie du bas
        
        // Initialisation
        if (this.ship2X === 9999) {
            this.ship2X = width + 100;
            this.ship1X = -100;
        }

        // Animation
        this.ship1X += this.visualSpeed * dt;
        this.ship2X -= this.visualSpeed * dt;

        // Dessin des vaisseaux
        this.drawShip(ctx, this.ship1X, cy1, '#38bdf8', 1); // Vaisseau du haut
        this.drawShip(ctx, this.ship2X, cy2, '#ef4444', -1); // Vaisseau du bas

        // Panneaux toujours visibles
        // Le faux calcul (en rouge)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(width / 2 - 150, height * 0.15, 300, 60, 8);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("0,95c + 0,95c = 1,9c", width / 2, height * 0.15 + 30);
        
        // Barre de radiation
        ctx.beginPath();
        ctx.moveTo(width / 2 - 120, height * 0.15 + 30);
        ctx.lineTo(width / 2 + 120, height * 0.15 + 30);
        ctx.stroke();

        // Le vrai calcul (en vert)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 150, height * 0.75, 300, 60, 8);
        ctx.fill(); ctx.stroke();
        
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 24px monospace';
        ctx.fillText("Réalité : 0,998c", width / 2, height * 0.75 + 30);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.fillText("La vitesse de la lumière est une limite absolue.", width / 2, height * 0.75 + 80);

        ctx.restore();
    },

    drawShip: function(ctx, x, y, color, direction) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(direction, 1); 

        // Corps
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.quadraticCurveTo(30, -20, 0, -20);
        ctx.lineTo(-40, -20);
        ctx.lineTo(-40, 20);
        ctx.lineTo(0, 20);
        ctx.quadraticCurveTo(30, 20, 60, 0);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        
        // Flamme
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-40, -10);
        ctx.lineTo(-70, 0);
        ctx.lineTo(-40, 10);
        ctx.fill();
        
        // Hublot et Bonhomme
        ctx.fillStyle = `${color}88`;
        ctx.beginPath(); ctx.arc(10, 0, 8, 0, Math.PI * 2); ctx.fill();
        
        // Petit bonhomme
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(10, -2, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(9, 0, 2, 4);

        ctx.restore();
        
        // Texte de vitesse
        ctx.fillStyle = color;
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("0,95c", x, y + (direction === 1 ? 40 : -30));
    },

    destroy: function() {}
};