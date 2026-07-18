import { Terminal } from "lucide-react";

import { AnimatedLabelCloud } from "#/components/animated-label-cloud";
import { LandingAppBar } from "#/components/landing-app-bar";
import { ScrollReveal } from "#/components/scroll-reveal";
import { ShaderBackground } from "#/components/shader-background";

const experience: Array<{
  span: string;
  period: string;
  company: string;
  role: string;
  description: string;
  featured?: boolean;
}> = [
  {
    span: "md:col-span-8",
    period: "2020 — PRESENT",
    company: "LEMON SOFTWARE",
    role: "Architect & Technical Team Lead",
    description:
      "Technical vision, team coaching, and delivery of React, React Native, and Flutter apps with GraphQL backends. Workshops on DDD, design systems, and TDD/BDD.",
  },
  {
    span: "md:col-span-4",
    period: "2016 — 2020",
    company: "SOLAR APPS",
    role: "Technical Lead",
    description:
      "Guided startups and SMEs through digital transformation with reusable modules and custom administrative software.",
  },
  {
    span: "md:col-span-4",
    period: "2015 — 2019",
    company: "TEXTUS.IO",
    role: "Founder & Architect",
    description:
      "Cloud software that converts unstructured text into online publications and print-ready PDFs via an automated pipeline.",
  },
  {
    span: "md:col-span-8",
    period: "2023 — PRESENT",
    company: "PRIVATE PROJECTS",
    role: "Independent R&D",
    description:
      "Side projects spanning AI-assisted workflows, Web3 decentralized storage, and turn-based strategy game development.",
    featured: true,
  },
];

const stack = [
  "TypeScript",
  "React",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Bun",
  "Tailwind",
] as const;

const headlineRoles = [
  "MsC in Computer Science",
  "Sr Software Engineer",
  "System Architect",
  "AI Specialist",
  "IT Consultant",
] as const;

const coreValues = [
  { label: "Domain-Driven Design", size: "lg" },
  { label: "Dreamer & Entrepreneur", size: "lg" },
  { label: "Design System Thinking", size: "lg" },
  { label: "Modularity & Extensibility", size: "lg" },
  { label: "Efficient & Effective", size: "lg" },
  { label: "Test-Driven Development", size: "md" },
  { label: "Behavior-Driven Development", size: "md" },
  { label: "Pragmatic & Thorough", size: "md" },
  { label: "End-to-End Ownership", size: "md" },
  { label: "AI-Assisted Workflows", size: "md" },
  { label: "Security by Design", size: "sm" },
  { label: "Built for Performance", size: "sm" },
  { label: "Usability First", size: "sm" },
  { label: "Developing People", size: "sm" },
  { label: "Continuous Learning", size: "sm" },
  { label: "Reusable by Design", size: "sm" },
] as const;

export function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <LandingAppBar />

      <main>
        <section
          id="home"
          className="flex min-h-svh flex-col justify-center bg-background px-page pt-stack-xl text-foreground"
        >
          <ScrollReveal>
            <div>
              <p className="font-label-mono headline-roles mb-4 text-foreground">
                {headlineRoles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </p>
              <h1 className="text-display-xl wrap-break-word text-foreground">
                PIETER
                <br />
                SOUDAN
                <br />
                <span className="text-outline-variant">
                  +23yrs <span className="text-foreground">XP</span>
                </span>
              </h1>
            </div>
          </ScrollReveal>
          <ScrollReveal
            className="mt-stack-md flex flex-col items-end justify-between gap-stack-md md:flex-row"
            delay={120}
          >
            <div className="max-w-2xl border-l-2 border-primary pl-8">
              <p className="text-body-lg text-foreground">
                Independent consultant at{" "}
                <strong className="font-medium">Sweet &amp; Savory</strong>. Master in Computer
                Science with 23+ years building web applications and agentic workflows — from
                business analysis and architecture through full-stack implementation and cloud
                deployment.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-1 w-32 bg-primary" />
              <span className="font-label-mono text-muted-foreground">
                SWEET &amp; SAVORY // Antwerp, BE
              </span>
            </div>
          </ScrollReveal>
        </section>

        <section className="relative overflow-hidden bg-primary px-page py-stack-xl text-primary-foreground">
          <ShaderBackground variant="grid-dark" opacity={0.85} trackMouse />
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <ScrollReveal className="mb-stack-md w-full">
              <h2 className="text-headline-md pb-4 text-primary-foreground">What I Stand For</h2>
              <p className="text-body-lg mx-auto mt-6 max-w-2xl text-primary-foreground/80">
                Values and design principles I advocate for — from domain modeling and craft through
                coaching, operations, and long-term maintainability.
              </p>
            </ScrollReveal>
            <AnimatedLabelCloud labels={coreValues} variant="inverted" />
          </div>
        </section>

        <section
          id="experience"
          className="scroll-mt-20 bg-background px-page py-stack-xl text-foreground"
        >
          <ScrollReveal className="mb-stack-md">
            <h3 className="text-headline-md border-b border-primary pb-4 text-foreground">
              Professional Trajectory
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 border-t border-l border-primary md:grid-cols-12">
            {experience.map(({ span, period, company, role, description, featured }, index) =>
              featured ? (
                <ScrollReveal
                  key={company}
                  className={`${span} border-r border-b border-primary`}
                  delay={index * 90}
                >
                  <a
                    href="#stack"
                    className="group flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-primary p-12 text-primary-foreground transition-colors"
                  >
                    <div className="text-center transition-transform duration-500 group-hover:scale-110">
                      <Terminal
                        className="mx-auto mb-4 size-16 text-primary-foreground"
                        strokeWidth={1}
                        aria-hidden
                      />
                      <h4 className="text-headline-md text-primary-foreground">Core Stack</h4>
                      <p className="font-label-mono mt-2 text-primary-foreground/70">
                        TECHNOLOGIES &amp; SPECIALIZATIONS
                      </p>
                    </div>
                  </a>
                </ScrollReveal>
              ) : (
                <ScrollReveal
                  key={company}
                  className={`${span} border-r border-b border-primary`}
                  delay={index * 90}
                >
                  <div className="h-full bg-background p-8 text-foreground transition-colors hover:bg-surface-container-highest md:p-12">
                    <span className="font-label-mono text-muted-foreground">{period}</span>
                    <h4 className="text-headline-md mt-4 mb-2 text-foreground">{company}</h4>
                    <p className="font-label-mono mb-8 text-foreground">{role}</p>
                    <p className="max-w-xl text-base leading-6 text-foreground">{description}</p>
                  </div>
                </ScrollReveal>
              ),
            )}
          </div>
        </section>

        <section
          id="stack"
          className="scroll-mt-20 bg-secondary px-page py-stack-xl text-foreground"
        >
          <div className="grid grid-cols-1 items-center gap-stack-md md:grid-cols-2">
            <ScrollReveal>
              <h3 className="text-headline-lg mb-8 text-foreground">Core Stack</h3>
              <p className="text-body-lg max-w-md text-foreground">
                Full-stack engineer and system architect — analysis, design, implementation, and
                operations across modern web and cloud platforms.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-2">
              {stack.map((tech, index) => (
                <ScrollReveal key={tech} delay={index * 60}>
                  <div className="cursor-default border border-primary bg-background p-6 font-label-mono text-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:p-8">
                    {tech}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex h-[50vh] min-h-80 items-center justify-center overflow-hidden md:h-[60vh]">
          <ShaderBackground variant="scanline-grid" opacity={0.9} trackMouse={false} />
          <ScrollReveal className="relative z-10 text-center text-primary-foreground">
            <span className="font-label-mono mb-4 block tracking-widest text-primary-foreground">
              Current Focus
            </span>
            <h2 className="text-headline-lg text-primary-foreground">
              AGENTIC WORKFLOWS & AI-ASSISTED SW ENGINEERING
            </h2>
          </ScrollReveal>
        </section>

        <section
          id="contact"
          className="scroll-mt-20 flex flex-col items-center justify-center bg-background px-page py-stack-xl text-center text-foreground"
        >
          <ScrollReveal className="w-full">
            <span className="font-label-mono mb-4 block text-muted-foreground">
              Ready to Build?
            </span>
            <a
              href="mailto:pietersoudan@gmail.com"
              className="text-display-xl inline-block break-all text-foreground decoration-primary underline-offset-8 transition-all hover:underline"
            >
              PIETERSOUDAN
              <br className="md:hidden" />
              @GMAIL.COM
            </a>
          </ScrollReveal>
          <ScrollReveal
            className="mt-stack-md flex w-full flex-wrap justify-center gap-8 md:gap-stack-md"
            delay={100}
          >
            <a
              href="tel:+32495715511"
              className="text-headline-md font-display text-foreground transition-all hover:line-through"
            >
              PHONE
            </a>
            <a
              href="#experience"
              className="text-headline-md font-display text-foreground transition-all hover:line-through"
            >
              EXPERIENCE
            </a>
            <a
              href="mailto:pietersoudan@gmail.com"
              className="text-headline-md font-display text-foreground transition-all hover:line-through"
            >
              EMAIL
            </a>
          </ScrollReveal>
          <ScrollReveal className="mx-auto mt-stack-md w-full max-w-lg" delay={180}>
            <div className="border border-primary bg-background p-8 text-left">
              <p className="mb-4 font-display text-xl font-bold text-foreground uppercase md:text-2xl">
                Sweet &amp; Savory
              </p>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                <li>Drabstraat 148, 2550 Kontich</li>
                <li>BTW BE0553.981.747</li>
                <li>BE83 9734 1178 2515</li>
              </ul>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <ScrollReveal>
        <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-primary bg-primary px-page py-stack-md text-primary-foreground md:flex-row">
          <div className="text-headline-md font-display text-primary-foreground">PIETER SOUDAN</div>
          <div className="font-label-mono text-center text-primary-foreground/70">
            © {new Date().getFullYear()} SWEET &amp; SAVORY
          </div>
          <div className="font-label-mono flex gap-8 uppercase">
            <a
              href="mailto:pietersoudan@gmail.com"
              className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              Email
            </a>
            <a href="tel:+32495715511" className="font-bold text-primary-foreground underline">
              Call
            </a>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
}
