/**
 * Reusable Audio Manager for OTTv2.
 * Uses Web Audio API procedural synthesis with audio asset fallback.
 * Handles autoplay restrictions, local mute/volume preferences, and deduplication.
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('ottv2_sound_muted') === 'true';
    const savedVol = parseFloat(localStorage.getItem('ottv2_sound_volume'));
    this.volume = !isNaN(savedVol) ? savedVol : 0.7;
    this.unlocked = false;
    this.lastSoundTime = new Map();

    this.setupAutoplayUnlock();
  }

  setupAutoplayUnlock() {
    const unlock = () => {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.unlocked = true;
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('click', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('ottv2_sound_muted', String(this.muted));
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    localStorage.setItem('ottv2_sound_volume', String(this.volume));
  }

  getVolume() {
    return this.volume;
  }

  playSoundOnce(eventKey, soundType, windowMs = 300) {
    const now = Date.now();
    const last = this.lastSoundTime.get(eventKey) || 0;
    if (now - last < windowMs) {
      return; // Deduplicated
    }
    this.lastSoundTime.set(eventKey, now);
    this.playSound(soundType);
  }

  playSound(type) {
    if (this.muted || this.volume <= 0) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      switch (type) {
        case 'click':
          this._playClick(ctx, masterGain, now);
          break;
        case 'select':
          this._playSelect(ctx, masterGain, now);
          break;
        case 'move':
          this._playMove(ctx, masterGain, now);
          break;
        case 'capture':
          this._playCapture(ctx, masterGain, now);
          break;
        case 'invalid':
          this._playInvalid(ctx, masterGain, now);
          break;
        case 'turn':
          this._playTurn(ctx, masterGain, now);
          break;
        case 'playerJoined':
          this._playPlayerJoined(ctx, masterGain, now);
          break;
        case 'victory':
          this._playVictory(ctx, masterGain, now);
          break;
        case 'defeat':
          this._playDefeat(ctx, masterGain, now);
          break;
        case 'rematch':
          this._playRematch(ctx, masterGain, now);
          break;
        default:
          this._playClick(ctx, masterGain, now);
      }
    } catch (err) {
      // Suppress audio errors silently so gameplay is never broken
    }
  }

  _playClick(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  _playSelect(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  _playMove(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  _playCapture(ctx, gain, now) {
    // Punchy combat impact (sine + noise burst)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  _playInvalid(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  _playTurn(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(587.33, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  _playPlayerJoined(ctx, gain, now) {
    // Upbeat double chime
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  _playVictory(ctx, gain, now) {
    // Triumphant chord (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(this.volume * 0.4, now + idx * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(noteGain);
      noteGain.connect(gain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }

  _playDefeat(ctx, gain, now) {
    // Low minor drop (G3 -> E3 -> C3)
    const notes = [196.0, 164.81, 130.81];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(this.volume * 0.4, now + idx * 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

      osc.connect(noteGain);
      noteGain.connect(gain);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.3);
    });
  }

  _playRematch(ctx, gain, now) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392.0, now); // G4
    osc.frequency.setValueAtTime(523.25, now + 0.1); // C5

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const audioManager = new AudioManager();
