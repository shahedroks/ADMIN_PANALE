import { useEffect, useState } from "react";

type CountUpOptions = {
  duration?: number;
  delay?: number;
  decimals?: number;
  enabled?: boolean;
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useCountUp(target: number, options: CountUpOptions = {}): number {
  const { duration = 1400, delay = 400, decimals = 0, enabled = true } = options;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startTime: number | null = null;
    let delayTimer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const next = target * easeOutCubic(progress);
      setValue(next);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    delayTimer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, enabled]);

  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
