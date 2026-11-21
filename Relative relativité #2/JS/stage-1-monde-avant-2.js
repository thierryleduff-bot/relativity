// =====================================================================
// CHAPITRE 1 — LE MONDE D'AVANT (ÉTAPE 3/3)
// ---------------------------------------------------------------------
// La vitesse de la lumière. QCM interactif dans le canvas.
// =====================================================================

window.Stages['1_2'] = {
    time: 0,
    phase: 'approach',
    
    beamLeftX: 0,
    beamRightX: 0,
    
    selectedAnswer: null,
    canvas: null,
    clickHandler: null,
    mouseMoveHandler: null,
    hoveredButton: null,
    
    lampW: 40,
    lampH: 20,
    
    answers: [
        {
            id: 'A',
            text: 'A : Nulle',
            response: "Pfff... C'est toi qu'es nul(le) !",
            soundType: 'wrong'
        },
        {
            id: 'B',
            text: 'B : 300 000 km/s',
            response: "Einstein a dit que rien ne peut dépasser C.",
            soundType: 'wrong'
        },
        {
            id: 'C',
            text: 'C : 2C (addition des vitesses)',
            response: "Les vitesses que parcourent des faisceaux de lumière ne s'additionnent pas, ne se soustraient pas et ne peuvent dépasser la valeur de C. Même s'ils se croisent alors qu'ils voyagent à la vitesse C chacun, leur vitesse relative sera de C.",
            soundType: 'wrong'
        },
        {
            id: 'D',
            text: 'D : C (299 792 458 m/s)',
            response: "Exact ! La vitesse de la lumière est toujours C, peu importe l'observateur. Elle ne s'additionne pas. C'est la réalité.",
            soundType: 'correct'
        }
    ],

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "La vitesse de la lumière";
        if (numberEl) numberEl.textContent = "CHAPITRE 1 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>3. La vitesse de la lumière</strong></p>
                <p>Voici deux faisceaux lumineux qui se croisent. Ils voyagent chacun à la vitesse de la lumière (c = 299 792 458 m/s).</p>
                <p>C'est environ 7,5 fois le tour de la Terre en une seconde. La lumière du Soleil met 8 minutes et 20 secondes à nous parvenir.</p>
                <p>Selon la logique de Galilée, on pourrait penser que leur vitesse relative est de 2c. Ce serait une erreur.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Observez les faisceaux se rencontrer, puis répondez à la question dans le canvas.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.reset();
        this.canvas = document.getElementById('sim-canvas');
        
        if (this.canvas) {
            this.clickHandler = (e) => {
                if (this.phase !== 'question' && this.phase !== 'answered') return;
                
                const rect = this.canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                const startX = this.canvas.width / 2 - 250;
                const startY = this.canvas.height * 0.55;
                const btnW = 500;
                const btnH = 50;
                const spacing = 60;

                this.answers.forEach((ans, index) => {
                    const btnY = startY + index * spacing;
                    if (clickX >= startX && clickX <= startX + btnW &&
                        clickY >= btnY - btnH/2 && clickY <= btnY + btnH/2) {
                        this.selectedAnswer = ans.id;
                        this.phase = 'answered';
                        this.playSound(ans.soundType);
                    }
                });
            };

            this.mouseMoveHandler = (e) => {
                if (this.phase !== 'question' && this.phase !== 'answered') return;
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const startX = this.canvas.width / 2 - 250;
                const startY = this.canvas.height * 0.55;
                const btnW = 500;
                const btnH = 50;
                const spacing = 60;

                this.hoveredButton = null;
                this.answers.forEach((ans, index) => {
                    const btnY = startY + index * spacing;
                    if (mouseX >= startX && mouseX <= startX + btnW &&
                        mouseY >= btnY - btnH/2 && mouseY <= btnY + btnH/2) {
                        this.hoveredButton = ans.id;
                    }
                });
                this.canvas.style.cursor = this.hoveredButton ? 'pointer' : 'default';
            };
            
            this.canvas.addEventListener('click', this.clickHandler);
            this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        }
    },

    playSound: function(type) {
        if (!window.SoundUtils) return;
        
        // On force l'initialisation de l'audio
        window.SoundUtils.initContext();
        
        if (type === 'correct') {
            // Son joli : accord parfait (do - mi - sol)
            window.SoundUtils.playBeep(523.25, 0.1, 0.05); // Do
            setTimeout(() => window.SoundUtils.playBeep(659.25, 0.1, 0.05), 100); // Mi
            setTimeout(() => window.SoundUtils.playBeep(783.99, 0.2, 0.05), 200); // Sol
        } else {
            // Son mauvais : dissonance (triton)
            window.SoundUtils.playBeep(440, 0.15, 0.05); // La
            setTimeout(() => window.SoundUtils.playBeep(622.25, 0.25, 0.05), 100); // Ré#
        }
    },

    reset: function() {
        this.time = 0;
        this.phase = 'approach';
        this.beamLeftX = 0;
        this.beamRightX = 0;
        this.selectedAnswer = null;
        this.hoveredButton = null;
        
        if (this.canvas) {
            this.canvas.style.cursor = 'default';
        }
    },

    getCurrentStep: function() { return 3; },
    getTotalSteps: function() { return 4; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('1_3'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('1_1'); },

    drawLamp: function(ctx, x, y, direction) {
        ctx.save();
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.roundRect(x - this.lampW/2, y - this.lampH/2, this.lampW, this.lampH, 6);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        if (direction === 1) {
            ctx.arc(x + this.lampW/2 - 8, y, 4, 0, Math.PI * 2);
        } else {
            ctx.arc(x - this.lampW/2 + 8, y, 4, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.restore();
    },

    drawTitle: function(ctx, width) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Titre "Exercice de pensée" avec un style élégant
        ctx.font = 'bold 28px "Georgia", serif';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText("Exercice de pensée", width / 2, 50);
        
        // Petit trait décoratif sous le titre
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 100, 75);
        ctx.lineTo(width / 2 + 100, 75);
        ctx.stroke();
        
        ctx.restore();
    },

    drawQCM: function(ctx, width, height) {
        const startX = width / 2 - 250;
        const startY = height * 0.55;
        const btnW = 500;
        const btnH = 50;
        const spacing = 60;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Titre de la question
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 22px sans-serif';
        ctx.fillText("À quelle vitesse les deux faisceaux se croisent-ils ?", width / 2, height * 0.42);

        // Boutons
        this.answers.forEach((ans, index) => {
            const btnY = startY + index * spacing;
            const isSelected = this.selectedAnswer === ans.id;
            const isHovered = this.hoveredButton === ans.id;

            // Ombre portée
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.roundRect(startX + 4, btnY - btnH/2 + 4, btnW, btnH, 8);
            ctx.fill();

            // Fond du bouton
            if (isSelected) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
            } else if (isHovered) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
            } else {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
                ctx.lineWidth = 1;
            }

            ctx.beginPath();
            ctx.roundRect(startX, btnY - btnH/2, btnW, btnH, 8);
            ctx.fill(); ctx.stroke();

            // Texte du bouton
            ctx.fillStyle = isSelected ? '#f59e0b' : (isHovered ? '#ffffff' : '#cbd5e1');
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(ans.text, startX + 30, btnY);
        });

        // Réponse affichée (sous les boutons, pas par-dessus)
        if (this.phase === 'answered') {
            const selected = this.answers.find(a => a.id === this.selectedAnswer);
            if (selected) {
                const answerY = startY + this.answers.length * spacing + 20;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                
                ctx.font = 'italic 16px sans-serif';
                const words = selected.response.split(' ');
                let lines = [];
                let currentLine = '';
                const maxLineWidth = 700;

                words.forEach(word => {
                    const testLine = currentLine + word + ' ';
                    if (ctx.measureText(testLine).width > maxLineWidth && currentLine !== '') {
                        lines.push(currentLine);
                        currentLine = word + ' ';
                    } else {
                        currentLine = testLine;
                    }
                });
                lines.push(currentLine);

                const lineHeight = 22;
                const textHeight = lines.length * lineHeight;
                const boxH = textHeight + 30;
                const boxW = 740;
                
                ctx.beginPath();
                ctx.roundRect(width/2 - boxW/2, answerY, boxW, boxH, 12);
                ctx.fill(); ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                let lineY = answerY + 15 + lineHeight/2;
                lines.forEach(line => {
                    ctx.fillText(line, width/2, lineY);
                    lineY += lineHeight;
                });
            }
        }

        ctx.restore();
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;

        const midX = width / 2;
        const beamSpeed = 80; 

        // Gestion de l'animation des faisceaux
        if (this.phase === 'approach') {
            this.beamLeftX += beamSpeed * dt;
            if (this.beamLeftX > midX - (60 + this.lampW/2)) {
                this.beamLeftX = midX - (60 + this.lampW/2);
            }

            this.beamRightX -= beamSpeed * dt;
            if (this.beamRightX < -midX + (60 + this.lampW/2)) {
                this.beamRightX = -midX + (60 + this.lampW/2);
            }

            if (this.beamLeftX >= midX - (60 + this.lampW/2) && this.beamRightX <= -midX + (60 + this.lampW/2)) {
                this.phase = 'question';
            }
        }

        // Fond étoilé
        ctx.save();
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Titre "Exercice de pensée"
        this.drawTitle(ctx, width);

        const beamAY = height * 0.25;
        const beamBY = height * 0.35;

        // Lampes
        this.drawLamp(ctx, 60, beamAY, 1); 
        this.drawLamp(ctx, width - 60, beamBY, -1); 

        // Faisceaux
        ctx.save();
        ctx.strokeStyle = '#fde047';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(60 + this.lampW/2, beamAY);
        ctx.lineTo(60 + this.lampW/2 + this.beamLeftX, beamAY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - 60 - this.lampW/2, beamBY);
        ctx.lineTo(width - 60 - this.lampW/2 + this.beamRightX, beamBY);
        ctx.stroke();
        ctx.restore();

        // QCM
        if (this.phase === 'question' || this.phase === 'answered') {
            this.drawQCM(ctx, width, height);
        }
    },

    destroy: function() {
        if (this.canvas) {
            if (this.clickHandler) this.canvas.removeEventListener('click', this.clickHandler);
            if (this.mouseMoveHandler) this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
            this.canvas.style.cursor = 'default';
        }
    }
};