# Gamescom Project - Session Notes

## Project Location
- **Local**: `~/Desktop/Ghost-Project-Space/Status-Design-Exploration`
- **GitHub**: https://github.com/ywang30-prog/Gamescom
- **Dev Server**: http://localhost:5173/
- **Start Dev Server**: `npm run dev` (runs in background)

## Current Status (Last Updated: 2026-07-23 - Session 4 - Figma Design Implementation & Trigger Images)

### ✅ Completed Features

#### SESSION 4 (2026-07-23) - Figma Design Implementation & Trigger Images

1. **Sticks Page Styling - Figma 1:1 Implementation** (Commits 12346d2, 9265a71)
   - **Header:** Added back arrow button (32px, 2px border, navigates to home)
   - **Sliders:** Added info icons next to Inner/Outer Deadzone labels
   - **Labels:** Changed to "0, 50, 100" format (was "0, 100"), font-size: 10px
   - **Number Inputs:** Border style `border-[#2e2e2e]`, min-w-[60px] max-w-[82px], inline % symbol
   - **Toggles:** Gap between rows: 16px, gap to labels: 12px
   - **Advanced Controls:** Removed "Curve Adjustment" slider section per design update
   - **Spacing & Typography:** Updated to match Figma specs exactly
   - All existing interactions maintained

2. **Triggers Page - Controller Images** (Commits e79fb2e, 670faff, 1da2205)
   - **Left Trigger Image:** Added high-res image (7316x4744px)
     - Position: X=78px, Y=-30px, Scale=1.8
     - Arc: Left offset=-20px, Top offset=-200px
   - **Right Trigger Image:** Added high-res image
     - Position: X=-80px, Y=-25px, Scale=1.8
     - Arc: Left offset=273px, Top offset=-193px
   - Both triggers now use dedicated images (no more flipping)
   - Images stored in `/public/ghost-controller-left-trigger.png` and `ghost-controller-right-trigger.png`

3. **Figma Design Context Retrieved**
   - Sticks panel base state: https://www.figma.com/design/gDE9NANyfk8RWIt7XF05ew/Ghost?node-id=743-16713
   - Sticks panel advanced state: https://www.figma.com/design/gDE9NANyfk8RWIt7XF05ew/Ghost?node-id=746-11678
   - Design tokens, spacing, colors all documented and applied

#### SESSION 3 (2026-07-23) - Sticks Page Refactor

1. **Axis Trajectory Visualization** (Commit 4ddc700)
   - Visual axis line from center to furthest dot (blue or white)
   - Shows game-registered input percentage at end of axis
   - 4px thick line, only visible when stick is pushed
   - Line extends to whichever dot is furthest from center

2. **DeviceStatusWidget Added to All Pages** (Commit dc792de)
   - Added to Sticks page (Mapping.jsx)
   - Added to Triggers page (TriggerDeadzone.jsx)
   - Added to Aim Training page (ReflexRange.jsx)
   - Replaced hardcoded battery/Ghost header sections
   - Consistent polling rate monitoring across all configuration pages

3. **Sticks Page UI Refactor** (Commit 5c97ea0)
   - **Removed:** Left/Right tab toggle from side panel
   - **Added BinaryToggle at bottom of controller** (matches Button Remapping UX)
   - **"Apply to both sticks" toggle:**
     - Global state - OFF on either page turns OFF for both
     - When ON: Changes to either stick apply to both
     - Real-time sync based on active stick
     - Persists to localStorage
   - **"Advanced stick control" toggle:**
     - When ON: Shows Curated Presets, sensitivity dropdown, curve adjustment, curve graph
     - When OFF: Hides all advanced controls
     - Persists to localStorage
   - **Simplified side panel:** Removed description, added border to header
   - Sensitivity section now always expanded when Advanced toggle is ON (no accordion)

#### SESSION 1 & 2 (2026-07-21)

1. **Hotspot Positions - UPDATED**
   - All 13 visible hotspot positions updated and committed
   - Positions match the Ghost controller layout perfectly
   - Works on both Ghost Home and Button Remapping pages
   - Committed to git, pushed to GitHub (commit: `daf6d7e`)

2. **Edit Mode - Ghost Home Page**
   - Toggle button visible at top of page
   - Drag hotspots to reposition
   - Click hotspot to pin and show coordinate inputs
   - "Copy Positions to Console" button for exporting
   - Saves to localStorage on "Save & Exit Edit Mode"

3. **Edit Mode - Button Remapping Page ✅ FULLY UPDATED**
   - "Edit Layout" button at top of controller view
   - **Hotspots are now draggable** (same as tooltips)
   - Drag tooltips to reposition
   - Click tooltip/hotspot to pin and edit X/Y coordinates
   - Tooltip positions saved separately from hotspots
   - "Copy Tooltip Positions", "Copy Leader Line Positions", and "Copy Hotspot Positions" buttons
   - Visual indicators: yellow ring (hover), green ring (pinned), blue ring (dragging)
   - Live Y offset editor with slider and number input (default: 8px)
   - Clean hover states without animated borders (TracingAnimationLayer removed)

4. **Leader Line Editing - Button Remapping Page ✅ ENHANCED**
   - SVG leader lines are fully editable in edit mode
   - Each line has draggable control points (orange circles)
   - Control points turn blue when dragging
   - **Hold Shift** to align control point with adjacent point's Y position (creates horizontal segments)
   - Click and drag any control point to reshape the line
   - Line paths stored as arrays of {x, y} coordinates
   - All 13 leader lines support editing (includes new viewButton)
   - Positions saved to localStorage on "Save & Exit Edit Mode"

5. **Undo/Redo Functionality ✅ NEW**
   - **Cmd+Z** (or Ctrl+Z) to undo last change
   - **Cmd+Shift+Z** (or Ctrl+Shift+Z) to redo
   - Visual undo/redo buttons in edit mode UI
   - 50-state history limit
   - Debounced saves (500ms after dragging stops)
   - Tracks all hotspot, tooltip, and leader line positions
   - History auto-clears when exiting edit mode

6. **Menu and Profile Buttons ✅ NEW**
   - Added Menu button tooltip on right side (label: "Button" / "Menu")
   - Added Profile button tooltip on right side (label: "Button" / "Profile")
   - Both buttons have hotspots, tooltips, and leader lines
   - Leader lines with editable control points
   - Fully integrated into edit mode
   - Included in all preset configurations (Default, FPS, Racing)

7. **View Button ✅ NEW**
   - Added View button tooltip on left side
   - Tooltip label: "Button" / "View"
   - Leader line with 3 editable control points
   - Fully integrated into edit mode
   - Included in all preset configurations

8. **BinaryToggle Component ✅ NEW**
   - Front/Back view switcher created from Figma design
   - Positioned at bottom center (64px from viewport bottom)
   - Connected to viewMode state for switching between front/back views
   - Styled with Logitech design system colors
   - Smooth transitions and accessibility features

9. **Shared Hotspot Positions**
   - Both pages load from same localStorage key: `hotspotPositions`
   - Code defaults in both files are identical and correct
   - Clearing localStorage will revert to correct defaults

10. **DeviceStatusWidget Hover Fix ✅**
   - Reduced hover trigger area from 237px to 48px height
   - Widget now only expands when hovering directly over it
   - Prevents unexpected expansion when cursor is near the widget

### 📁 Key Files

**Components:**
- `src/components/Home.jsx` - Ghost Home page with hotspot editor
- `src/components/ButtonMapping.jsx` - Button Remapping page with tooltip/hotspot/leader line editor
- `src/components/BinaryToggle.jsx` - Front/Back view toggle switch (NEW)
- `src/components/HotspotDetailCard.jsx` - Hotspot detail popup
- `src/components/ProfileSelector.jsx` - Profile switching
- `src/components/DeviceStatusWidget.jsx` - Battery/connection status (hover area fixed)

**Utilities:**
- `public/clear-storage.html` - Utility page to clear localStorage

### 🎯 Current Default Positions (in code defaults)

**Tooltip Positions** (`src/components/ButtonMapping.jsx` - updated in latest commits):
```javascript
{
  leftStick: { left: 27, top: 661 },
  leftBumper: { left: 27, top: 36 },
  dPadUp: { left: 27, top: 212 },
  dPadLeft: { left: 27, top: 304 },
  dPadDown: { left: 27, top: 392 },
  dPadRight: { left: 27, top: 481 },
  rightBumper: { left: 1144, top: 36 },
  buttonY: { left: 1146, top: 211 },
  buttonB: { left: 1147, top: 304 },
  buttonX: { left: 1147, top: 481 },
  buttonA: { left: 1147, top: 392 },
  rightStick: { left: 1147, top: 661 },
  buttonShare: { left: 27, top: 569 },
  viewButton: { left: -82, top: 124 },
  menuButton: { left: 1253, top: 124 },
  profileButton: { left: 1256, top: 569 },
}
```

**Hotspot Positions** (`src/components/ButtonMapping.jsx` and `Home.jsx` - updated in latest commits):
```javascript
{
  'Left Stick': { left: 459, top: 371 },
  'Left Bumper': { left: 361, top: 125 },
  'D Pad Up': { left: 351, top: 184 },
  'D Pad Left': { left: 351, top: 329 },
  'D Pad Down': { left: 278, top: 257 },
  'D Pad Right': { left: 423, top: 257 },
  'Right Bumper': { left: 818, top: 177 },
  'Button Y': { left: 821, top: 125 },
  'Button B': { left: 892, top: 257 },
  'Button X': { left: 740, top: 257 },
  'Button A': { left: 818, top: 340 },
  'Right Stick': { left: 706, top: 371 },
  'Left Trigger': { left: 473, top: 122 },
  'Right Trigger': { left: 697, top: 122 },
  'Button Share': { left: 502, top: 272 },
  'Menu Button': { left: 711, top: 159 },
  'View Button': { left: 451, top: 159 },
  'Profile Button': { left: 664, top: 273 },
}
```

**Leader Line Positions** (updated in commit `daf6d7e`):
- All left-side leader lines have horizontally aligned segments (using Shift key)
- View button leader line added: `[{ x: -41.2, y: 2.2 }, { x: 33.8, y: 2.2 }, { x: 201.6, y: 15.1 }]`

**Controller Y Offset:** Default is 8px on Button Remapping page.
All hotspots, leader lines, and control points move together with this offset.

### 💾 localStorage Keys (User Edits Persist Here)

**Shared Between Pages:**
- `hotspotPositions` - Hotspot dot positions (shared by Ghost Home and Button Remapping)
- `currentPreset` - Active profile (desktop, fps, p1, p2, p3, etc.)
- `hasUnsavedChanges` - Global unsaved changes flag

**Button Remapping Page Only:**
- `buttonMappingTooltipPositions` - Tooltip label positions
- `buttonMappingLeaderLinePositions` - SVG leader line path coordinates
- `buttonMappings_{profile}` - Button assignments per profile
- `tooltipAssignments_{profile}_{presetConfig}` - Tooltip assignments

**Important:** All edit mode changes are saved to localStorage automatically. When you:
1. Edit hotspot positions → Saved to `hotspotPositions`
2. Edit tooltip positions in edit mode → Saved to `buttonMappingTooltipPositions`
3. Edit leader line control points → Saved to `buttonMappingLeaderLinePositions`
4. Adjust controller Y offset → Applied immediately via transform
5. Click "Save & Exit Edit Mode" → All positions persist across sessions

### 🚀 To Start Working Again

1. **Pull latest from GitHub:**
   ```bash
   cd ~/Desktop/Ghost-Project-Space/Status-Design-Exploration
   git pull origin main
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5173/

3. **Verify everything is correct:**
   - Open http://localhost:5173/
   - Go to Button Remapping page
   - Hotspots, tooltips, and leader lines should be positioned correctly
   - If not, go to http://localhost:5173/clear-storage.html and clear localStorage

### 📋 Next Steps / TODO

1. **BACK BUTTONS IMPLEMENTATION (NEXT TASK):**
   - Add back button hotspots (4 paddles: P1, P2, P3, P4)
   - Add back button tooltips and leader lines
   - Update viewMode logic to show/hide front vs back buttons
   - Create or update ghost-controller-back.png image
   - Wire up BinaryToggle to switch between front/back views
   - Test all interactions on back view

2. **Potential Future Improvements:**
   - Add preset configurations for different games
   - Export/import hotspot positions as JSON
   - Visual grid/snap-to-grid for precise positioning
   - Lock individual hotspots to prevent accidental moves
   - Animation transitions when switching front/back views

### 🐛 Known Issues

- None currently! All editing features are working as expected.

### 🔧 Development Tips

**Edit Mode Usage:**
1. Click "Edit Layout" on Button Remapping page
2. **Drag** any hotspot, tooltip, or leader line control point
3. **Click** to pin and show coordinate input fields
4. **Hold Shift** while dragging control points to align horizontally with adjacent points
5. **Cmd+Z** to undo, **Cmd+Shift+Z** to redo
6. Click export buttons to copy positions to console
7. Click "Save & Exit Edit Mode" to save all changes

**To clear localStorage if positions get messed up:**
- Visit: http://localhost:5173/clear-storage.html
- Or console: `localStorage.clear()`
- Or console: `localStorage.removeItem('hotspotPositions')`

**To export current positions:**
1. Enter edit mode (Button Remapping page)
2. Click "Copy Tooltip Positions", "Copy Leader Line Positions", or "Copy Hotspot Positions"
3. Open DevTools (F12) → Console tab
4. Copy the logged positions
5. Update code defaults in `ButtonMapping.jsx`

**Important localStorage Concept:**
- localStorage is browser-specific, NOT saved in git
- Code defaults in `.jsx` files ARE saved in git
- Always update code defaults when you have correct positions
- This way, fresh clones of the repo will have correct positions

**Shift Key for Horizontal Alignment:**
- Hold Shift while dragging a leader line control point
- It aligns with the closest adjacent point's Y position
- Creates perfectly horizontal line segments
- Works for all control points on all leader lines

### 📊 Project Structure

```
Status-Design-Exploration/
├── src/
│   ├── components/
│   │   ├── ButtonMapping.jsx   (Main button remapping UI + full editor)
│   │   ├── Home.jsx            (Ghost home page + hotspot editor)
│   │   ├── HotspotDetailCard.jsx
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── ghost-controller-white.png  (Controller image)
│   ├── clear-storage.html          (Utility page)
│   └── figmaAssets/
├── package.json
└── README.md
```

### 🎮 Controller Dimensions
- Controller image: 1188px × 771px
- Hotspot size: 24px × 24px
- Coordinate system: top-left origin (0,0)

### 🎨 Visible Elements (Current State)

**Hotspots (13 visible):**
- ✅ Left Stick
- ✅ Left Bumper
- ✅ D Pad Up/Left/Down/Right
- ✅ Right Bumper
- ✅ Button Y/B/X/A
- ✅ Right Stick
- ✅ Button Share
- ✅ View Button
- ❌ Left Trigger (removed)
- ❌ Right Trigger (removed)
- ❌ Menu Button (removed)

**Tooltips (14 total):**
- All 13 hotspots + View Button tooltip

**Leader Lines (14 total):**
- All 13 hotspots + View Button leader line

---

## 📝 Session 3 Summary - Sticks Page Refactor

**Last verified working:** 2026-07-23 (Session 3)
**Latest commits:** 
- `4ddc700` - Axis trajectory visualization
- `dc792de` - DeviceStatusWidget added to pages  
- `5c97ea0` - Sticks page UI refactor

**Current State:**
- ✅ All 18 hotspots positioned correctly (including Menu, Profile, View buttons)
- ✅ All 16 tooltips positioned and editable (includes Menu, Profile, View buttons)
- ✅ All 16 leader lines with editable control points
- ✅ BinaryToggle component for Front/Back switching (Button Remapping)
- ✅ **BinaryToggle added to Sticks page** (Left/Right stick selection)
- ✅ DeviceStatusWidget on all config pages (Button Remapping, Sticks, Triggers, Aim Training)
- ✅ Axis trajectory on Sticks page with percentage display
- ✅ "Apply to both sticks" global toggle
- ✅ "Advanced stick control" toggle for sensitivity controls
- ✅ Undo/Redo fully functional (Cmd+Z / Cmd+Shift+Z)
- ✅ Shift key aligns control points horizontally with adjacent points
- ✅ Front view fully implemented and positioned
- ⏳ Back view needs implementation (NEXT TASK)

**Quick Start for New Context:**
1. Run `npm run dev` to start dev server (http://localhost:5173)
2. All front view positions are correct in code defaults
3. Back view needs to be implemented next
4. localStorage will override defaults if user has made edits
5. To reset to defaults: visit http://localhost:5173/clear-storage.html
6. Edit mode available on Button Remapping page with full undo/redo

**What's Saved Where:**
- **Code defaults** = Initial positions for fresh clones/users (updated in latest commits)
- **localStorage** = User's custom edits (takes precedence over defaults)
- **Git commits** = Code defaults are version controlled
- To update defaults: edit positions in Edit Mode, export to console, update code, then commit to git

**Next Session Goals:**

1. **Sticks Page Refinements (if needed):**
   - Match Figma styling exactly (sliders, labels, numeric inputs)
   - Improve Curated Presets dropdown visual hierarchy
   - Fine-tune curve graph styling
   - Test toggle behaviors thoroughly

2. **Back Button View Implementation:**
   - Add back button hotspots (4 paddles: P1, P2, P3, P4)
   - Add back button tooltips and leader lines
   - Wire up BinaryToggle to switch controller image and show/hide appropriate buttons

**Key State Variables for Sticks Page:**
```javascript
// Toggle states (persist to localStorage)
const [applyToBothSticks, setApplyToBothSticks] = useState(false);
const [showAdvancedControls, setShowAdvancedControls] = useState(false);

// Stick selection
const [activeStick, setActiveStick] = useState('left');

// Left stick settings
const [leftDeadzone, setLeftDeadzone] = useState(18);
const [rightDeadzone, setRightDeadzone] = useState(5); // outer deadzone for left
const [curveAdjustment, setCurveAdjustment] = useState(0);
const [sensitivity, setSensitivity] = useState('Linear');

// Right stick settings (independent)
const [rightInnerDeadzone, setRightInnerDeadzone] = useState(18);
const [rightOuterDeadzone, setRightOuterDeadzone] = useState(5);
const [rightCurveAdjustment, setRightCurveAdjustment] = useState(0);
const [rightSensitivity, setRightSensitivity] = useState('Linear');
```

**Figma References for Sticks Page:**
- Main side panel: https://www.figma.com/design/gDE9NANyfk8RWIt7XF05ew/Ghost?node-id=743-16716
- Binary toggle: https://www.figma.com/design/gDE9NANyfk8RWIt7XF05ew/Ghost?node-id=977-8196
- Advanced controls ON: https://www.figma.com/design/gDE9NANyfk8RWIt7XF05ew/Ghost?node-id=746-11678

**Figma MCP Connected:**
- Successfully authenticated with Figma MCP
- Can pull designs directly from Figma URLs
- Used for BinaryToggle component and Sticks page refactor

**Repository:** https://github.com/ywang30-prog/Gamescom
**Latest Commit:** https://github.com/ywang30-prog/Gamescom/commit/5c97ea0
