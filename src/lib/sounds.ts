
// Sound utility using Web Audio API for discreet UI sound effects

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      try {
        audioCtx = new AudioContextClass();
      } catch (e) {
        console.warn('Failed to initialize AudioContext:', e);
      }
    }
  }
  return audioCtx;
};

const createSound = (freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Failed to play sound:', error);
  }
};

export const playSuccessSound = () => {
  // A quick melodic "success" chime: Low then high
  createSound(440, 'sine', 0.1, 0.1);
  setTimeout(() => createSound(880, 'sine', 0.2, 0.1), 100);
};

export const playTaskCompleteSound = () => {
  // A nice soft chime
  createSound(523, 'triangle', 0.3, 0.1);
};

export const playNotificationSound = () => {
  // Two soft beeps
  createSound(600, 'sine', 0.05, 0.05);
  setTimeout(() => createSound(600, 'sine', 0.05, 0.05), 100);
};

