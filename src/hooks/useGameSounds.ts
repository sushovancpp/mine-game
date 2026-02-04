import { useCallback, useRef, useEffect } from 'react';

// Simple sound hook using Web Audio API (no external files needed)
export const useGameSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Resume context if suspended (required for user interaction)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  const playClick = useCallback(() => {
    playTone(800, 0.1, 'sine', 0.2);
  }, [playTone]);

  const playReveal = useCallback(() => {
    // Rising arpeggio for diamond reveal
    playTone(523.25, 0.15, 'sine', 0.25); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 50); // E5
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3), 100); // G5
  }, [playTone]);

  const playWin = useCallback(() => {
    // Victory fanfare
    playTone(523.25, 0.2, 'triangle', 0.3);
    setTimeout(() => playTone(659.25, 0.2, 'triangle', 0.3), 100);
    setTimeout(() => playTone(783.99, 0.2, 'triangle', 0.3), 200);
    setTimeout(() => playTone(1046.5, 0.4, 'triangle', 0.4), 300);
  }, [playTone]);

  const playExplosion = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Create noise for explosion
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.4);

    // Low boom
    playTone(60, 0.5, 'sine', 0.4);
  }, [playTone]);

  const playCashOut = useCallback(() => {
    // Coin collecting sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(1200 + i * 100, 0.1, 'sine', 0.2);
      }, i * 50);
    }
  }, [playTone]);

  return {
    playClick,
    playReveal,
    playWin,
    playExplosion,
    playCashOut,
  };
};
