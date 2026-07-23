# Next Session TODO - Critical Info

## IMMEDIATE ISSUE: Back View Shows Blank Page

### Root Cause
Hotspots that don't exist in back view are trying to render and crashing with:
`TypeError: undefined is not an object (evaluating 'currentHotspotPositions["View Button"].left')`

### What I Just Fixed
1. Wrapped "View Button" hotspot with `viewMode !== 'back'`

### What STILL NEEDS TO BE DONE
Wrap these hotspots with `viewMode !== 'back'` (they only exist in front view):

**Find and wrap these in ButtonMapping.jsx:**
- Left Bumper (line ~1605)
- D Pad Left (line ~1703) 
- D Pad Right (line ~1703)
- Right Bumper (line ~1820)
- Button B (line ~1741)
- Button X (line ~1761)
- Button Share (line ~1781)
- Profile Button (line ~1881)

**Pattern to use:**
```javascript
{viewMode !== 'back' && (
  <HotspotMarker
    name="Left Bumper"
    style={{ left: `${currentHotspotPositions['Left Bumper'].left}px`, ... }}
    // ... rest
  />
)}
```

## How to Test
1. Refresh browser
2. Click BACK toggle
3. Should show back controller image with 8 hotspots (not blank)
4. If still errors, check console for which hotspot is undefined
5. Wrap that hotspot with `viewMode !== 'back'`

## Key Architecture Changes Made Today

### 1. Separated Front/Back Positions
All position states now have `.front` and `.back` sub-objects:
- `tooltipPositions.front` / `tooltipPositions.back`
- `leaderLinePositions.front` / `leaderLinePositions.back`  
- `hotspotPositions.front` / `hotspotPositions.back`

### 2. Current View Helpers
```javascript
const currentTooltipPositions = tooltipPositions?.[viewMode] || tooltipPositions?.front || {};
const currentLeaderLinePositions = leaderLinePositions?.[viewMode] || leaderLinePositions?.front || {};
const currentHotspotPositions = hotspotPositions?.[viewMode] || hotspotPositions?.front || {};
```

### 3. Setter Helpers
```javascript
const setCurrentTooltipPositions = useCallback((updater) => {
  setTooltipPositions(prev => ({
    ...prev,
    [viewMode]: typeof updater === 'function' ? updater(prev[viewMode]) : updater
  }));
}, [viewMode]);
```

## Back View Elements (What Should Show)
Only these 8 elements in back view:
1. leftStick (paddle)
2. leftTrigger  
3. dPadUp (right trigger in UI)
4. dPadDown (paddle)
5. rightTrigger (shown as dPadUp tooltip)
6. buttonY
7. buttonA (paddle)
8. rightStick (paddle)

## Files Modified
- `src/components/ButtonMapping.jsx` - main file
- `public/ghost-controller-back-white.png` - back image (added)

## Reference Files for Next Session
- `COORDINATES_CURRENT.md` - all current coordinates
- `DEBUG_BACK_VIEW.md` - debugging steps
- This file - TODO list

## Once Back View Works
1. Enter Edit Mode
2. Position all 8 back view tooltips correctly
3. Position all 8 back view hotspots correctly
4. Adjust leader lines for back view
5. Copy positions to console
6. Update the defaults in ButtonMapping.jsx with real positions
7. Commit changes
8. Update SESSION_NOTES.md
