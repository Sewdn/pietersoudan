import { cn } from "@pietersoudan/ui";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export type LabelCloudSize = "sm" | "md" | "lg";

export type LabelCloudItem = {
  readonly label: string;
  readonly size?: LabelCloudSize;
};

export type AnimatedLabelCloudProps = {
  readonly labels: readonly LabelCloudItem[];
  readonly className?: string;
  readonly maxWidthClassName?: string;
  readonly variant?: "default" | "inverted";
};

const sizeClass: Record<LabelCloudSize, string> = {
  lg: "px-5 py-3 text-sm md:px-7 md:py-4 md:text-base",
  md: "px-4 py-2.5 text-xs md:text-sm",
  sm: "px-3 py-2 text-xs",
};

const variantClass = {
  default:
    "bg-black/[0.05] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
  inverted:
    "bg-white/[0.09] text-primary-foreground transition-colors hover:bg-primary-foreground hover:text-primary",
} as const;

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08;
}

export function AnimatedLabelCloud({
  labels,
  className,
  maxWidthClassName = "max-w-3xl",
  variant = "default",
}: AnimatedLabelCloudProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setIsActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        setIsActive(true);
      },
      { threshold: [0, 0.15, 0.35], rootMargin: "-4% 0px -4% 0px" },
    );

    observer.observe(group);

    if (isInViewport(group)) {
      setIsActive(true);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("mx-auto w-fit", maxWidthClassName, className)}>
      <div
        ref={groupRef}
        className={cn("label-cloud__group flex flex-wrap justify-center gap-2 md:gap-3", isActive && "is-active")}
      >
        {labels.map(({ label, size = "md" }, index) => {
          const motionStyle = {
            "--label-cloud-delay": `${index * 0.42}s`,
            "--label-cloud-enter-delay": `${index * 55}ms`,
          } as CSSProperties;

          return (
            <span key={label} className="label-cloud__item" style={motionStyle}>
              <span
                className={cn(
                  "label-cloud__item-motion font-label-mono inline-block",
                  sizeClass[size],
                  variantClass[variant],
                )}
              >
                {label}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
