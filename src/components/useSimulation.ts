'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/** One continuous clock per exhibit. No wall-clock catch-up after a hidden tab. */
export function useSimulation(
  root: RefObject<HTMLElement | null>,
  paused: boolean,
  draw: (seconds: number) => void,
) {
  const time = useRef(0);
  const callback = useRef(draw);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    callback.current = draw;
  }, [draw]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => setReduced(media.matches);
    const visibility = () =>
      setPageVisible(
        !document.hidden &&
          (!document.querySelector('dialog[open]') ||
            !!root.current?.closest('dialog[open]')),
      );
    preference();
    visibility();
    media.addEventListener('change', preference);
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('portfolio:dialog', visibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.02 },
    );
    if (root.current) observer.observe(root.current);
    callback.current(time.current);
    return () => {
      media.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('portfolio:dialog', visibility);
      observer.disconnect();
    };
  }, [root]);
  const running = visible && pageVisible && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined)
        time.current += Math.min((now - previous) / 1000, 0.05);
      previous = now;
      callback.current(time.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  return { running, reduced, visible, entered, time };
}
