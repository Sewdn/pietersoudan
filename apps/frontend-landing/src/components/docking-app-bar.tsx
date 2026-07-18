import { cn } from "@pietersoudan/ui";
import { useEffect, useRef, useState, type ReactNode } from "react";

type DockingAppBarProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

const scrollDeltaThreshold = 8;
const topRevealOffset = 24;

export function DockingAppBar({ children, className }: DockingAppBarProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= topRevealOffset) {
        setVisible(true);
      } else if (delta > scrollDeltaThreshold) {
        setVisible(false);
      } else if (delta < -scrollDeltaThreshold) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) {
        return;
      }
      ticking.current = true;
      requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "docking-app-bar",
        visible ? "docking-app-bar--visible" : "docking-app-bar--hidden",
        className,
      )}
    >
      {children}
    </nav>
  );
}
