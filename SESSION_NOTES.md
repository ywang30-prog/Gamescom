# Gamescom Project - Session Notes

## Project Location
- **Local**: `~/Desktop/Ghost-Project-Space/Status-Design-Exploration`
- **GitHub**: https://github.com/ywang30-prog/Gamescom
- **Dev Server**: http://localhost:5173/
- **Start Dev Server**: `npm run dev` (runs in background)

## Current Status (Last Updated: 2026-07-20)

### ✅ Completed Features

1. **Hotspot Positions - FIXED AND COMMITTED**
   - All 16 hotspot positions are now correct in the code defaults
   - Positions match the Ghost controller layout perfectly
   - Works on both Ghost Home and Button Remapping pages
   - Committed to git, pushed to GitHub

2. **Edit Mode - Ghost Home Page**
   - Toggle button visible at top of page
   - Drag hotspots to reposition
   - Click hotspot to pin and show coordinate inputs
   - "Copy Positions to Console" button for exporting
   - Saves to localStorage on "Save & Exit Edit Mode"

3. **Edit Mode - Button Remapping Page** 
   - "Edit Layout" button at top of controller view
   - Drag tooltips to reposition
   - Click tooltip to pin and edit X/Y coordinates
   - Tooltip positions saved separately from hotspots
   - "Copy Tooltip Positions" and "Copy Leader Line Positions" buttons for exporting
   - Visual indicators: yellow ring (hover), green ring (pinned), blue ring (dragging)
   - Live Y offset editor with slider and number input (default: 8px)
   - Clean hover states without animated borders (TracingAnimationLayer removed)

4. **Leader Line Editing - Button Remapping Page ✅ NEW**
   - SVG leader lines are now fully editable in edit mode
   - Each line has draggable control points (orange circles)
   - Control points turn blue when dragging
   - Click and drag any control point to reshape the line
   - Line paths stored as arrays of {x, y} coordinates
   - All 12 leader lines support editing (leftStick, leftBumper, dPadUp, dPadLeft, dPadDown, dPadRight, rightBumper, buttonY, buttonB, buttonX, buttonA, rightStick)
   - Positions saved to localStorage on "Save & Exit Edit Mode"
   - Separate export button for leader line coordinates

5. **Shared Hotspot Positions**
   - Both pages load from same localStorage key: `hotspotPositions`
   - Code defaults in both files are identical and correct
   - Clearing localStorage will revert to correct defaults

### 📁 Key Files

**Components:**
- `src/components/Home.jsx` - Ghost Home page with hotspot editor
- `src/components/ButtonMapping.jsx` - Button Remapping page with tooltip editor
- `src/components/HotspotDetailCard.jsx` - Hotspot detail popup
- `src/components/ProfileSelector.jsx` - Profile switching
- `src/components/DeviceStatusWidget.jsx` - Battery/connection status

**Utilities:**
- `public/clear-storage.html` - Utility page to clear localStorage

### 🎯 Default Hotspot Positions (in code defaults)

**Ghost Home Page** (`src/components/Home.jsx` - lines 56-72):
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
  'Menu Button': { left: 450, top: 159 },
  'View Button': { left: 711, top: 159 },
}
```

**Button Remapping Page** (`src/components/ButtonMapping.jsx` - lines 145-161):
Same positions BUT with +8px Y offset applied:
```javascript
{
  'Left Stick': { left: 459, top: 379 },      // +8px
  'Left Bumper': { left: 361, top: 133 },     // +8px
  'D Pad Up': { left: 351, top: 192 },        // +8px
  'D Pad Left': { left: 351, top: 337 },      // +8px
  'D Pad Down': { left: 278, top: 265 },      // +8px
  'D Pad Right': { left: 423, top: 265 },     // +8px
  'Right Bumper': { left: 818, top: 185 },    // +8px
  'Button Y': { left: 821, top: 133 },        // +8px
  'Button B': { left: 892, top: 265 },        // +8px
  'Button X': { left: 740, top: 265 },        // +8px
  'Button A': { left: 818, top: 348 },        // +8px
  'Right Stick': { left: 706, top: 379 },     // +8px
  'Left Trigger': { left: 473, top: 130 },    // +8px
  'Right Trigger': { left: 697, top: 130 },   // +8px
  'Menu Button': { left: 450, top: 167 },     // +8px
  'View Button': { left: 711, top: 167 },     // +8px
}
```

**Controller Y Offset:** Default is 8px on Button Remapping page to match Ghost Home positioning.
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
1. Edit hotspot positions on Ghost Home → Saved to `hotspotPositions`
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

3. **Verify hotspots are correct:**
   - Open http://localhost:5173/
   - Hotspots should be positioned correctly on controller
   - If not, go to http://localhost:5173/clear-storage.html and clear localStorage

### 📋 Next Steps / TODO

1. **Potential Improvements:**
   - Add preset configurations for different games
   - Export/import hotspot positions as JSON
   - Add undo/redo for position changes
   - Visual grid/snap-to-grid for precise positioning
   - Lock individual hotspots to prevent accidental moves

### 🐛 Known Issues

- None currently! All editing features are working as expected.

### 🔧 Development Tips

**To clear localStorage if positions get messed up:**
- Visit: http://localhost:5173/clear-storage.html
- Or console: `localStorage.clear()`
- Or console: `localStorage.removeItem('hotspotPositions')`

**To export current positions:**
1. Enter edit mode (Ghost Home or Button Remapping page)
2. Click "Copy Tooltip Positions" or "Copy Leader Line Positions"
3. Open DevTools (F12) → Console tab
4. Copy the logged positions

**Important localStorage Concept:**
- localStorage is browser-specific, NOT saved in git
- Code defaults in `.jsx` files ARE saved in git
- Always update code defaults when you have correct positions
- This way, fresh clones of the repo will have correct positions

### 📊 Project Structure

```
Status-Design-Exploration/
├── src/
│   ├── components/
│   │   ├── ButtonMapping.jsx   (Main button remapping UI + tooltip editor)
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

---

## 📝 For Next Context / Session Continuity

**Last verified working:** 2026-07-20

**Current State:**
- ✅ All 16 hotspots positioned correctly on both pages
- ✅ Leader line editing fully functional with draggable control points
- ✅ Tooltip editing working with pin/drag/coordinate inputs
- ✅ Live Y offset editor available (default: 8px on Button Remapping)
- ✅ All positions saved to localStorage and code defaults
- ✅ TracingAnimationLayer removed (no more weird tooltip animations)
- ✅ Latest commit: f1aa0c0 "Remove TracingAnimationLayer to fix weird tooltip animation"

**Quick Start for New Context:**
1. Run `npm run dev` to start dev server (http://localhost:5173)
2. All hotspot positions are already correct in code defaults
3. localStorage will override defaults if user has made edits
4. To reset to defaults: visit http://localhost:5173/clear-storage.html
5. Edit mode available on both Ghost Home and Button Remapping pages

**What's Saved Where:**
- **Code defaults** = Initial positions for fresh clones/users
- **localStorage** = User's custom edits (takes precedence over defaults)
- **Git commits** = Code defaults are version controlled
- To update defaults: edit the code, then commit to git

**Repository:** https://github.com/ywang30-prog/Gamescom
