// =====================================================================
// CHAPITRE 1 — LE MONDE D'AVANT
// ---------------------------------------------------------------------
// Frise chronologique verticale + animations symboliques + photos.
// =====================================================================

window.Stages[1] = {
    time: 0,
    stars: [],
    canvas: null,
    mouseMoveHandler: null,
    clickHandler: null,
    mouseX: 0,
    mouseY: 0,
    
    currentFocusIndex: 0,
    cycleTime: 0,
    fadeDuration: 1.0,
    displayDuration: 10.0,
    totalCycleDuration: 12.0,

    images: {},

    nodes: [
        {
            name: "Aristote",
            date: "~350 av. notre ère",
            contribution: "La Terre est immobile au centre de l'univers. Le ciel est parfait. Les objets lourds tombent parce que c'est leur place naturelle.",
            yRatio: 0.15,
            imgSrc: "IMG/aristote.jpg"
        },
        {
            name: "Nicolas Copernic",
            date: "1543",
            contribution: "La Terre tourne autour du Soleil. L'idée est scandaleuse, mais elle simplifie les calculs.",
            yRatio: 0.32,
            imgSrc: "IMG/copernic.jpg"
        },
        {
            name: "Johannes Kepler",
            date: "1609",
            contribution: "Les planètes décrivent des ellipses, pas des cercles. Trois lois précises, mais aucune explication.",
            yRatio: 0.49,
            imgSrc: "IMG/kepler.jpg"
        },
        {
            name: "Galilée",
            date: "1638",
            contribution: "La chute des corps ne dépend pas de leur masse. Le principe d'inertie. La physique devient mathématique.",
            yRatio: 0.66,
            imgSrc: "IMG/galilee.jpg"
        },
        {
            name: "Isaac Newton",
            date: "1687",
            contribution: "Une force universelle attire les corps : F = GMm/r². Sa théorie explique tout, pendant deux siècles.",
            yRatio: 0.83,
            imgSrc: "IMG/newton.jpg"
        }
    ],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Le Monde d'avant";
        if (numberEl) numberEl.textContent = "CHAPITRE 1 / 14";
        
        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p>Pendant plus de deux mille ans, la physique a cherché à expliquer le mouvement des corps et la structure du ciel.</p>
                <p>Ce chapitre retrace les grandes étapes qui ont mené à Newton — et à la physique classique.</p>
                <p style="color:#94a3b8; font-size:0.85rem; font-style:italic; margin-top:20px;">Astuce : cliquez sur un personnage de la frise pour lancer son animation.</p>
            `;
        }
        
        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.stars = [];
        this.canvas = document.getElementById('sim-canvas');
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.currentFocusIndex = 0;
        this.cycleTime = 0;

        this.initStars();
        this.preloadImages();

        if (this.canvas) {
            this.mouseMoveHandler = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
                
                const timelineCenterX = this.canvas.width * 0.55;
                let isOverNode = false;
                this.nodes.forEach(node => {
                    const nodeY = this.canvas.height * node.yRatio;
                    const dist = Math.sqrt(
                        Math.pow(this.mouseX - timelineCenterX, 2) + 
                        Math.pow(this.mouseY - nodeY, 2)
                    );
                    if (dist < 30) isOverNode = true;
                });
                this.canvas.style.cursor = isOverNode ? 'pointer' : 'default';
            };

            this.clickHandler = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const timelineCenterX = this.canvas.width * 0.55;

                this.nodes.forEach((node, index) => {
                    const nodeY = this.canvas.height * node.yRatio;
                    const dist = Math.sqrt(
                        Math.pow(clickX - timelineCenterX, 2) + 
                        Math.pow(clickY - nodeY, 2)
                    );
                    if (dist < 30) {
                        this.currentFocusIndex = index;
                        this.cycleTime = this.fadeDuration;
                    }
                });
            };

            this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
            this.canvas.addEventListener('click', this.clickHandler);
        }
    },

    preloadImages: function() {
        this.nodes.forEach(node => {
            const img = new Image();
            img.src = node.imgSrc;
            this.images[node.name] = img;
        });
    },

    initStars: function() {
        for (let i = 0; i < 100; i++) {
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
        this.cycleTime = 0;
        this.currentFocusIndex = 0;
        if (this.canvas) {
            this.canvas.style.cursor = 'default';
        }
    },

    getCurrentStep: function() { return 1; },
    getTotalSteps: function() { return 4; },
	 nextStep: function() { if (window.Engine) window.Engine.loadStage('1_1'); },
    prevStep: function() {},

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        this.cycleTime += dt;
        if (this.cycleTime >= this.totalCycleDuration) {
            this.cycleTime -= this.totalCycleDuration;
            this.currentFocusIndex = (this.currentFocusIndex + 1) % this.nodes.length;
        }

        let focusAlpha = 1.0;
        if (this.cycleTime < this.fadeDuration) {
            focusAlpha = this.cycleTime / this.fadeDuration;
        } else if (this.cycleTime > this.fadeDuration + this.displayDuration) {
            focusAlpha = 1.0 - ((this.cycleTime - this.fadeDuration - this.displayDuration) / this.fadeDuration);
        }
        focusAlpha = Math.max(0, Math.min(1, focusAlpha));

        this.drawStars(ctx, width, height);

        const timelineCenterX = width * 0.55;
        const animCenterX = width * 0.25;
        const animCenterY = height * 0.55;

        this.drawFocus(ctx, animCenterX, height * 0.25, focusAlpha);
        this.drawAnimation(ctx, animCenterX, animCenterY, width, height, focusAlpha, this.cycleTime);
        this.drawTimeline(ctx, width, height, timelineCenterX);
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

    drawFocus: function(ctx, cx, cy, alpha) {
        if (alpha <= 0) return;
        
        const node = this.nodes[this.currentFocusIndex];
        const img = this.images[node.name];

        if (!img || !img.complete) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        
        const maxDim = 120;
        const ratio = img.width / img.height;
        let drawW = maxDim;
        let drawH = maxDim;
        
        if (ratio > 1) drawH = maxDim / ratio;
        else drawW = maxDim * ratio;

        const drawX = cx - drawW / 2;
        const drawY = cy - drawH / 2;

        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxDim);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxDim, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(drawW, drawH) / 2, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        ctx.restore();
    },

    drawAnimation: function(ctx, cx, cy, width, height, alpha, localTime) {
        if (alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = alpha;
        const animTime = localTime - this.fadeDuration;

        if (this.currentFocusIndex === 0) this.drawAristote(ctx, cx, cy, animTime);
        else if (this.currentFocusIndex === 1) this.drawCopernic(ctx, cx, cy, animTime);
        else if (this.currentFocusIndex === 2) this.drawKepler(ctx, cx, cy, animTime);
        else if (this.currentFocusIndex === 3) this.drawGalilee(ctx, cx, cy, animTime);
        else if (this.currentFocusIndex === 4) this.drawNewton(ctx, cx, cy, animTime);

        ctx.restore();
    },

    drawAristote: function(ctx, cx, cy, t) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath(); ctx.arc(cx, cy, 30 + i * 30, 0, Math.PI * 2); ctx.stroke();
        }

        const angle = t * 0.5;
        const radius = 90;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(cx + Math.cos(angle)*radius, cy + Math.sin(angle)*radius, 6, 0, Math.PI*2); ctx.fill();
        this.drawLabel(ctx, "Géocentrisme", cx, cy + 130, '#94a3b8');
    },

    drawCopernic: function(ctx, cx, cy, t) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill();

        const radius = 80;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

        const angle = t * 0.8;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx + Math.cos(angle)*radius, cy + Math.sin(angle)*radius, 8, 0, Math.PI*2); ctx.fill();
        this.drawLabel(ctx, "Héliocentrisme", cx, cy + 130, '#94a3b8');
    },

    drawKepler: function(ctx, cx, cy, t) {
        const a = 90, b = 60, c = Math.sqrt(a*a - b*b);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(cx - c, cy, 12, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();

        const meanAngle = t * 0.8;
        const angle = meanAngle + 0.3 * Math.sin(meanAngle); 
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx + Math.cos(angle)*a, cy + Math.sin(angle)*b, 8, 0, Math.PI*2); ctx.fill();
        this.drawLabel(ctx, "Lois de Kepler", cx, cy + 130, '#94a3b8');
    },

    drawGalilee: function(ctx, cx, cy, t) {
        const groundY = cy + 60;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 80, groundY);
        ctx.lineTo(cx + 80, groundY);
        ctx.stroke();

        const fallDuration = 1.5;
        const totalCycle = fallDuration + 1.0;
        const progress = (t % totalCycle) / fallDuration;
        
        let ballY;
        if (progress <= 1.0) {
            const dropDist = 100 * (progress * progress);
            ballY = (cy - 40) + dropDist;
        } else {
            const bounceProgress = (progress - 1.0) / (1.0 - 1.0/fallDuration);
            const bounceHeight = 20 * Math.sin(bounceProgress * Math.PI) * (1 - bounceProgress); 
            ballY = groundY - 12 - bounceHeight;
        }

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx - 20, ballY, 12, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(cx + 20, ballY, 6, 0, Math.PI * 2); ctx.fill();

        this.drawLabel(ctx, "Chute des corps", cx, cy + 130, '#94a3b8');
    },

    drawNewton: function(ctx, cx, cy, t) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill();

        const radius = 80;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

        const angle = t * 0.6;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();

        const dx = cx - px;
        const dy = cy - py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const ux = dx / dist, uy = dy / dist;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + ux * 30, py + uy * 30); ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        const ax = px + ux*30, ay = py + uy*30;
        const perpX = -uy, perpY = ux;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - ux*8 + perpX*4, ay - uy*8 + perpY*4);
        ctx.lineTo(ax - ux*8 - perpX*4, ay - uy*8 - perpY*4);
        ctx.closePath(); ctx.fill();

        const tangentX = -Math.sin(angle);
        const tangentY = Math.cos(angle);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + tangentX * 40, py + tangentY * 40);
        ctx.stroke();
        
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('F', px + ux * 20 + 5, py + uy * 20 - 5);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('v', px + tangentX * 30 + 5, py + tangentY * 30 + 5);

        this.drawLabel(ctx, "Gravitation", cx, cy + 130, '#94a3b8');
    },

    drawLabel: function(ctx, text, x, y, color) {
        ctx.fillStyle = color;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
    },

    drawTimeline: function(ctx, width, height, centerX) {
        const startY = height * 0.12;
        const endY = height * 0.88;
        
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(centerX, startY); ctx.lineTo(centerX, endY); ctx.stroke();
        ctx.restore();

        this.nodes.forEach((node, index) => {
            const nodeY = height * node.yRatio;
            
            const appearProgress = Math.min(1, Math.max(0, (this.time - index * 0.2) / 1.0));
            
            const distToMouse = Math.sqrt(Math.pow(this.mouseX - centerX, 2) + Math.pow(this.mouseY - nodeY, 2));
            const isHovered = distToMouse < 40;
            const isFocused = index === this.currentFocusIndex;

            ctx.save();
            ctx.globalAlpha = appearProgress;

            if (index < this.nodes.length - 1) {
                const nextY = height * this.nodes[index+1].yRatio;
                const sepY = (nodeY + nextY) / 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX + 40, sepY);
                ctx.lineTo(centerX + 250, sepY);
                ctx.stroke();
            }

            let dotRadius = 6;
            let dotColor = '#94a3b8';
            if (isFocused) { dotRadius = 9; dotColor = '#f59e0b'; }
            else if (isHovered) { dotRadius = 7; dotColor = '#cbd5e1'; }

            if (isHovered || isFocused) {
                ctx.fillStyle = isFocused ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                ctx.beginPath(); ctx.arc(centerX, nodeY, 20, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = dotColor;
            ctx.beginPath(); ctx.arc(centerX, nodeY, dotRadius, 0, Math.PI * 2); ctx.fill();

            const textX = centerX + 40;
            
            ctx.fillStyle = (isHovered || isFocused) ? '#ffffff' : '#e2e8f0';
            ctx.font = isFocused ? 'bold 22px sans-serif' : 'bold 20px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText(node.name, textX, nodeY - 4);

            ctx.fillStyle = isFocused ? '#f59e0b' : '#94a3b8';
            ctx.font = 'italic 13px sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(node.date, textX, nodeY + 2);

            ctx.fillStyle = (isHovered || isFocused) ? '#f8fafc' : '#cbd5e1';
            ctx.font = '14px sans-serif';
            ctx.textBaseline = 'top';
            
            const maxWidth = width * 0.35;
            const words = node.contribution.split(' ');
            let line = '';
            let lineY = nodeY + 24;
            
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                if (ctx.measureText(testLine).width > maxWidth && n > 0) {
                    ctx.fillText(line, textX, lineY);
                    line = words[n] + ' ';
                    lineY += 20;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, textX, lineY);

            ctx.restore();
        });
    },

    destroy: function() {
        if (this.canvas) {
            if (this.mouseMoveHandler) this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
            if (this.clickHandler) this.canvas.removeEventListener('click', this.clickHandler);
            this.canvas.style.cursor = 'default';
        }
    }
};