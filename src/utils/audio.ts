// Web Audio API pure synthesizer for serene, reverent spiritual chimes
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSpiritualChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Soothing gentle harmonic frequencies (C5, G5, C6)
    const frequencies = [523.25, 783.99, 1046.50];
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Gentle attack and long natural reverberant decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.3);
    });
  } catch (err) {
    console.warn('Audio playback not permitted or supported yet:', err);
  }
}

export function triggerVibration(pattern: number[] = [200, 100, 200]): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors
    }
  }
}

export function playTasbeehClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // Ignore click audio errors
  }
}
