// =====================================================================
// CHAPITRE 0 — BIENVENUE
// ---------------------------------------------------------------------
// Page d'accueil du projet.
// =====================================================================

window.Stages[0] = {
    time: 0,
    stars: [],
    dents: [],
    canvas: null,
    buttonRect: { x: 0, y: 0, w: 0, h: 0 },
    isHoveringButton: false,
    clickHandler: null,
    mouseMoveHandler: null,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "ACCUEIL";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Bienvenue";
        
        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p>Ce projet, sous la forme d'une série d'expériences de pensée, de simulations et de mesures réelles (avec des vrais calculs) est une exploration interactive dans la relativité.</p>
                <p>Prenez le temps de regarder, de manipuler, et de douter.</p>
                
                <div style="margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                    <h3 style="font-size: 0.9rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Sommaire</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.85rem;">
                        <div>
                            <div style="color: #94a3b8; font-weight: bold; font-size: 0.75rem; margin-bottom: 4px;">PROLOGUE</div>
                            <div style="color: #cbd5e1; padding-left: 8px;">1. Monde d'avant<br>2. Mystère lumière</div>
                        </div>
                        <div>
                            <div style="color: #06b6d4; font-weight: bold; font-size: 0.75rem; margin-bottom: 4px;">RELATIVITÉ RESTREINTE</div>
                            <div style="color: #cbd5e1; padding-left: 8px;">3. Train<br>4. Contraction<br>5. Simultanéité<br>6. Jumeaux<br>7. Lorentz/E=mc²</div>
                        </div>
                        <div>
                            <div style="color: #f59e0b; font-weight: bold; font-size: 0.75rem; margin-bottom: 4px;">RELATIVITÉ GÉNÉRALE</div>
                            <div style="color: #cbd5e1; padding-left: 8px;">8. Ascenseur<br>9. Puits grav.<br>10. Courbure<br>11. Lentille<br>12. Trou noir</div>
                        </div>
                        <div>
                            <div style="color: #c084fc; font-weight: bold; font-size: 0.75rem; margin-bottom: 4px;">QUANTIQUE</div>
                            <div style="color: #cbd5e1; padding-left: 8px;">13. Le monde quantique</div>
                        </div>
                        <div>
                            <div style="color: #94a3b8; font-weight: bold; font-size: 0.75rem; margin-bottom: 4px;">ÉPILOGUE</div>
                            <div style="color: #cbd5e1; padding-left: 8px;">14. Épilogue</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px; text-align: center;">
                    <a href="credits.txt" target="_blank" style="font-size: 0.75rem; color: #64748b; text-decoration: none; border-bottom: 1px dotted #64748b;">Crédits</a>
                </div>
            `;
        }
        
        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.stars = [];
        this.dents = [];
        this.canvas = document.getElementById('sim-canvas');
        
        this.initStarsAndDents();

        if (this.canvas) {
            this.clickHandler = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                if (
                    clickX >= this.buttonRect.x &&
                    clickX <= this.buttonRect.x + this.buttonRect.w &&
                    clickY >= this.buttonRect.y &&
                    clickY <= this.buttonRect.y + this.buttonRect.h
                ) {
                    if (window.Engine && typeof window.Engine.loadStage === 'function') {
                        window.Engine.loadStage(1);
                    }
                }
            };
            
            this.mouseMoveHandler = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                this.isHoveringButton = (
                    mouseX >= this.buttonRect.x &&
                    mouseX <= this.buttonRect.x + this.buttonRect.w &&
                    mouseY >= this.buttonRect.y &&
                    mouseY <= this.buttonRect.y + this.buttonRect.h
                );
                
                if (this.canvas) {
                    this.canvas.style.cursor = this.isHoveringButton ? 'pointer' : 'default';
                }
            };

            this.canvas.addEventListener('click', this.clickHandler);
            this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        }
    },

    initStarsAndDents: function() {
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                twinkleSpeed: Math.random() * 2 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        const numDents = Math.random() > 0.5 ? 3 : 4;
        for (let i = 0; i < numDents; i++) {
            this.dents.push({
                x: 0.15 + Math.random() * 0.7,
                y: 0.15 + Math.random() * 0.7,
                radius: Math.random() * 90 + 60,
                depth: Math.random() * 20 + 20,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.3 + 0.1
            });
        }
    },

    reset: function() {
        this.time = 0;
        if (this.canvas) {
            this.canvas.style.cursor = 'default';
        }
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 1; },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.drawStars(ctx, width, height);
        this.drawGrid(ctx, width, height);
        this.drawTextContent(ctx, width, height);
        this.drawButton(ctx, width, height);
    },

    drawStars: function(ctx, width, height) {
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            const alpha = star.alpha * (0.4 + 0.6 * twinkle);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    },

    drawGrid: function(ctx, width, height) {
        const gridSize = 60;
        const rows = Math.ceil(height / gridSize);
        const cols = Math.ceil(width / gridSize);

        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            for (let j = 0; j <= cols; j++) {
                const x = j * gridSize;
                const baseY = i * gridSize;
                const y = this.applyDents(x, baseY, width, height);
                
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        for (let j = 0; j <= cols; j++) {
            ctx.beginPath();
            for (let i = 0; i <= rows; i++) {
                const baseX = j * gridSize;
                const baseY = i * gridSize;
                const x = this.applyDents(baseX, baseY, width, height, true);
                const y = baseY;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        ctx.restore();
    },

    applyDents: function(baseX, baseY, width, height, isVerticalLine = false) {
        let offset = 0;
        
        this.dents.forEach(dent => {
            const dx = baseX - (dent.x * width);
            const dy = baseY - (dent.y * height);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < dent.radius * 2) {
                const breath = (Math.sin(this.time * dent.speed + dent.phase) + 1) / 2;
                const currentDepth = dent.depth * breath;
                const factor = Math.exp(-Math.pow(dist / dent.radius, 2) * 2);
                offset += currentDepth * factor;
            }
        });

        if (isVerticalLine) {
            return baseX + offset;
        } else {
            return baseY + offset;
        }
    },

    drawTextContent: function(ctx, width, height) {
        const centerX = width / 2;
        const startY = height * 0.30;

        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 42px sans-serif';
        ctx.fillText('La Relativité Relativisée', centerX, startY);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 18px sans-serif';
        ctx.fillText('Une histoire de l\'espace, du temps, et de ceux qui les ont repensés', centerX, startY + 40);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        const line1 = "Pendant deux mille ans, l'espace et le temps semblaient évidents : un cadre fixe, une horloge universelle.";
        const line2 = "Puis, en quelques décennies, tout a basculé.";
        const line3 = "Voici quelques idées qui ont redessiné notre univers.";
        
        ctx.fillText(line1, centerX, startY + 100);
        ctx.fillText(line2, centerX, startY + 130);
        ctx.fillText(line3, centerX, startY + 160);

        ctx.restore();
    },

    drawButton: function(ctx, width, height) {
        const btnW = 200;
        const btnH = 50;
        const btnX = (width - btnW) / 2;
        const btnY = height * 0.65;

        this.buttonRect = { x: btnX, y: btnY, w: btnW, h: btnH };

        ctx.save();

        if (this.isHoveringButton) {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.strokeStyle = '#06b6d4';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
        } else {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
            ctx.shadowBlur = 0;
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnW, btnH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.isHoveringButton ? '#ffffff' : '#06b6d4';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Commencer', btnX + btnW / 2, btnY + btnH / 2);

        ctx.restore();
    },

    destroy: function() {
        if (this.canvas) {
            if (this.clickHandler) {
                this.canvas.removeEventListener('click', this.clickHandler);
                this.clickHandler = null;
            }
            if (this.mouseMoveHandler) {
                this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
                this.mouseMoveHandler = null;
            }
            this.canvas.style.cursor = 'default';
        }
    }
};