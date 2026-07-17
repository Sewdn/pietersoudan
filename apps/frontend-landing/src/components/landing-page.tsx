import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@pietersoudan/ui'
import {
  Briefcase,
  Code2,
  Layers,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'

const specializations = [
  {
    icon: Code2,
    title: 'Software Engineer',
    description:
      'Full-stack development from analysis to implementation — React, TypeScript, Node.js, and modern cloud-native stacks.',
  },
  {
    icon: Layers,
    title: 'System Architect',
    description:
      'Designing modular, extensible systems with Domain-Driven Design, design systems, and pragmatic engineering practices.',
  },
  {
    icon: Briefcase,
    title: 'IT Consultant',
    description:
      'End-to-end project delivery: business analysis, technical design, team leadership, and cloud deployments.',
  },
] as const

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
              Sweet &amp; Savory
            </p>
            <p className="text-sm text-muted-foreground">Pieter Soudan</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="mailto:pietersoudan@gmail.com">
              <Mail data-icon="inline-start" />
              Contact
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.12),transparent_55%)]"
          />
          <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
            <Badge variant="secondary" className="mb-6">
              Independent IT consultant · Kontich, Belgium
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Software engineering, system architecture &amp; IT consulting
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Master in Computer Science with 19+ years of experience as an
              independent consultant. I design and build web applications from
              first analysis through architecture, UX, and full-stack
              implementation — pragmatic, thorough, and security-conscious.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href="mailto:pietersoudan@gmail.com">Get in touch</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#specializations">Specializations</a>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="specializations"
          className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16 md:py-20"
        >
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Specializations
            </h2>
            <p className="mt-3 text-muted-foreground">
              From technical vision and team coaching to hands-on development —
              I help organisations ship reliable, maintainable software.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {specializations.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/40">
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  About
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Trained at KU Leuven, I have spent nearly two decades as a
                  freelancer in the startup and agency scene — as system
                  architect, tech team lead, and full-stack engineer. My focus
                  is web development: generic, extensible systems built with
                  attention to performance, security, and usability.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  I work on projects from start to finish — business analysis,
                  domain design, technical architecture, UX prototyping, and
                  cloud deployment — in a team or independently.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                  <CardDescription>
                    A selection of stacks I work with regularly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {[
                    'TypeScript',
                    'React',
                    'Node.js',
                    'GraphQL',
                    'PostgreSQL',
                    'Docker',
                    'Kubernetes',
                    'AWS',
                    'Tailwind',
                  ].map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-lg font-medium">Sweet &amp; Savory</p>
              <p className="mt-1 text-sm text-muted-foreground">
                BTW BE0553.981.747
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                Drabstraat 148, 2550 Kontich
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                <a
                  href="tel:+32495715511"
                  className="hover:text-foreground transition-colors"
                >
                  (+32) 495 71 55 11
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                <a
                  href="mailto:pietersoudan@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  pietersoudan@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sweet &amp; Savory · Pieter Soudan
          </p>
        </div>
      </footer>
    </div>
  )
}
