# Status Panel Design Changes

## Latest Updates (Iteration 2)

### Visual Changes

1. **Device Name Size**
   - Reduced from 32px to 24px
   - Better balance with status information

2. **Status Text Color**
   - Changed from colored text (green/yellow/red) to neutral gray (#a7a7a8)
   - Only the dot indicator uses state color
   - Matches CIRILLA reference design

3. **Panel Expansion Behavior**
   - Fixed height container (120px) prevents content below from shifting
   - Panel expands downward on hover without pushing controller image
   - Smooth transition maintains layout stability

4. **Hotspots Removed**
   - All controller hotspot markers removed
   - Clean view focuses attention on status panel
   - Can be re-added later if needed

### Current Design

**Collapsed State:**
```
┌─────────────────────────────┐
│ GHOST              🔋 100%  │
│ ● Excellent ~8K             │  ← Gray text, colored dot only
└─────────────────────────────┘
```

**Expanded State (on hover):**
```
┌─────────────────────────────┐
│ GHOST              🔋 100%  │
│ ● Excellent ~8K             │
│ ─────────────────────────── │
│ RANGE         STATUS         │
│ 7000-8000 Hz  Stable        │
│                             │
│ CURRENT       UPDATED       │
│ 7845 Hz       just now      │
│                             │
│ PERFORMANCE         98%     │
│ ▓▓▓▓▓▓▓▓▓▓░                │
└─────────────────────────────┘
  ↑ Expands down, nothing shifts
```

### Color Usage

**State Indicator Dot:**
- 🟢 Excellent: `#2dba3e`
- 🟡 Stable: `#f59e0b`
- 🔴 Degraded: `#ef4444`

**Text Colors:**
- Device name: `#ffffff` (white)
- Status label: `#a7a7a8` (neutral gray) ← Changed
- Labels: `#a7a7a8` (neutral gray)
- Values: Varies by context
  - Range: State color
  - Status: `#e6e6e6` (off-white)
  - Current: `#00b6fa` (blue)
  - Updated: `#a7a7a8` (gray)

**Battery:**
- Background: `#082b0d` (dark green)
- Border: `#2dba3e` with 20% opacity
- Text: `#2dba3e` (green)

### Layout Improvements

**Fixed Container:**
- Parent container: 120px fixed height
- Panel starts at: 120px min-height
- On hover: Panel grows downward
- Controller image: Stays in place (no reflow)

**Z-Index:**
- Panel: `z-10` (sits above controller when expanded)
- Ensures expanded content overlays cleanly

### Typography

- Device name: 24px Bold (was 32px)
- Status label: 15px Regular (was Bold + colored)
- Detail labels: 11px uppercase
- Detail values: 20px Bold

## Reference

Based on CIRILLA device status panel design:
- Device name integrated into panel
- Battery badge in corner
- Neutral text with colored indicators
- Expandable details on interaction
