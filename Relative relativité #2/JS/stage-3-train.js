// =====================================================================
// CHAPITRE 3 — LE TRAIN DE LUMIÈRE (ÉTAPE 1/7)
// ---------------------------------------------------------------------
// Le postulat : la vitesse de la lumière est la même pour tous.
// =====================================================================

window.Stages[3] = {
    time: 0,
    stars: [],
    
    flyerX: 0,
    isFinished: false,
    
    beamTimer: 0,
    beamActive: false,
    beamProgress: 0,
    
    hasPlayedSound1: false,
    hasPlayedSound2: false,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "Le Train de Lumière";
        if (numberEl) numberEl.textContent = "CHAPITRE 3 / 14";

        if (narrativeEl) {
           narrativeEl.innerHTML = `
    <p><strong>1. Le postulat</strong></p>
    <p>Einstein pose une règle étrange : <span class="tooltip-trigger" data-tooltip-content="Pourquoi ce postulat ?||Maxwell avait prédit que la lumière voyage à c.||Michelson-Morley n'avaient trouvé aucun éther.||Einstein décide alors de prendre au sérieux une idée bizarre : la vitesse de la lumière est la même pour tous.||Ce n'est pas une évidence. C'est un postulat. On l'accepte, et on en tire les conséquences.">la vitesse de la lumière est la même pour tous <span class="tooltip-icon">ⓘ</span></span>.</p>
    <p>Peu importe la vitesse de la source.</p>
    <p>Peu importe la vitesse de l'observateur.</p>
    <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">C'est un postulat. On l'accepte, et on en tire les conséquences.</p>
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
        this.flyerX = 0;
        this.isFinished = false; 
        this.beamTimer = 0;
        this.beamActive = false;
        this.beamProgress = 0;
        this.hasPlayedSound1 = false;
        this.hasPlayedSound2 = false;
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('3_1'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('2_3'); },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const groundY = height * 0.75;
        const man1X = width * 0.75;
        const flyerY = groundY - 360; 

        this.drawVillage(ctx, width, groundY);

        if (this.flyerX === 0) this.flyerX = -100;
        if (!this.isFinished) {
            this.flyerX += 80 * dt;
            if (this.flyerX > width - 150) {
                this.isFinished = true;
                this.flyerX = width - 150; 
            }
        }

        const man1HandX = man1X - 24;
        const beamMaxDist = man1HandX - (width * 0.1 + 70); 

        if (!this.isFinished) {
            this.beamTimer += dt;
            if (this.beamTimer > 2 && !this.beamActive) {
                this.beamActive = true;
                this.beamTimer = 0;
                this.beamProgress = 0;
            }
            
            if (this.beamActive) {
                this.beamProgress += dt * 300;
                if (this.beamProgress > beamMaxDist) {
                    this.beamActive = false;
                }
            }
        }

        this.drawMan(ctx, man1X, groundY, '#38bdf8', true);

        if (this.beamActive && !this.isFinished) {
            ctx.save();
            const alpha = Math.max(0, 1 - (this.beamProgress / beamMaxDist));
            ctx.strokeStyle = `rgba(253, 224, 71, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.shadowColor = `rgba(253, 224, 71, ${alpha})`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(man1HandX, groundY - 28);
            ctx.lineTo(man1HandX - this.beamProgress, groundY - 28);
            ctx.stroke();
            ctx.restore();
        }

        this.drawFlyer(ctx, this.flyerX, flyerY, '#22c55e');

        if (this.time > 2 && !this.hasPlayedSound1 && !this.isFinished) {
            if (window.SoundUtils && typeof window.SoundUtils.playTic === 'function') {
                window.SoundUtils.playTic();
            }
            this.hasPlayedSound1 = true;
        }
        if (this.time > 2) {
            this.drawBubble(ctx, man1X, groundY - 120, "Je vois la lumière à c", '#38bdf8');
        }

        if (this.time > 4 && !this.hasPlayedSound2 && !this.isFinished) {
            if (window.SoundUtils && typeof window.SoundUtils.playBeep === 'function') {
                window.SoundUtils.playBeep(587.33, 0.05, 0.05);
            }
            this.hasPlayedSound2 = true;
        }
        if (this.time > 4) {
            const bubbleX = Math.min(this.flyerX, width - 150);
            this.drawBubble(ctx, bubbleX, flyerY - 60, "Moi aussi, je vois c", '#22c55e');
        }

        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'italic 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La vitesse de la lumière est la même pour tous.", width / 2, height - 40);
        ctx.restore();
    },

    drawVillage: function(ctx, width, groundY) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, groundY, width, 50);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(width * 0.1, groundY - 80, 60, 80); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width * 0.1 - 10, groundY - 80); ctx.lineTo(width * 0.1 + 30, groundY - 110); ctx.lineTo(width * 0.1 + 70, groundY - 80); ctx.closePath();
        ctx.fillStyle = '#7f1d1d'; ctx.fill(); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#14532d'; ctx.beginPath(); ctx.arc(width * 0.25, groundY - 60, 30, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.fillRect(width * 0.25 - 5, groundY - 40, 10, 40);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(width * 0.4, groundY - 120, 50, 120); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(width * 0.4 + 25, groundY - 160); ctx.lineTo(width * 0.4, groundY - 120); ctx.lineTo(width * 0.4 + 50, groundY - 120); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.rect(width * 0.55, groundY - 60, 80, 60); ctx.fill(); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#14532d'; ctx.beginPath(); ctx.arc(width * 0.68, groundY - 50, 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.fillRect(width * 0.68 - 5, groundY - 35, 10, 35);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.roundRect(width * 0.85, groundY - 40, 60, 25, 4); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(width * 0.85 + 15, groundY - 15, 6, 0, Math.PI * 2); ctx.arc(width * 0.85 + 45, groundY - 15, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    },

    drawMan: function(ctx, x, y, color, hasFlashlight) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(x, y - 40, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - 4, y - 32, 8, 20);
        ctx.fillRect(x - 6, y - 12, 4, 12);
        ctx.fillRect(x + 2, y - 12, 4, 12);
        ctx.fillRect(x + 4, y - 30, 6, 3);
        
        if (hasFlashlight) {
            ctx.fillRect(x - 24, y - 30, 20, 3);
            ctx.fillStyle = '#fde047';
            ctx.beginPath(); ctx.arc(x - 24, y - 28.5, 3, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillRect(x - 10, y - 30, 6, 3);
        }
        ctx.restore();
    },

    drawFlyer: function(ctx, x, y, color) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - 20, y + 15, 80, 15, 8);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.lineTo(x + 5, y + 45); ctx.lineTo(x + 10, y + 30); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 40, y + 30); ctx.lineTo(x + 45, y + 45); ctx.lineTo(x + 50, y + 30); ctx.fill();

        this.drawMan(ctx, x + 25, y + 15, color, false);
        ctx.restore();
    },

    drawBubble: function(ctx, x, y, text, color) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.font = '13px sans-serif';
        const textW = ctx.measureText(text).width + 20;
        ctx.beginPath(); ctx.roundRect(x - textW/2, y - 15, textW, 30, 6); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 5, y + 15); ctx.lineTo(x, y + 25); ctx.lineTo(x + 5, y + 15); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y);
        ctx.restore();
    },

    destroy: function() {}
};