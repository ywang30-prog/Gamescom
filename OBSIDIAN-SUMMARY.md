# Ghost 8K Polling Rate Status Panel Prototype

## Problem Statement
The Ghost controller advertises 8K polling, but raw HID data is inherently variable (3000 → 9500 → 1200 Hz frame-to-frame). Displaying raw numbers makes the device look "broken" even when performing correctly. Users need confidence that 8K is working without anxiety-inducing jitter.

## Solution: State-Based Status Widget

### Core Concept
Replace raw Hz numbers with **interpreted states** that reflect actual performance quality.

### Three States
| State | Color | Threshold | Meaning |
|-------|-------|-----------|---------|
| 🟢 Excellent ~8K | `#2dba3e` | ≥6000 Hz | 8K-class performance |
| 🟡 Stable ~4K | `#f59e0b` | ≥3000 Hz | Mid-tier stable |
| 🔴 Degraded ~1K | `#ef4444` | <3000 Hz | USB/cable issues |

### Design

**Collapsed (default):**
```
┌─────────────────────────────┐
│ GHOST              🔋 100%  │
│ ● Excellent ~8K             │
└─────────────────────────────┘
```

**Expanded (on hover):**
```
┌─────────────────────────────┐
│ GHOST              🔋 100%  │
│ ● Excellent ~8K             │
│ ─────────────────────────── │
│ RANGE         STATUS        │
│ 7000-8000 Hz  Stable        │
│ CURRENT       UPDATED       │
│ 7845 Hz       just now      │
│ PERFORMANCE         98%     │
│ ▓▓▓▓▓▓▓▓▓▓░                │
└─────────────────────────────┘
```

## Key Design Decisions

### Why state-based instead of raw Hz?
- "Excellent" is immediately understandable vs "7342 Hz"
- Hides normal HID jitter that would look like instability
- Color-coded for quick glance assessment

### Why hover-to-detail?
- Default view stays clean
- Power users get details when troubleshooting
- Doesn't overwhelm casual users

### Why 800ms update interval?
- <500ms: Too jittery, creates anxiety
- **800ms: Sweet spot** — smooth + responsive
- >1.5s: Feels laggy, not "live"

### Visual refinements
- Status text is neutral gray (`#a7a7a8`), only dot uses state color
- Fixed 120px container prevents layout shift on expand
- Panel expands downward, overlays content below

## What We Ruled Out

| Feature | Why Not |
|---------|---------|
| "Verify 8K" test mode | Too much engineering for MVP |
| Raw Hz display | Misleading, anxiety-inducing |
| Historical timeline | Unnecessary complexity initially |

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Elysium Design System tokens
- Brown Logitech Pan font

## Files
```
Status-Design-Exploration/
├── src/components/
│   ├── DeviceStatusWidget.jsx  ← Main widget
│   └── Home.jsx                ← Integration
├── public/
│   └── ghost-controller-white.png
├── EXPLORATION-SUMMARY.md
├── STATUS-PANEL-README.md
└── DESIGN-CHANGES.md
```

## Run the Prototype
```bash
cd Status-Design-Exploration
npm install
npm run dev
# Open http://localhost:5173
```

## Open Questions
1. Is "Excellent/Stable/Degraded" the right vocabulary?
2. Should tooltip be click-to-pin instead of hover?
3. Is timestamp ("just now") useful or clutter?
4. Should we alert users when state degrades?

## Future Enhancements
- Full percentile breakdown (5th/50th/95th)
- USB port/cable recommendations
- Historical trend charts
- State change notifications

---

**Status:** Prototype complete, ready for user testing  
**Next:** Gather feedback, refine, implement production version
