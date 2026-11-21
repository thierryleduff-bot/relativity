window.SoundUtils = {
    ctx: null,
    soundEnabled: false,

    initContext: function() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleSound: function() {
        this.initContext();
        this.soundEnabled = !this.soundEnabled;

        const icon = document.getElementById('sound-icon');
        const btn = document.getElementById('btn-sound-toggle');

        if (this.soundEnabled) {
            if (icon) icon.textContent = '🔊';
            if (btn) {
                btn.style.borderColor = '#06b6d4';
                btn.style.color = '#06b6d4';
            }
            this.playTic();
        } else {
            if (icon) icon.textContent = '🔇';
            if (btn) {
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                btn.style.color = '#cbd5e1';
            }
        }
    },

    playBeep: function(freq, duration, volume) {
        if (!this.soundEnabled || !this.ctx) return;
        duration = duration || 0.03;
        volume = volume || 0.025;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.005);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Ignorer si l'audio context est bloqué
        }
    },

    playTic: function() {
        this.playBeep(880, 0.03, 0.025);
    },

    playTac: function() {
        this.playBeep(587.33, 0.03, 0.025);
    },

    playStop: function() {
        this.playBeep(220, 0.3, 0.05);
    }
};

// Attachement de l'événement
window.addEventListener('load', function() {
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
        btn.addEventListener('click', function() {
            if (window.SoundUtils && typeof window.SoundUtils.toggleSound === 'function') {
                window.SoundUtils.toggleSound();
            }
        });
    }
});