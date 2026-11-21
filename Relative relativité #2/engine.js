// =====================================================================
// ENGINE.JS — Moteur principal
// =====================================================================

window.Stages = {}; // Namespace global

window.Engine = {
    currentStage: 0,
    isPaused: false,
    speedFactor: 1.0,
    canvas: null,
    ctx: null,
    animationFrameId: null,

    // =================================================================
    init: function() {
        this.canvas = document.getElementById('sim-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.setupResize();
        this.setupEvents();
        
        // Démarre toujours sur l'accueil
        this.loadStage(0);
        
        this.startLoop();
    },

    setupResize: function() {
        const resize = () => {
            if (!this.canvas || !this.canvas.parentElement) return;
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        };
        window.addEventListener('resize', resize);
        resize();
    },

    setupEvents: function() {
        // Navigation entre chapitres (onglets)
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stageNum = parseInt(e.currentTarget.dataset.stage);
                this.loadStage(stageNum);
            });
        });

        // Navigation entre étapes (footer)
        const prevStepBtn = document.getElementById('btn-prev-step');
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => {
                const stage = window.Stages[this.currentStage];
                if (stage && typeof stage.prevStep === 'function') {
                    stage.prevStep();
                    this.updateStepIndicator();
                }
            });
        }

        const nextStepBtn = document.getElementById('btn-next-step');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => {
                const stage = window.Stages[this.currentStage];
                if (stage && typeof stage.nextStep === 'function') {
                    stage.nextStep();
                    this.updateStepIndicator();
                }
            });
        }

        // Pause / Play
        const playPauseBtn = document.getElementById('btn-play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                this.isPaused = !this.isPaused;
                e.currentTarget.textContent = this.isPaused ? '▶' : '⏸';
            });
        }

        // Vitesse
        const speedSelect = document.getElementById('speed-select');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.speedFactor = parseFloat(e.target.value);
            });
        }

        // Relancer l'animation (Correction : prise en charge correcte)
        const replayBtn = document.getElementById('btn-replay');
        if (replayBtn) {
            replayBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const stage = window.Stages[this.currentStage];
                if (stage && typeof stage.reset === 'function') {
                    stage.reset();
                } else {
                    console.warn(`Le stage ${this.currentStage} n'a pas de méthode reset().`);
                }
            });
        }
    },

        loadStage: function(stageKey) {
        // Nettoyage
        const prevStage = window.Stages[this.currentStage];
        if (prevStage && typeof prevStage.destroy === 'function') prevStage.destroy();

        this.currentStage = stageKey;

        // Onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.stage) === parseInt(stageKey));
        });

        // Reset UI
        const citationZone = document.getElementById('citation-zone');
        if (citationZone) { citationZone.classList.remove('visible'); citationZone.innerHTML = ''; }
        const stageNumber = document.getElementById('stage-number');
if (stageNumber) stageNumber.textContent = '';

        // Init
        const stage = window.Stages[stageKey];
        if (stage && stage.init) {
            stage.init(
                document.getElementById('stage-title'),
                document.getElementById('stage-number'),
                document.getElementById('narrative-text'),
                document.getElementById('controls-container'),
                document.getElementById('chapter-domain')
            );
            this.updateStepIndicator();
        } else {
            console.warn(`⚠️ Stage "${stageKey}" introuvable.`);
        }
    },

    updateStepIndicator: function() {
        const stage = window.Stages[this.currentStage];
        const prevBtn = document.getElementById('btn-prev-step');
        const nextBtn = document.getElementById('btn-next-step');
        const indicator = document.getElementById('step-indicator');

        if (!prevBtn || !nextBtn || !indicator) return;

        let current = 1;
        let total = 1;

        if (stage && typeof stage.getCurrentStep === 'function') {
            current = stage.getCurrentStep();
        }
        if (stage && typeof stage.getTotalSteps === 'function') {
            total = stage.getTotalSteps();
        }

        indicator.textContent = `${current} / ${total}`;

        prevBtn.disabled = (current <= 1);
        nextBtn.disabled = (current >= total);
    },

    startLoop: function() {
        let lastTime = performance.now();

        const loop = (currentTime) => {
            const rawDt = Math.min((currentTime - lastTime) / 1000, 0.1);
            const dt = rawDt * this.speedFactor;
            lastTime = currentTime;

            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                const stage = window.Stages[this.currentStage];
                if (stage && typeof stage.draw === 'function') {
                    const effectiveDt = this.isPaused ? 0 : dt;
                    try {
                        stage.draw(this.ctx, this.canvas.width, this.canvas.height, effectiveDt);
                    } catch (err) {
                        console.error(`Erreur dans Stage[${this.currentStage}].draw :`, err);
                        this.ctx.fillStyle = '#0b0f19';
                        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.ctx.fillStyle = '#ef4444';
                        this.ctx.font = 'bold 16px sans-serif';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText('Erreur dans ce stage — voir la console (F12)', this.canvas.width / 2, this.canvas.height / 2);
                    }
                }
            }

            this.animationFrameId = requestAnimationFrame(loop);
        };

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(loop);
    }
};

// Initialisation
window.addEventListener('load', () => {
    if (window.Engine) window.Engine.init();
});