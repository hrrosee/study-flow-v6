/**
 * Web Audio API Sound Synthesizer for Study Flow
 * Ultra-lightweight, zero external MP3 dependencies, instant latency.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Crisp, pleasant chime when a task is completed/checked
   */
  playTaskCheck() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Crisp 2-note ascending harmonic chime
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.08); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Celebratory multi-tone fanfare when an entire topic is 100% finished!
   */
  playTopicCompleteFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Arpeggio notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, index) => {
        const noteTime = now + index * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.14, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Pleasant, soft harmonic chime for standard everyday daily goal completion
   */
  playDailyGoalChime() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, index) => {
        const noteTime = now + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.12, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Spectacular, triumphant milestone fanfare (only for 3-day, 7-day, 14-day, 30-day, 100-day milestones)
   */
  playMilestoneFanfare() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Grand brass/triumphant progression: C5, E5, G5, G5, A5, C6 (extended sustain)
      const sequence = [
        { freq: 523.25, time: 0, dur: 0.12 },
        { freq: 659.25, time: 0.11, dur: 0.12 },
        { freq: 783.99, time: 0.22, dur: 0.14 },
        { freq: 783.99, time: 0.38, dur: 0.12 },
        { freq: 880.00, time: 0.50, dur: 0.14 },
        { freq: 1046.50, time: 0.65, dur: 0.70 },
      ];

      sequence.forEach(({ freq, time, dur }) => {
        const noteTime = now + time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.16, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + dur);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Crisp ice / frost shield sound when a Streak Freeze is used
   */
  playStreakFreeze() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [1200, 1600, 2100, 2800];

      notes.forEach((freq, index) => {
        const noteTime = now + index * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.75, noteTime + 0.18);

        gain.gain.setValueAtTime(0.1, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.18);
      });
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Subtle soft paper crumple / trash swoop sound on deleting workspace, section, topic or task
   */
  playTrash() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Noise buffer for subtle paper crumple / trash sweep
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    } catch {
      // Audio autoplay policy catch
    }
  }
}

export const soundManager = new SoundEffects();
