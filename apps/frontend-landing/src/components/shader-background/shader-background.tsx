import { cn } from "@pietersoudan/ui";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  SHADER_FALLBACK_CLASS,
  type ShaderBackgroundVariant,
} from "#/components/shader-background/shaders";
import { useShaderCanvas } from "#/components/shader-background/use-shader-canvas";

type ShaderBackgroundProps = {
  readonly variant: ShaderBackgroundVariant;
  readonly className?: string;
  readonly opacity?: number;
  readonly trackMouse?: boolean;
  readonly pauseWhenOffscreen?: boolean;
};

export function ShaderBackground({
  variant,
  className,
  opacity = 1,
  trackMouse = true,
  pauseWhenOffscreen = true,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(!pauseWhenOffscreen);
  const [preferFallback, setPreferFallback] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPreferFallback(reducedMotion);
  }, []);

  useEffect(() => {
    if (!pauseWhenOffscreen) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry?.isIntersecting ?? true);
      },
      { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [pauseWhenOffscreen]);

  const status = useShaderCanvas({
    canvasRef,
    variant,
    active: active && !preferFallback,
    trackMouse,
  });

  const useFallback = preferFallback || status === "failed";

  const style = {
    opacity,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={style}
    >
      {useFallback ? (
        <div className={cn("size-full", SHADER_FALLBACK_CLASS[variant])} />
      ) : (
        <canvas ref={canvasRef} className="block size-full" />
      )}
    </div>
  );
}
