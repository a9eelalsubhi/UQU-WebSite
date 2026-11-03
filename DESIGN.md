---
name: بوابة كلية الطب | UQU MedHub
description: Clinical-grade Arabic RTL portal for the College of Medicine, Umm Al-Qura University; calm work surfaces, a deep-teal rail, one living pulse.
colors:
  clinical-teal: "#0a6b66"
  deep-teal: "#06403d"
  mint-wash: "#e3f1ee"
  logo-gold: "#b8893a"
  hero-gold: "#e6c47c"
  ink: "#11292b"
  muted-slate: "#536667"
  hairline: "#dde6e5"
  clinical-ground: "#f3f6f6"
  surface: "#ffffff"
  surface-soft: "#f7faf9"
  rail-ink: "#d7ebe6"
  rail-label: "#a9cdc5"
  rail-active: "#224a4d"
  role-student-blue: "#2f64a8"
  role-admin-gold: "#9a6d1f"
  role-service-purple: "#6b4fa0"
  danger: "#b2544c"
  dark-ground: "#0d1918"
  dark-surface: "#152523"
  dark-surface-soft: "#11201e"
  dark-surface-raised: "#1b2e2b"
  dark-teal: "#7fd0bd"
  dark-teal-strong: "#a9e6d6"
  dark-mint: "#1f3a34"
  dark-ink: "#e6f0ed"
  dark-muted: "#a3b6b1"
  dark-line: "#2a3f3b"
  dark-gold: "#d7b46e"
  dark-rail: "#081412"
  dark-hero: "#0b2f2c"
typography:
  display:
    fontFamily: "'Thmanyah Serif Display', Georgia, serif"
    fontSize: "clamp(42px, 5.4vw, 72px)"
    fontWeight: 900
    lineHeight: 1.12
    letterSpacing: "0"
  headline:
    fontFamily: "'Thmanyah Serif Display', Georgia, serif"
    fontSize: "clamp(26px, 2.4vw, 32px)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0"
  hero-headline:
    fontFamily: "'Thmanyah Serif Display', Georgia, serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "'Thmanyah Serif Display', Georgia, serif"
    fontSize: "19px"
    fontWeight: 700
  title-sm:
    fontFamily: "'Thmanyah Serif Display', Georgia, serif"
    fontSize: "16px"
    fontWeight: 700
  body:
    fontFamily: "'Readex Pro', Tahoma, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.75
  body-strong:
    fontFamily: "'Readex Pro', Tahoma, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "'Readex Pro', Tahoma, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
  metric:
    fontFamily: "'Readex Pro', Tahoma, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    fontFeature: "'tnum'"
rounded:
  chip: "5px"
  sm: "10px"
  tile: "12px"
  md: "14px"
  card-group: "16px"
  hero: "18px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "36px"
components:
  button-primary:
    backgroundColor: "{colors.clinical-teal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "10px 17px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.deep-teal}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 17px"
    height: "42px"
  button-on-hero:
    backgroundColor: "#f4faf8"
    textColor: "{colors.deep-teal}"
    rounded: "{rounded.sm}"
  role-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  hub-hero:
    backgroundColor: "{colors.deep-teal}"
    textColor: "{colors.surface}"
    rounded: "{rounded.hero}"
    padding: "clamp(24px,3vw,40px) clamp(22px,3.4vw,44px)"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.tile}"
  icon-tile:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.clinical-teal}"
    rounded: "{rounded.tile}"
    size: "44px"
  live-count-pill:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.clinical-teal}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  nav-item:
    textColor: "#d2e6e1"
    rounded: "{rounded.sm}"
  nav-item-active:
    backgroundColor: "{colors.rail-active}"
    textColor: "{colors.surface}"
  status-chip:
    rounded: "{rounded.chip}"
    padding: "3px 9px"
---

# Design System: بوابة كلية الطب | UQU MedHub

## Overview

**Creative North Star: "The Calm Ward, One Pulse"**

A modern hospital information system with an academic soul. Work happens on a cool, almost-white clinical ground with white surfaces separated by hairlines and quiet, low shadows. One committed colour carries the brand: a deep teal that fills the navigation rail and the overview hero, so the product reads as a single institution rather than a template. Against that stillness there is exactly one living element, the heartbeat: a rotating 3D point-cloud heart with an ECG trace on the entry gate and in the overview hero, and a short gold pulse that sweeps under the top bar on every route change.

Density is operational, not marketing. Content is grouped in hairline-divided lists and tables inside a few large containers instead of grids of floating cards. Headings speak in Thmanyah Serif Display, an Arabic serif with editorial weight; everything you operate (nav, buttons, tables, forms) is set in Readex Pro. The layout is Arabic RTL first: the rail sits on the right, arrows point left, and hover nudges move toward the reading direction.

Light and dark are two full themes of the same world, switched by `data-theme` on the root. Dark does not invert the teal rail into a light one; it deepens everything to near-black teal and lifts the accent to a pale aqua.

**Key Characteristics:**
- Cool clinical ground, white surfaces, hairline borders, soft diffuse shadows.
- Deep-teal rail and hero as the one committed brand surface.
- Gold is a signal (focus, selection, the pulse, the scene's hot points), never a fill.
- Serif display for headings, Readex Pro for every operable element.
- One living motif: the heartbeat, in canvas and in the route sweep.
- RTL-native motion and iconography; full dark theme.

## Colors

A restrained teal-and-slate clinical palette with one committed brand colour and a single gold signal.

### Primary
- **Clinical Teal** (`clinical-teal`): the working accent. Primary buttons, links, text buttons, input caret, icon tiles' glyphs, live-count pills, progress fills, and the default ink of the 3D heart and ECG trace.
- **Deep Teal** (`deep-teal`): the committed brand surface. Fills the navigation rail, the overview hero, the entry gate's display title, button hover, and the `theme-color` meta.
- **Mint Wash** (`mint-wash`): tinted backgrounds behind teal glyphs and counts (icon tiles, live-count pills, accent-soft rows).

### Secondary
- **Logo Gold** (`logo-gold`): the signal colour from the college logo. Focus rings (2px outline, 3px offset), text selection (32% mix), the route-change pulse stroke, the scene's hot points and scan ellipse, and small status dots (entry figcaption dot, demo badge dot, theme-toggle icon).
- **Hero Gold** (`hero-gold`): the brighter gold used only on deep-teal grounds: the hero's scene hot points and the role icon in the hero's role pill.

### Tertiary
- **Role hues**: each role row on the entry gate carries its own hue through a `--role` variable: Student Blue (`role-student-blue`), Admin Gold (`role-admin-gold`), Service Purple (`role-service-purple`); faculty uses Clinical Teal. The hue tints the icon tile (11% mix), the arrow, the role's feature line, and the hover border (45% mix). Role hues live only on the gate.
- **Danger** (`danger`): destructive actions and errors.
- **Status chips** use four hue families: new (blue), in progress (amber), waiting (mauve), done (green). Dark-theme pairs are #283e51/#b2cee5, #433c28/#dfc68b, #45364b/#dfb9df, #284837/#b5dfb9.

### Neutral
- **Clinical Ground** (`clinical-ground`): the page background behind everything.
- **Surface** (`surface`) and **Surface Soft** (`surface-soft`): panels, rows, dialogs; soft for table headers and inset areas.
- **Ink** (`ink`): body and heading text; also the tint of every light-theme shadow.
- **Muted Slate** (`muted-slate`): secondary copy, descriptions, footers, meta lines (5.6:1 on the ground).
- **Hairline** (`hairline`): every border and divider; the top bar uses it as a 1px shadow line instead of a border.
- **Rail Ink / Rail Label / Rail Active** (`rail-ink`, `rail-label`, `rail-active`): text and states on the deep-teal rail. Nav labels and small rail text use Rail Label (6.8:1 on the rail); hover is a 7% white wash; the active item is Rail Active with white text. Rail counts are white on a 15% white chip.
- **Dark theme** (`dark-*` tokens): ground, surface, soft and raised surfaces, aqua accent (`dark-teal`, with `dark-teal-strong` in place of deep teal), `dark-mint`, ink, muted, line, gold, a near-black rail, and a flat `dark-hero` for the overview hero.

### Named Rules
**The Gold Is a Signal Rule.** Gold marks attention: focus, selection, the pulse, the scene's hot points, and tiny status dots. It is never a button fill or a surface. The hero's primary button was moved from gold to near-white for this reason.

**The One Committed Colour Rule.** Deep teal is the only large saturated surface: the rail and the overview hero. Everything else stays on the clinical ground or white.

## Typography

**Display Font:** Thmanyah Serif Display (with Georgia, serif), weights 300 to 900, vendored as woff2.
**Body Font:** Readex Pro (with Tahoma, sans-serif), 400 / 500 / 600-700, split into Arabic and Latin unicode-range files.

**Character:** An editorial Arabic serif carries the institution's voice in headings; a clean, open Arabic sans carries every operable thing. The pairing reads academic at a glance and clinical in use.

### Hierarchy
- **Display** (900, clamp(42px, 5.4vw, 72px), 1.12): the entry gate title only, in Deep Teal.
- **Hero headline** (700, clamp(28px, 3vw, 40px), 1.3): the overview hero, white on deep teal.
- **Headline** (700, clamp(26px, 2.4vw, 32px), 1.35): page titles (`h1`).
- **Title** (700, 19px) and **Title small** (700, 16px): section and panel headings (`h2`, `h3`), serif.
- **Body** (400, 15px, 1.75): running text. Ledes cap at 36ch (gate) and 52ch (hero).
- **Body strong** (600, 16-17px, 1.5): row titles in role rows and hub rows, in Readex Pro.
- **Label** (400-500, 12.5-14px): meta lines, table cells (13px), table headers (12.5px), footer, badges.
- **Metric** (600, 30px, tabular figures): KPI values, set LTR and right-aligned.

### Named Rules
**The Serif Speaks, the Sans Works Rule.** Thmanyah Serif Display is for `h1`-`h3` and the portal name only. Buttons, nav, tables, forms, chips and row titles are always Readex Pro.

**The Tabular Numbers Rule.** Metrics, report stats, nav counts, ticket IDs, table cells and percentages use tabular figures.

Headings use `text-wrap: balance` and zero letter-spacing; paragraphs use `text-wrap: pretty`.

## Layout

A fixed right-hand rail (deep teal) with the workspace to its left; a 68px top bar with breadcrumb on the start side and tools (demo badge, role switch, theme toggle, notifications) on the end side. Content sits in `main` up to 1600px wide.

The entry gate is a full-viewport (100dvh) three-row grid: top strip (official link, theme toggle), main split, and a hairline-topped footer, capped at 1320px with side padding clamp(16px, 4vw, 56px). The main split is copy and role rows on the start side, the heart scene on the end side (columns 1fr / 1.05fr, gap clamp(24px, 5vw, 88px)). Role rows stack in a single column, max 580px, 10px apart.

The overview is a deep-teal hero (copy plus a 200-300px scene column), then a section header and one large container holding a two-column, hairline-divided list of sections. Section headers sit 36px above and 14px above their content.

Rhythm runs on 8 / 10 / 16 / 24 / 36px. Every tappable control is at least 42px tall (44px for gate links).

**Breakpoints:** at 900px the gate collapses to one column with the scene above the copy (26vh, max 200px), the hub list becomes one column, the hero's scene shrinks to an 84px ECG strip, tables become stacked rows (first cell full-width, header row visually hidden), and tabs scroll horizontally. At 480px role rows drop their arrow and the gate footer stacks.

## Elevation & Depth

Hybrid and quiet: flat tonal layers (ground, white surface, soft surface) separated by hairlines, with soft, diffuse, ink-tinted shadows that use negative spread so they read as lift rather than outline. Shadows deepen on hover for interactive containers. In dark mode shadows become plain black and depth comes mostly from the surface ramp (ground, surface, raised).

### Shadow Vocabulary
- **Resting** (`--shadow-sm`: `0 1px 2px rgb(17 41 43/.05), 0 2px 8px -4px rgb(17 41 43/.08)`): panels, metrics, cards, course tiles, role rows, the hub list container.
- **Lifted** (`--shadow-md`: `0 2px 4px rgb(17 41 43/.04), 0 14px 28px -14px rgb(17 41 43/.22)`): hover on role rows and course tiles, the overview hero, toasts.
- **Dialog** (`0 2px 6px rgb(17 41 43/.08), 0 32px 64px -24px rgb(17 41 43/.35)`): modal dialogs, over a 42% deep-teal backdrop with 3px blur.

### Named Rules
**The Lift on Intent Rule.** Containers rest at the resting shadow and only reach the lifted shadow on hover or when they are the page's one hero.

## Shapes

Gently rounded, never pill-shaped except for small chips. Controls and nav items use 10px; panels, metrics and icon tiles 12px; entry role rows 14px; large grouped containers 16px; the overview hero 18px; status chips 5px; counts and role pills are full pills. Borders are 1px hairlines everywhere. The one recurring silhouette is the heartbeat: the ECG waveform (P, QRS, T) in canvas and in the route sweep SVG, plus a faint circular halo behind the entry heart.

## Components

### Buttons
Calm and solid; they press, they do not bounce.
- **Shape:** gently rounded (10px), min-height 42px, Readex Pro 500, 14px.
- **Primary:** Clinical Teal fill, white text; hover to Deep Teal.
- **Secondary:** white surface, hairline border, Ink text; hover to a pale teal-grey.
- **On the deep-teal hero:** primary is near-white (#f4faf8) with Deep Teal text (hover white); secondary is a translucent white wash (8%) with a 20% white border.
- **Press:** scale(0.98). Transitions on background, shadow (0.2s) and transform with the system ease-out.
- **Text buttons:** Clinical Teal text with a trailing left arrow, no fill.

### Chips
- **Status chip:** 5px radius, tinted background, matching ink, a 4px leading dot in currentColor.
- **Live-count pill:** Mint Wash pill with Clinical Teal 500 text, on hub rows (e.g. open-ticket count).
- **Demo badge:** small warm-tinted chip with a gold dot, in the top bar.

### Cards / Containers
- **Panels and metrics:** white, 12px, hairline border, resting shadow. Panel headers 19px 22px 15px.
- **Hub list:** one 16px container with two hairline-divided columns of rows (icon tile, title + one-line description, optional live-count pill, arrow). Rows have no own background or shadow; hover fills the icon tile with Clinical Teal, turns title and arrow teal, and nudges the arrow 4px toward the reading direction.
- **Course tiles:** resting shadow; hover lifts 3px with the lifted shadow.

### Inputs / Fields
- **Style:** white surface, hairline border, 42px min-height; search fields carry a leading muted icon.
- **Focus:** the global gold focus ring (2px solid, 3px offset). Caret is Clinical Teal.

### Navigation
- **Rail:** Deep Teal, logo at top, portal name in serif, section label in Rail Label. Items are Readex Pro 14.5px, 10px radius; hover is a 7% white wash with white text; active is Rail Active with white text. In dark mode active and hover use Dark Mint with the aqua accent.
- **Top bar:** 68px, surface at 96% opacity with a hairline shadow line; breadcrumb on the start side. The route-pulse sweep runs along its bottom edge.
- **Tabs:** segmented control on a tinted track; the active tab is white with teal text.

### Entry Role Row (signature)
The primary action on the gate. A three-column row: 48px icon tile tinted with the role hue, a body (17px 600 title, 14px muted description, 12.5px feature line in the role hue), and an arrow. Hover tints the border with the role hue, lifts to the lifted shadow, fills the icon tile solid, and slides the row 4px toward the reading direction (RTL: left). A plain "staff" text link follows the rows.

### Pulse Scene (signature)
One canvas: a rotating point-cloud heart (1700 points; 900 compact) that beats at a calm 1.15s cycle, a gold scan ellipse whose nearby points flare in gold, and an ECG trace drawn beneath. Colours come only from `--scene-ink`, `--scene-hot` and `--scene-line`, so it follows the theme and can be re-tinted per container (the hero re-tints it to pale aqua and hero gold). Below 120px tall it draws the trace only. It tilts gently toward the pointer.

### Motion
- **Easing:** `cubic-bezier(.16,1,.3,1)` in CSS; GSAP `expo.out` for entrances.
- **Entrances run only on route change** (role + view key), never on in-page re-renders: above-the-fold blocks rise 16-18px and fade in over 0.8s with 0.035-0.06s stagger; below-the-fold containers reveal once via ScrollTrigger at 94% of the viewport.
- **Route sweep:** a gold dash travels the ECG path under the top bar (1.2s, power2.inOut).
- **Data:** numeric metrics count up (1.1s, power3.out); progress and chart bars grow from the right.
- **Gate:** scene scales in from 0.94 over 1.6s; copy rises; role rows slide in from the reading side.
- **Dialogs:** rise 10px and scale from 0.985 over 0.38s.
- **Reduced motion:** GSAP motion is skipped entirely and CSS animations/transitions collapse to 0.01ms; content is fully visible without motion.

## Do's and Don'ts

### Do:
- **Do** keep Deep Teal as the only large saturated surface (rail and overview hero).
- **Do** use gold only as a signal: focus ring, selection, the pulse sweep, scene hot points, small dots.
- **Do** set every heading `h1`-`h3` in Thmanyah Serif Display and every control, table and row title in Readex Pro.
- **Do** group related items as hairline-divided rows inside one container, with an icon tile, a title, a one-line description and a left-pointing arrow.
- **Do** give every interactive control at least 42px height and the gold focus ring.
- **Do** drive any new canvas or scene from `--scene-ink`, `--scene-hot` and `--scene-line` so it follows both themes.
- **Do** run entrance motion only on route change, with `expo.out`, and skip it under reduced motion.
- **Do** define every new colour for both themes.

### Don't:
- **Don't** fill buttons or surfaces with gold.
- **Don't** put a label or eyebrow line above headings; the build hides them on page headings and slide titles.
- **Don't** add numbered icon-card grids or gradient-filled hero tiles; the hub is one flat deep-teal hero and a divided list.
- **Don't** add a second living element; the heartbeat is the only ambient animation.
- **Don't** use role hues outside the entry gate.
- **Don't** replay entrance animations on in-page re-renders, filters or tab switches.
- **Don't** use English marketing lines in the UI.
