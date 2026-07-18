import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@pietersoudan/ui";
import { Menu } from "lucide-react";
import { useState } from "react";

import { DockingAppBar } from "#/components/docking-app-bar";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

function scrollToHome() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  window.history.replaceState(undefined, "", "#home");
}

const navLinkClassName =
  "font-label-mono inline-block px-4 py-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground";

const desktopNavLinkClassName =
  "font-label-mono inline-block px-3 py-1.5 text-muted-foreground transition-colors duration-200 hover:bg-primary hover:text-primary-foreground";

export function LandingAppBar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <DockingAppBar className="flex items-center justify-between gap-3 border-b border-primary bg-background/95 px-page py-4 supports-backdrop-filter:backdrop-blur-sm md:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none border-primary md:hidden"
              aria-label="Open navigation"
            >
              <Menu aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[min(100vw,16rem)] gap-0 rounded-none border-r border-primary p-0 sm:max-w-xs"
          >
            <SheetHeader className="border-b border-primary p-4 text-left">
              <SheetTitle className="font-label-mono text-sm uppercase">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {navLinks.map(({ href, label }) => (
                <SheetClose key={href} asChild>
                  <a
                    href={href}
                    className={`${navLinkClassName} block border-b border-primary`}
                    onClick={(event) => {
                      if (href === "#home") {
                        event.preventDefault();
                        scrollToHome();
                      }
                    }}
                  >
                    {label}
                  </a>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToHome();
          }}
          className="text-headline-md min-w-0 truncate font-display font-black tracking-tighter text-foreground transition-opacity hover:opacity-80"
        >
          PIETER SOUDAN
        </a>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={desktopNavLinkClassName}
            onClick={(event) => {
              if (href === "#home") {
                event.preventDefault();
                scrollToHome();
              }
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <Button
        asChild
        className="shrink-0 rounded-none border border-primary bg-primary font-label-mono text-primary-foreground uppercase hover-invert"
      >
        <a href="mailto:pietersoudan@gmail.com">Get in Touch</a>
      </Button>
    </DockingAppBar>
  );
}
