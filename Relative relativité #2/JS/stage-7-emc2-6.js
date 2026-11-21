// =====================================================================
// CHAPITRE 7 — E=MC² (ÉTAPE 6/6)
// ---------------------------------------------------------------------
// L'impact. Le multiplicateur c².
// =====================================================================

window.Stages['7_5'] = {
    time: 0,
    stars: [],
    
    items: {
        sucre: { label: "1 carré de sucre (n°4)", massGrams: 6.0, icon: "🧊" },
        eau: { label: "1 cuillère à café d'eau (5 mL)", massGrams: 5.0, icon: "💧" },
        bague: { label: "1 bague en or (alliance moyenne)", massGrams: 3.5, icon: "💍" },
        alu: { label: "1 feuille d'alu 30x30 cm", massGrams: 1.22, icon: "📄" }
    },
    selectedItemKey: 'sucre',

    init: function(titleEl, numberEl, narrativeEl, controlsEl, domainBadgeEl) {
        if (domainBadgeEl) {
            domainBadgeEl.textContent = "RELATIVITÉ RESTREINTE";
            domainBadgeEl.style.borderColor = "var(--accent-rr)";
            domainBadgeEl.style.color = "var(--accent-rr)";
        }
        if (titleEl) titleEl.textContent = "L'impact";
        if (numberEl) numberEl.textContent = "CHAPITRE 7 / 14";

        if (narrativeEl) {
            narrativeEl.innerHTML = `
                <p><strong>6. L'impact</strong></p>
                <p>Parce que la vitesse de la lumière (c) est immense, son carré (c²) est astronomique (9 × 10¹⁶).</p>
                <p>C'est ce multiplicateur géant qui transforme une infime masse en une quantité d'énergie colossale.</p>
                <p style="color: #f59e0b; font-weight: 600; margin-top: 15px;">Choisis un objet pour voir l'énergie qu'il contient :</p>
            `;
        }

        if (controlsEl) {
            controlsEl.classList.add('visible');
            controlsEl.innerHTML = `
                <div style="margin-top: 4px;">
                    <label style="display: block; font-size: 0.85rem; margin-bottom: 6px; color: #cbd5e1;">Choisis un objet du quotidien :</label>
                    <select id="item-select" style="
                        width: 100%;
                        padding: 8px;
                        background: #1e293b;
                        color: #f8fafc;
                        border: 1px solid #475569;
                        border-radius: 6px;
                        font-size: 0.9rem;
                        cursor: pointer;
                    ">
                        <option value="sucre" ${this.selectedItemKey === 'sucre' ? 'selected' : ''}>🧊 1 carré de sucre (~6 g)</option>
                        <option value="eau" ${this.selectedItemKey === 'eau' ? 'selected' : ''}>💧 1 cuillère d'eau (~5 g)</option>
                        <option value="bague" ${this.selectedItemKey === 'bague' ? 'selected' : ''}>💍 1 bague en or (~3,5 g)</option>
                        <option value="alu" ${this.selectedItemKey === 'alu' ? 'selected' : ''}>📄 1 feuille alu 30x30 cm (~1,22 g)</option>
                    </select>
                </div>
            `;

            document.getElementById('item-select').onchange = (e) => {
                this.selectedItemKey = e.target.value;
            };
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
    },

    reset: function() {
        this.time = 0;
        this.selectedItemKey = 'sucre';
        const select = document.getElementById('item-select');
        if (select) select.value = 'sucre';
    },

    getCurrentStep: function() { return 6; },
    getTotalSteps: function() { return 6; },
    nextStep: function() { if (window.Engine) window.Engine.loadStage('8'); },
    prevStep: function() { if (window.Engine) window.Engine.loadStage('7_4'); },

    formatNumber: function(num, decimals = 0) {
        return num.toLocaleString('fr-FR', {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals
        });
    },

    draw: function(ctx, width, height, dt) {
        this.time += dt;
        
        // Fond étoilé
        ctx.save();
        this.stars.forEach(star => {
            const twinkle = (Math.sin(this.time * star.twinkleSpeed + star.phase) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.4 + 0.6 * twinkle)})`;
            ctx.beginPath(); ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();

        const centerX = width / 2;
        const item = this.items[this.selectedItemKey];
        const massKg = item.massGrams / 1000;
        const c = 299792458;
        const energyJoules = massKg * Math.pow(c, 2);
        const tonsTNT = energyJoules / 4.184e9;
        const foyersAn = energyJoules / (3600 * 1000 * 4500);

        ctx.save();
        
        // Titre
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.icon} ${item.label}`, centerX, 55);

        // Masse
        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px sans-serif';
        ctx.fillText(`Masse : ${this.formatNumber(item.massGrams, 2)} g (${massKg} kg)`, centerX, 80);

        // Énergie
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`${this.formatNumber(energyJoules / 1e12, 2)} Terajoules (TJ)`, centerX, 125);

        // Détails (alignés à gauche)
        ctx.textAlign = 'left';
        const startX = width * 0.12;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '17px sans-serif';
        
        ctx.fillText(`• Explosif : Équivalent à ~${this.formatNumber(tonsTNT)} tonnes de TNT`, startX, 185);
        ctx.fillText(`• Électricité : Alimente ~${this.formatNumber(foyersAn)} foyers pendant 1 an`, startX, 225);
        ctx.fillText(`• Énergie brute : ${this.formatNumber(energyJoules)} Joules`, startX, 265);
        
        ctx.restore();
    },

    destroy: function() {}
};