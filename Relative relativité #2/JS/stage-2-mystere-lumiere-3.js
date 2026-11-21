// =====================================================================
// CHAPITRE 2 — LE MYSTÈRE DE LA LUMIÈRE (ÉTAPE 4/4)
// ---------------------------------------------------------------------
// L'expérience de Fizeau et l'impasse de l'éther.
// =====================================================================

window.Stages['2_3'] = {
    time: 0,
    stars: [],
    canvas: null,
    bgOffset: 0,

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "PROLOGUE";
            domainBadgeEl.style.borderColor = "var(--accent-neutral)";
            domainBadgeEl.style.color = "var(--accent-neutral)";
        }
        if (titleEl) titleEl.textContent = "L'impasse de l'éther";
        if (numberEl) numberEl.textContent = "CHAPITRE 2 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>4. L'expérience de Fizeau (1851)</strong></p>
                <p>En 1851, Fizeau fait passer un rayon lumineux dans un tube rempli d'eau en mouvement. Il veut tester une idée : si l'éther existe, la lumière devrait être entraînée par l'eau.</p>
                <p><strong>Résultat :</strong> la lumière est <strong>partiellement</strong> entraînée (~30 %). Mais pas totalement.</p>
                <p><strong>Pourquoi c'est un problème ?</strong></p>
                <p>- Lorentz (éther fixe) : 0 % d'entraînement.</p>
                <p>- Hertz (éther entraîné) : 100 % d'entraînement.</p>
                <p>- Fizeau : 30 %. <strong>Aucune théorie ne l'explique.</strong></p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Combiné à Michelson-Morley (pas de vent d'éther), c'est l'impasse.</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.remove('visible');
            controlsEl.innerHTML = '';
        }

        this.time = 0;
        this.bgOffset = 0;
        this.stars = [];
        this.canvas = document.getElementById('sim-canvas');

        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random(), y: Math.random(),
                size: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2
            });
        }
    },

    reset: function() {
        this.time = 0;
        this.bgOffset = 0;
    },

    getCurrentStep: function() { return 4; },
    getTotalSteps: function() { return 4; },

    nextStep: function() {},
    prevStep: function() {
        if (window.Engine) window.Engine.loadStage('2_2');
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        this.bgOffset += 20 * dt;

        // 1. Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const cx = width / 2;
        
        // 2. TITRE
        ctx.save();
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("L'expérience de Fizeau (1851)", cx, 80);
        ctx.restore();

        // 3. LE TUBE
        const tubeY = 180;
        const tubeW = 400;
        const tubeH = 60;
        const startX = cx - tubeW / 2;

        ctx.save();
        // Fond du tube
        ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(startX, tubeY, tubeW, tubeH, 10);
        ctx.fill(); ctx.stroke();

        // Flux d'eau
        ctx.beginPath();
        ctx.rect(startX, tubeY, tubeW, tubeH);
        ctx.clip();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        for (let i = 0; i < 15; i++) {
            const px = startX + ((this.time * 50 + i * 30) % (tubeW + 20)) - 10;
            const py = tubeY + 15 + (i % 3) * 15;
            // Petite flèche pour le sens
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + 8, py);
            ctx.lineTo(px + 5, py - 3);
            ctx.moveTo(px + 8, py);
            ctx.lineTo(px + 5, py + 3);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        ctx.restore();

        // Label tube
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'italic 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("Eau en mouvement →", startX, tubeY - 10);
        ctx.restore();

        // 4. LE FAISCEAU LUMINEUX
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Dessin ondulé (comme une onde)
        for (let x = startX - 80; x < startX + tubeW + 80; x += 4) {
            const y = tubeY + tubeH / 2 + Math.sin(x * 0.2 + this.time * 10) * 4;
            if (x === startX - 80) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Label faisceau
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'italic 14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText("← Rayon lumineux", startX + tubeW, tubeY - 10);
        ctx.restore();

        // 5. RÉSULTAT
        ctx.save();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("La lumière est partiellement entraînée (~30 %).", cx, tubeY + tubeH + 50);
        ctx.restore();

        // 6. LES 3 THÉORIES
        const theoY = tubeY + tubeH + 120;
        const theoW = 120;
        const theoH = 60;
        const gap = 30;
        const startTheoX = cx - (theoW * 3 + gap * 2) / 2;

        const theories = [
            { name: "Lorentz", val: "0 %", desc: "Éther fixe" },
            { name: "Hertz", val: "100 %", desc: "Éther entraîné" },
            { name: "Fizeau", val: "~30 %", desc: "Mesuré" }
        ];

        ctx.save();
        theories.forEach((t, i) => {
            const x = startTheoX + i * (theoW + gap);
            
            // Cadre
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x, theoY, theoW, theoH, 6);
            ctx.fill(); ctx.stroke();

            // Nom
            ctx.fillStyle = (i === 2) ? '#f59e0b' : '#94a3b8';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(t.name, x + theoW / 2, theoY + 20);

            // Valeur
            ctx.fillStyle = (i === 2) ? '#f59e0b' : '#f1f5f9';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(t.val, x + theoW / 2, theoY + 42);

            // Desc
            ctx.fillStyle = '#64748b';
            ctx.font = '11px sans-serif';
            ctx.fillText(t.desc, x + theoW / 2, theoY + 55);
        });
        ctx.restore();

        // 7. CONCLUSION
        const conclY = theoY + theoH + 50;
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'italic 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("Aucune théorie ne prédit 30 %.", cx, conclY);
        
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText("→ Combiné à M&M, c'est l'IMPASSE.", cx, conclY + 30);
        ctx.restore();
    },

    destroy: function() {}
};