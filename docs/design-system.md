# KrishnaHealth Design System

This document outlines the core design system for the Dr. Amit Jha Sports Medicine clinic application.

## 1. Color Palette

The design uses a custom aesthetic featuring dark slate/teal backgrounds with emerald-teal gradient accents and energetic highlights.

### Brand Tokens (Defined in CSS Variables)
* **`--ink`**: Deep dark forest teal (#102321). Used for background in dark mode, text in light mode.
* **`--paper`**: Off-white/cream paper (#f5f5ef). Used for background in light mode.
* **`--lime`**: Electric high-visibility lime accent (#d5f14c).
* **`--orange`**: Vibrant coral/orange secondary accent (#fb6843).
* **`--muted`**: Muted slate gray-teal (#66706d).

### shadcn/ui HSL Tokens
Full shadcn/ui compatibility is enabled via standard HSL variables defined in `globals.css` and mapped in `tailwind.config.ts`.
* `--background` / `--foreground`
* `--primary` / `--primary-foreground`
* `--secondary` / `--secondary-foreground`
* `--card` / `--card-foreground`
* `--muted-hsl` / `--muted-foreground`
* `--accent`, `--popover`, `--destructive`, `--border`, `--input`, `--ring`

Dark mode is supported via the `.dark` class overriding these HSL values.

## 2. Typography

We load Google Fonts via the Google Fonts CDN in `globals.css`.

* **Primary (Body):** Inter (`var(--font-inter)`)
* **Heading:** Outfit (`var(--font-outfit)`)

### Type Scale (Tailwind Defaults Inherited)
* `xs`: 0.75rem / 1rem
* `sm`: 0.875rem / 1.25rem
* `base`: 1rem / 1.5rem
* `lg`: 1.125rem / 1.75rem
* `xl`: 1.25rem / 1.75rem
* `2xl`: 1.5rem / 2rem
* `3xl`: 1.875rem / 2.25rem
* `4xl`: 2.25rem / 2.5rem

*Weights:* 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra Bold).

## 3. Spacing & Grid

* **Base Grid:** 4px standard Tailwind spacing scale.
* **Layout Grid:** 12-column grid.
* **Max Width:** 1400px (Tailwind container).
* **Breakpoints:** 375px (xs), 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1440px (2xl).

## 4. Shadows & Glassmorphism

### Shadows
* `shadow-card`: Standard card resting state.
* `shadow-card-hover`: Elevated hover state.
* `shadow-glow`: Subtle teal glow.
* `shadow-glow-strong`: Emphasized teal glow.
* `shadow-glass`: Omni-directional soft shadow for glass elements.

### Glassmorphism Utility Classes
Use these CSS utilities for premium overlapping elements:
* `.glass-card`: Translucent card with background blur (`backdrop-filter: blur(12px)`).
* `.glass-header`: Translucent sticky navigation header with 16px blur.

*Dark mode automatically deepens the glass background opacity and adjusts borders.*

## 5. Motion Tokens

Framer Motion is the standard for complex animations targeting 60fps.
CSS transitions are defined in `tailwind.config.ts`.

### Duration Scale
* `100ms`, `200ms`, `300ms`, `500ms`, `800ms`

### Easing Curves
* `ease-out`: `cubic-bezier(0.2, 0.8, 0.2, 1)` - Default for UI enter animations.
* `spring`: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` - For playful/bouncy scaling.
* `snappy`: `cubic-bezier(0.86, 0, 0.07, 1)` - For fast, crisp transitions.

## 6. Components

### Button Variants
* **Primary:** Lime background (`var(--lime)`) on Ink text.
* **Secondary:** Teal outline.
* **Ghost:** Transparent, background on hover.
* **Danger:** Destructive red.

### Card Variants
* **Default:** Solid background based on theme.
* **Glass:** Using `.glass-card` utility.
* **Elevated:** Standard card + `shadow-card-hover`.
* **Clinical-stat:** Minimal border, muted text label, large primary value.

### Form Components
Inputs, Selects, and Textareas utilize standard shadcn/ui styling leveraging `--input`, `--ring`, and `--border` variables, providing clear focus rings and error states.
