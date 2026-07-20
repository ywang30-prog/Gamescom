# Ghost Polling Rate Status Panel - Design Exploration

## Overview
This exploration focuses on designing a **live polling rate status panel** for the Ghost 8K controller that honestly represents real-world polling performance while remaining useful and non-anxiety-inducing for professional users.

## Design Constraints

### Technical Reality
- 8K polling is **variable** by nature (HID jitter, USB timing)
- Actual rates jump: 3000 → 9500 → 1200 Hz frame-to-frame
- Raw numbers look "broken" even when performing well
- Can't promise perfect constant 8000 Hz

### User Needs
- Pros need **confidence** that 8K is working
- Quick glance status without cognitive load
- Details available when troubleshooting
- Avoid misleading static numbers (like "8000 Hz")

## Solution: State-Based Integrated Widget

### Component: DeviceStatusWidget

**Default View:**
```
┌─────────────────────────────────────────────┐
│ Ghost  │ ● Excellent ~8K  │  🔋 Battery 50% │
└─────────────────────────────────────────────┘
```

**On Hover (Tooltip):**
```
┌──────────────────────────────┐
│ POLLING RATE DETAILS         │
│ ● Excellent ~8K              │
│                              │
│ Mostly 7000-8000 Hz, stable  │
│ Last updated: just now       │
│                              │
│ Current Sample: 7845 Hz      │
│ ▓▓▓▓▓▓▓▓▓▓░ 98%             │
└──────────────────────────────┘
```

### State Classification

**Excellent (~8K)** - Green `#2dba3e`
- Threshold: ≥6000 Hz effective rate
- Range shown: "7000-8000 Hz"
- Indicates 8K-class performance

**Stable (~4K)** - Yellow `#f59e0b`
- Threshold: ≥3000 Hz effective rate
- Range shown: "3500-5000 Hz"
- Indicates mid-tier stable performance

**Degraded (~1K)** - Red `#ef4444`
- Threshold: <3000 Hz effective rate
- Range shown: "500-2000 Hz"
- Indicates poor performance / USB issues

### Update Frequency

**Optimal: 800ms intervals**

**Rationale:**
- **Too fast (< 500ms):** State changes feel jittery, creates anxiety
- **Too slow (> 1.5s):** Feels laggy, not "live"
- **800ms sweet spot:** 
  - Smooths out HID jitter naturally
  - Responsive enough to catch real issues
  - Allows for visual stability
  - Good balance for UI updates

**Implementation:**
```javascript
setInterval(() => {
  // Sample current Hz
  // Calculate state based on effective rate
  // Update UI
}, 800);
```

### Integration

**Replaces:** Old battery-only status chip

**New Layout:**
- Device name: "Ghost" (left)
- Polling rate indicator (center)
- Battery status (right)
- Unified panel with divider

**Benefits:**
- All critical device status in one glance
- Consistent visual language
- Hover for details doesn't clutter default view
- Professional, data-dense but clean

## What We're NOT Doing (Out of Scope)

### ❌ "Verify 8K" Test Mode
**Why:** Too much engineering effort for MVP
- Requires guided test flow
- Controlled load generation
- Complex verdict logic
- Can be added post-MVP if needed

### ❌ Raw Current Hz Display
**Why:** Misleading and anxiety-inducing
- Shows 3000 → 9500 → 1200 Hz jumps
- Users think it's broken
- Doesn't reflect actual stability

### ❌ Historical Timeline/Graph
**Why:** Unnecessary complexity for initial version
- Most users don't need it
- State + range is sufficient
- Can add in "Advanced" view later

## Technical Implementation Notes

### State Calculation (Simplified for Demo)
Real implementation should use:
- **Percentile-based thresholds** (e.g., 90th percentile ≥ 6000 Hz = Excellent)
- **Rolling window** (last 5-10 seconds of samples)
- **Jitter detection** (variance in samples)

Demo uses:
- Simulated 8K with realistic jitter
- Instant threshold check
- Visual demonstration only

### Timestamp Logic
```javascript
getTimeSinceUpdate() {
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}
```

### Visual Feedback
- **Color-coded dots:** Immediate state recognition
- **Progress bar:** Optional visual for current sample
- **Smooth transitions:** Avoid jarring state flips

## Design System Alignment

**Colors:**
- Excellent: `#2dba3e` (existing battery green)
- Stable: `#f59e0b` (amber warning)
- Degraded: `#ef4444` (red alert)

**Typography:**
- Font: Brown Logitech Pan (consistent)
- Sizes: 10px labels, 13px values, 14px detail text
- Weights: Regular labels, Bold values

**Layout:**
- Background: `#1a1a1a` (existing panel bg)
- Border: `#333` (existing stroke)
- Divider: 1px `#333`
- Padding: 16px horizontal, 10px vertical

## User Testing Questions

1. **Clarity:** Is "Excellent ~8K" immediately understandable?
2. **Trust:** Does the state feel accurate when you see it?
3. **Detail:** Is hover tooltip enough, or do users want persistent detail view?
4. **Timestamp:** Is "just now / 2s ago" helpful or unnecessary?
5. **Progress bar:** Does the current sample bar add value or clutter?

## Future Enhancements (Post-MVP)

### Advanced Details View
- Full percentile breakdown (5th, 50th, 95th percentile Hz)
- Jitter variance metric
- USB port/cable recommendations
- Historical trend (last 1 min / 5 min / 1 hour)

### Notification System
- Alert when dropping from Excellent → Degraded
- Suggest USB port change if unstable
- Firmware update recommendations

### Accessibility
- ARIA labels for state
- Keyboard navigation for tooltip
- High contrast mode support
- Screen reader announcements for state changes

## Running This Exploration

```bash
cd Status-Design-Exploration
npm install
npm run dev
```

Open http://localhost:5173 and navigate to the Home view to see the status widget in action.

## Files Changed
- `src/components/DeviceStatusWidget.jsx` - New integrated status widget
- `src/components/Home.jsx` - Updated to use new widget + white controller image
- `public/ghost-controller-white.png` - New controller image

## Related Documents
- Obsidian Notes: `/Users/ywang30/Documents/Obsidian Vault/Priority Setting/Ghost.md`
- Original Prototype: `/Users/ywang30/Desktop/Ghost-Project-Space/Prototype/Exploration/`
