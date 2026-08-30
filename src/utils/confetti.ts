import confetti from 'canvas-confetti';

/**
 * Trigger celebration confetti when any task or entire topic is completed
 */
export function triggerMiniTaskConfetti(origin?: { x: number; y: number }) {
  triggerTopicCompleteCelebration();
}

/**
 * Continuous side-cannon fireworks (2.5s duration)
 * Cross-firing from left & right with pink & white aesthetic palette
 */
export function triggerTopicCompleteCelebration() {
  try {
    const colors = ['#ff4f81', '#ff7ca3', '#ffffff', '#ffd7e4'];
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      // Left side cannon
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors,
        zIndex: 99999999,
        disableForReducedMotion: true,
      });

      // Right side cannon
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors,
        zIndex: 99999999,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Graceful fallback
  }
}

