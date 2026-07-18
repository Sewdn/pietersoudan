---
name: Architectural Brutalism
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 180px
    fontWeight: '900'
    lineHeight: 160px
    letterSpacing: -0.05em
  display-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '900'
    lineHeight: 72px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 90px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 0px
  margin-desktop: 64px
  margin-mobile: 24px
  stack-xl: 160px
  stack-md: 80px
---

## Brand & Style
The design system is built for a senior software architect and AI specialist, emphasizing structural integrity, logic, and precision. The brand personality is authoritative, uncompromising, and highly technical.

The style is a synthesis of **Minimalism** and **Brutalism**. It strips away all decorative artifacts—no shadows, no gradients, and no rounded corners—leaving only the raw materials of digital construction: typography, layout, and pure contrast. The aesthetic reflects a "system architect" persona: efficient, powerful, and transparent. The interface should feel like a high-end blueprint or a terminal rendered with Swiss typographic discipline.

## Colors
The palette is strictly binary. This constraint enforces a hierarchy based entirely on scale and density rather than hue.

- **Primary (#000000):** Used for all foreground elements, including text, borders, and solid blocks.
- **Secondary (#FFFFFF):** Used for the global background and negative space.
- **Surface:** Surfaces are never "layered" with color; they are defined by 1px solid black borders.
- **Interactive State:** Hover states are managed by inverting the binary relationship (Background becomes Black, Text becomes White).

## Typography
Typography is the primary visual driver of this design system. We use a high-contrast pairing of a heavy, aggressive Grotesk for impact and a systematic Sans/Mono for utility.

- **Display & Headlines:** Use **Hanken Grotesk** at extreme weights (800-900). For "Full-Width" typographic impact, headlines should use `display-xl` to span the entire viewport width, occasionally bleeding off-edge to emphasize scale.
- **Body:** **Inter** provides a neutral, highly readable foundation for technical descriptions and documentation.
- **Labels & Data:** **JetBrains Mono** is used for metadata, AI parameters, and architectural specs to reinforce the "architect" persona.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy with a structural emphasis on the 1px border. 

- **The Grid:** A 12-column grid where columns are separated by 1px solid black lines rather than open gutters. This creates a "blueprint" or "spreadsheet" feel.
- **Whitespace:** Use massive vertical stack spacing (`stack-xl`) to isolate content blocks. Negative space should feel intentional and vast.
- **Responsive:** On mobile, the 12-column grid collapses to a 2-column or 4-column layout. The `display-xl` typography must scale aggressively to remain impactful without breaking the word-wrap logic.

## Elevation & Depth
This design system is strictly **Flat**. There are no shadows, blurs, or Z-axis depth cues.

- **Hierarchy through Borders:** Depth is communicated by the thickness or presence of 1px black borders.
- **Tonal Contrast:** Overlays do not use transparency. An overlay is a solid White or Black block that covers the content beneath it entirely.
- **The "Sticker" Effect:** Elements do not float; they are either anchored to the grid or "pasted" on top with a 1px border to separate them from the background.

## Shapes
The shape language is strictly **Sharp**. 

Every element—buttons, inputs, cards, and images—must have a 0px border radius. This rigidity reflects the precision of system architecture and software engineering. Diagonals and curves are only permitted within the letterforms of the typography or specific technical diagrams.

## Components

- **Buttons:** Large, rectangular blocks with a 1px or 2px solid black border. Default state is Black text on White background. Hover state is an immediate inversion (White text on Black background).
- **Inputs:** Simple horizontal lines (bottom border only) or full 1px boxes. Labels should use `label-mono` in all-caps above the field.
- **Cards:** Defined by 1px borders. Cards do not have padding; they are containers that clip content to the grid. Use `stack-md` for internal spacing.
- **Chips/Labels:** Small rectangular boxes using `label-mono`. Use these for "Tech Stack" or "AI Models" tagging.
- **Lists:** Horizontal rows separated by 1px lines. On hover, the entire row background turns Black.
- **Architectural Diagrams:** Use 1px black lines with sharp arrowheads. No fills, only strokes.
- **Motion:** Transitions should be "hard" but smooth. Use `cubic-bezier(0.16, 1, 0.3, 1)` for scroll-triggered reveals where text slides up from a masked container or borders "draw" themselves into existence.