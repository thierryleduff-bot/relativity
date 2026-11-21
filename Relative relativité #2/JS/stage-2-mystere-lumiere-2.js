// =====================================================================
// CHAPITRE 2 — LE MYSTÈRE DE LA LUMIÈRE (BAC À SABLE)
// ---------------------------------------------------------------------
// JALON 2 : deux plateaux (avec et sans éther).
// Construction progressive à gauche (3s par pièce), puis apparition
// en fondu du panneau de droite au clic. Les photons partent 5s après.
// =====================================================================

window.Stages['2_2'] = {
    time: 0,
    stars: [],
    etherParticles: [],
    
    size: 140,
    
    // État de la rotation
    currentRotation: 0,
    targetRotation: 0,
    isRotating: false,
    
    // État de la construction
    constructionPhase: 0, // 0: émetteur, 1: récepteur, 2: miroir 1, 3: miroir 2, 4: lame, 5: terminé
    constructionTimer: 0,
    stepDuration: 3.0, 
    
    // Gestion du déclenchement
    hasClickedLancer: false,
    rightPanelFade: 0,     // Opacité du panneau droit
    rightTitleFade: 0,     // Opacité du titre droit
    photonDelay: 0,        // Timer de 5s avant le départ des photons
    photonsStarted: false,

    // État pour le panneau de gauche (avec éther)
    left: {
        blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
        redProgress: 0, redExists: false, redIsDone: false,
        isAnimating: false
    },
    
    // État pour le panneau de droite (sans éther)
    right: {
        blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
        redProgress: 0, redExists: false, redIsDone: false,
        isAnimating: false
    },
    
    // Vitesses réduites de 10%
    V_BASE: 72,
    V_SLOW: 63,
    V_FAST: 72,
    V_SLOW_V: 67.5,
    V_FAST_V: 72,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "Bac à sable : M&M";
        if (numberEl) numberEl.textContent = "CHAPITRE 2 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>Jalon 2 : deux photons</strong></p>
                <p>Le vent d'éther va de <strong>gauche à droite</strong>.</p>
                <p>À gauche : avec éther, les vitesses diffèrent. À droite : sans éther, tout est synchrone.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Lancez les ondes, puis tournez le plateau de 90°.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <button id="btn-lancer" class="step-btn" style="width:100%; height:36px; background: #38bdf8; color: #0b0f19; font-weight: bold;" disabled>
                        Construction en cours...
                    </button>
                    <button id="btn-rotate" class="step-btn" style="width:100%; height:36px;">
                        Tourner à 90°
                    </button>
                </div>
            `;

            const btnLancer = document.getElementById('btn-lancer');
            if (btnLancer) {
                btnLancer.onclick = () => {
                    if (!this.hasClickedLancer) {
                        // Premier lancement
                        this.hasClickedLancer = true;
                        this.photonDelay = 0;
                        btnLancer.disabled = true;
                        btnLancer.style.opacity = 0.5;
                        btnLancer.style.cursor = 'not-allowed';
                        btnLancer.textContent = "Apparition de la colonne...";
                    } else {
                        // Relance
                        this.photonDelay = 0;
                        this.photonsStarted = false;
                        this.left = {
                            blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
                            redProgress: 0, redExists: false, redIsDone: false,
                            isAnimating: false
                        };
                        this.right = {
                            blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
                            redProgress: 0, redExists: false, redIsDone: false,
                            isAnimating: false
                        };
                        btnLancer.disabled = true;
                        btnLancer.style.opacity = 0.5;
                        btnLancer.style.cursor = 'not-allowed';
                        btnLancer.textContent = "Préparation...";
                    }
                };
            }

            const btnRotate = document.getElementById('btn-rotate');
            if (btnRotate) {
                btnRotate.onclick = () => {
                    if (this.isRotating || this.left.isAnimating || this.right.isAnimating) return;
                    this.targetRotation = (this.currentRotation === 0) ? Math.PI / 2 : 0;
                    this.isRotating = true;
                    btnRotate.textContent = (this.targetRotation === 0) ? "Tourner à 90°" : "Remettre à 0°";
                };
            }
        }

        this.reset();
        
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        this.initEther();
    },

    initEther: function() {
        this.etherParticles = [];
        for (let i = 0; i < 150; i++) {
            this.etherParticles.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 4 + 2, 
                alpha: Math.random() * 0.1 + 0.02, 
                speed: 60
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.currentRotation = 0;
        this.targetRotation = 0;
        this.isRotating = false;
        this.constructionPhase = 0;
        this.constructionTimer = 0;
        
        this.hasClickedLancer = false;
        this.rightPanelFade = 0;
        this.rightTitleFade = 0;
        this.photonDelay = 0;
        this.photonsStarted = false;
        
        this.left = {
            blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
            redProgress: 0, redExists: false, redIsDone: false,
            isAnimating: false
        };
        this.right = {
            blueProgress: 0, blueIsAnimating: false, blueIsDone: false,
            redProgress: 0, redExists: false, redIsDone: false,
            isAnimating: false
        };
        
        const btnLancer = document.getElementById('btn-lancer');
        if (btnLancer) {
            btnLancer.disabled = true;
            btnLancer.style.opacity = 0.5;
            btnLancer.style.cursor = 'not-allowed';
            btnLancer.textContent = "Construction en cours...";
        }
        const btnRotate = document.getElementById('btn-rotate');
        if (btnRotate) {
            btnRotate.textContent = "Tourner à 90°";
        }
    },

    lancerOndes: function() {
        this.left = {
            blueProgress: 0, blueIsAnimating: true, blueIsDone: false,
            redProgress: 0, redExists: false, redIsDone: false,
            isAnimating: true
        };
        this.right = {
            blueProgress: 0, blueIsAnimating: true, blueIsDone: false,
            redProgress: 0, redExists: false, redIsDone: false,
            isAnimating: true
        };
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 4; },

    nextStep: function() {
        if (window.Engine) window.Engine.loadStage('2_3');
    },
    prevStep: function() {
        if (window.Engine) window.Engine.loadStage('2_1');
    },

    // Vitesses panneau gauche
    getLeftBlueSpeed: function(segment, rotation) {
        const isRotated = (rotation > 0.1);
        if (!isRotated) {
            if (segment === 0) return this.V_BASE;
            if (segment === 1) return this.V_SLOW_V;
            if (segment === 2) return this.V_FAST_V;
            if (segment === 3) return this.V_BASE;
        } else {
            if (segment === 0) return this.V_SLOW;
            if (segment === 1) return this.V_FAST;
            if (segment === 2) return this.V_SLOW;
            if (segment === 3) return this.V_FAST;
        }
        return this.V_BASE;
    },

    getLeftRedSpeed: function(segment, rotation) {
        const isRotated = (rotation > 0.1);
        if (!isRotated) {
            if (segment === 0) return this.V_FAST;
            if (segment === 1) return this.V_SLOW;
            if (segment === 2) return this.V_BASE;
        } else {
            if (segment === 0) return this.V_SLOW_V;
            if (segment === 1) return this.V_FAST_V;
            if (segment === 2) return this.V_BASE;
        }
        return this.V_BASE;
    },

    // Vitesses panneau droit
    getRightBlueSpeed: function(segment, rotation) {
        return this.V_BASE;
    },

    getRightRedSpeed: function(segment, rotation) {
        return this.V_BASE;
    },

    drawWave: function(ctx, x, y, angle, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
        glow.addColorStop(0, color === '#38bdf8' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(239, 68, 68, 0.3)');
        glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, 12, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        
        ctx.restore();
    },

    drawPanel: function(ctx, panel, cx, cy, isLeft, dt) {
        const L = this.size;
        
        let anyAnimating = false;
        
        if (panel.blueIsAnimating && !panel.blueIsDone) {
            anyAnimating = true;
            let segment;
            if (panel.blueProgress < L) segment = 0;
            else if (panel.blueProgress < L * 2) segment = 1;
            else if (panel.blueProgress < L * 3) segment = 2;
            else segment = 3;
            
            const speed = isLeft ? this.getLeftBlueSpeed(segment, this.currentRotation) : this.getRightBlueSpeed(segment, this.currentRotation);
            panel.blueProgress += speed * dt;
            
            if (panel.blueProgress >= L && !panel.redExists) {
                panel.redExists = true;
                panel.redProgress = 0;
            }
            
            if (panel.blueProgress >= L * 4) {
                panel.blueProgress = L * 4;
                panel.blueIsAnimating = false;
                panel.blueIsDone = true;
            }
        }

        if (panel.redExists && !panel.redIsDone) {
            anyAnimating = true;
            let segment;
            if (panel.redProgress < L) segment = 0;
            else if (panel.redProgress < L * 2) segment = 1;
            else segment = 2;
            
            const speed = isLeft ? this.getLeftRedSpeed(segment, this.currentRotation) : this.getRightRedSpeed(segment, this.currentRotation);
            panel.redProgress += speed * dt;
            
            if (panel.redProgress >= L * 3) {
                panel.redProgress = L * 3;
                panel.redIsDone = true;
            }
        }

        if (panel.isAnimating && panel.blueIsDone && panel.redIsDone) {
            panel.isAnimating = false;
        }

        // Dessin de l'appareil
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(this.currentRotation);

        // 1. SOURCE
        ctx.fillStyle = '#1e293b'; 
        ctx.strokeStyle = '#f59e0b'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.roundRect(-L - 25, -15, 25, 30, 4); 
        ctx.fill(); 
        ctx.stroke();
        ctx.fillStyle = '#f59e0b'; 
        ctx.beginPath(); 
        ctx.arc(-L, 0, 4, 0, Math.PI * 2); 
        ctx.fill();

        // 2. MIROIR 1
        ctx.strokeStyle = '#94a3b8'; 
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-30, -L); ctx.lineTo(30, -L); ctx.stroke();

        // 3. MIROIR 2
        ctx.beginPath(); ctx.moveTo(L, -30); ctx.lineTo(L, 30); ctx.stroke();

        // 4. DÉTECTEUR
        ctx.fillStyle = '#1e293b'; 
        ctx.strokeStyle = '#94a3b8'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(-15, L); 
        ctx.lineTo(15, L); 
        ctx.lineTo(0, L + 20); 
        ctx.closePath(); 
        ctx.fill(); 
        ctx.stroke();

        // 5. LAME
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); 
        ctx.moveTo(-20, 20); 
        ctx.lineTo(20, -20); 
        ctx.stroke();

        // 6. PHOTON BLEU
        if (panel.blueProgress > 0) {
            let x = 0, y = 0, angle = 0;
            const p = panel.blueProgress;
            
            if (p <= L) {
                x = -L + p; y = 0; angle = 0;
            } else if (p <= L * 2) {
                x = 0; y = -(p - L); angle = -Math.PI / 2;
            } else if (p <= L * 3) {
                x = 0; y = -L + (p - L * 2); angle = Math.PI / 2;
            } else {
                x = 0; y = (p - L * 3); angle = Math.PI / 2;
            }

            this.drawWave(ctx, x, y, angle, '#38bdf8');
        }

        // 7. PHOTON ROUGE
        if (panel.redExists && panel.redProgress > 0) {
            let x = 0, y = 0, angle = 0;
            const p = panel.redProgress;
            
            if (p <= L) {
                x = p; y = 0; angle = 0;
            } else if (p <= L * 2) {
                x = L - (p - L); y = 0; angle = Math.PI;
            } else {
                x = 0; y = (p - L * 2); angle = Math.PI / 2;
            }

            this.drawWave(ctx, x, y, angle, '#ef4444');
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        // 1. Rotation
        if (this.isRotating) {
            const diff = this.targetRotation - this.currentRotation;
            const step = 2 * dt;
            if (Math.abs(diff) <= step) {
                this.currentRotation = this.targetRotation;
                this.isRotating = false;
            } else {
                this.currentRotation += Math.sign(diff) * step;
            }
        }

        // 2. Construction progressive gauche
        if (this.constructionPhase < 5) {
            this.constructionTimer += dt;
            if (this.constructionTimer >= this.stepDuration) {
                this.constructionTimer = 0;
                this.constructionPhase++;
                
                if (this.constructionPhase === 5) {
                    const btnLancer = document.getElementById('btn-lancer');
                    if (btnLancer) {
                        btnLancer.disabled = false;
                        btnLancer.style.opacity = 1;
                        btnLancer.style.cursor = 'pointer';
                        btnLancer.textContent = "Lancer l'expérience";
                    }
                }
            }
        }

        // 3. Gestion du clic sur "Lancer"
        if (this.hasClickedLancer) {
            // Fade in du titre et du panneau droit
            if (this.rightTitleFade < 1) this.rightTitleFade += dt * 0.5; // 2 secondes pour apparaître
            if (this.rightTitleFade >= 1 && this.rightPanelFade < 1) {
                this.rightPanelFade += dt * 0.5;
            }
            if (this.rightPanelFade > 1) this.rightPanelFade = 1;

            // Timer de 5 secondes avant le départ des photons
            if (!this.photonsStarted) {
                this.photonDelay += dt;
                if (this.photonDelay > 5) {
                    this.photonsStarted = true;
                    this.lancerOndes();
                    const btnLancer = document.getElementById('btn-lancer');
                    if (btnLancer) btnLancer.textContent = "En cours...";
                }
            }
        }

        // Fond étoilé + brouillard d'éther
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle) * 0.3})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });

        this.etherParticles.forEach(p => {
            let px = (p.x * width + this.time * p.speed) % width;
            let py = p.y * height + Math.sin(this.time * 2 + p.x * 10) * 5;
            
            ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // Flèche du vent d'éther
        const arrowY = height - 30;
        const arrowXStart = width - 200;
        const arrowXEnd = width - 50;
        
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(arrowXStart, arrowY);
        ctx.lineTo(arrowXEnd, arrowY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(arrowXEnd, arrowY);
        ctx.lineTo(arrowXEnd - 8, arrowY - 4);
        ctx.lineTo(arrowXEnd - 8, arrowY + 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = 'italic 12px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText("Vent d'éther", arrowXStart - 10, arrowY);
        ctx.restore();

        const halfW = width / 2;

        // 4. Titre de droite (apparaît en fondu)
        if (this.hasClickedLancer && this.rightTitleFade > 0) {
            ctx.save();
            ctx.globalAlpha = Math.min(1, this.rightTitleFade);
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#22c55e'; 
            ctx.fillText("Ce qu'on observe (synchrone)", halfW + halfW / 2, 40);
            ctx.restore();
        }

        // Ligne de séparation
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(halfW, 60); ctx.lineTo(halfW, height - 60); ctx.stroke();
        ctx.restore();

        // 5. Construction / Dessin du panneau gauche
        const leftCx = halfW / 2;
        const leftCy = height / 2;
        const L = this.size;

        if (this.constructionPhase < 5) {
            // Construction pièce par pièce
            ctx.save();
            ctx.translate(leftCx, leftCy);
            ctx.rotate(this.currentRotation);

            // Pièce 1 : Émetteur
            if (this.constructionPhase >= 0) {
                const alpha = (this.constructionPhase === 0) ? this.constructionTimer / this.stepDuration : 1;
                ctx.globalAlpha = Math.min(1, alpha);
                
                ctx.fillStyle = '#1e293b'; 
                ctx.strokeStyle = '#f59e0b'; 
                ctx.lineWidth = 2;
                ctx.beginPath(); 
                ctx.roundRect(-L - 25, -15, 25, 30, 4); 
                ctx.fill(); 
                ctx.stroke();
                ctx.fillStyle = '#f59e0b'; 
                ctx.beginPath(); 
                ctx.arc(-L, 0, 4, 0, Math.PI * 2); 
                ctx.fill();
                
                if (this.constructionPhase === 0) {
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = '12px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("Émetteur", -L - 12, -25);
                }
                ctx.globalAlpha = 1;
            }

            // Pièce 2 : Récepteur
            if (this.constructionPhase >= 1) {
                const alpha = (this.constructionPhase === 1) ? this.constructionTimer / this.stepDuration : 1;
                ctx.globalAlpha = Math.min(1, alpha);
                
                ctx.fillStyle = '#1e293b'; 
                ctx.strokeStyle = '#94a3b8'; 
                ctx.lineWidth = 2;
                ctx.beginPath(); 
                ctx.moveTo(-15, L); 
                ctx.lineTo(15, L); 
                ctx.lineTo(0, L + 20); 
                ctx.closePath(); 
                ctx.fill(); 
                ctx.stroke();
                
                if (this.constructionPhase === 1) {
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '12px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("Récepteur", 0, L + 40);
                }
                ctx.globalAlpha = 1;
            }

            // Pièce 3 : Miroir 1
            if (this.constructionPhase >= 2) {
                const alpha = (this.constructionPhase === 2) ? this.constructionTimer / this.stepDuration : 1;
                ctx.globalAlpha = Math.min(1, alpha);
                
                ctx.strokeStyle = '#94a3b8'; 
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(-30, -L); ctx.lineTo(30, -L); ctx.stroke();
                
                if (this.constructionPhase === 2) {
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '12px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("Miroir 1", 0, -L - 10);
                }
                ctx.globalAlpha = 1;
            }

            // Pièce 4 : Miroir 2
            if (this.constructionPhase >= 3) {
                const alpha = (this.constructionPhase === 3) ? this.constructionTimer / this.stepDuration : 1;
                ctx.globalAlpha = Math.min(1, alpha);
                
                ctx.strokeStyle = '#94a3b8'; 
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(L, -30); ctx.lineTo(L, 30); ctx.stroke();
                
                if (this.constructionPhase === 3) {
                    ctx.fillStyle = '#94a3b8';
                    ctx.font = '12px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("Miroir 2", L + 30, 0);
                }
                ctx.globalAlpha = 1;
            }

            // Pièce 5 : Lame
            if (this.constructionPhase >= 4) {
                const alpha = (this.constructionPhase === 4) ? this.constructionTimer / this.stepDuration : 1;
                ctx.globalAlpha = Math.min(1, alpha);
                
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; 
                ctx.lineWidth = 2;
                ctx.beginPath(); 
                ctx.moveTo(-20, 20); 
                ctx.lineTo(20, -20); 
                ctx.stroke();
                
                if (this.constructionPhase === 4) {
                    ctx.fillStyle = '#38bdf8';
                    ctx.font = '12px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText("Lame", 0, 40);
                }
                ctx.globalAlpha = 1;
            }

            ctx.restore();
        } else {
            // Panneau gauche terminé : on affiche avec ses animations de photons
            this.drawPanel(ctx, this.left, leftCx, leftCy, true, dt);
        }

        // 6. Panneau de droite (apparaît en fondu après le clic)
        if (this.hasClickedLancer && this.rightPanelFade > 0) {
            ctx.save();
            ctx.globalAlpha = this.rightPanelFade;
            this.drawPanel(ctx, this.right, halfW + halfW / 2, height / 2, false, this.photonsStarted ? dt : 0);
            ctx.restore();
        }

        // 7. Titre de gauche (toujours visible)
        ctx.save();
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ef4444'; 
        ctx.fillText("Si l'éther existait (décalage)", halfW / 2, 40);
        ctx.restore();

        // 8. Fin d'animation et gestion du bouton
        if (this.photonsStarted) {
            const leftDone = this.left.blueIsDone && this.left.redIsDone;
            const rightDone = this.right.blueIsDone && this.right.redIsDone;
            
            if (leftDone && rightDone) {
                const btnLancer = document.getElementById('btn-lancer');
                if (btnLancer && btnLancer.disabled && btnLancer.textContent !== "Relancer l'expérience") {
                    btnLancer.disabled = false;
                    btnLancer.style.opacity = 1;
                    btnLancer.style.cursor = 'pointer';
                    btnLancer.textContent = "Relancer l'expérience";
                }
            }
        }
    },

    destroy: function() {}
};