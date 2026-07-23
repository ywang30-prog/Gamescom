# Back View Blank Page - Debug Guide

## Issue
When clicking "BACK" toggle from "FRONT", the page shows completely blank.

## What We Changed Today

### 1. Separated Front/Back View Positions
All three position systems now have separate `front` and `back` objects:

```javascript
tooltipPositions = {
  front: { leftStick: {...}, leftBumper: {...}, ... },
  back: { leftStick: {...}, leftTrigger: {...}, ... }
}

leaderLinePositions = {
  front: { leftStick: [...], leftBumper: [...], ... },
  back: { leftStick: [...], leftTrigger: [...], ... }
}

hotspotPositions = {
  front: { 'Left Stick': {...}, 'Left Bumper': {...}, ... },
  back: { 'Left Stick': {...}, 'Left Trigger': {...}, ... }
}
```

### 2. Added Helper Variables
```javascript
const currentTooltipPositions = tooltipPositions?.[viewMode] || tooltipPositions?.front || {};
const currentLeaderLinePositions = leaderLinePositions?.[viewMode] || leaderLinePositions?.front || {};
const currentHotspotPositions = hotspotPositions?.[viewMode] || hotspotPositions?.front || {};
```

### 3. Fixed Tooltip Position References
Changed tooltip position references to use view-specific keys. For example:
```javascript
// Fixed: D Pad Up tooltip in back view should use rightTrigger position
position={viewMode === 'back' ? currentTooltipPositions.rightTrigger : currentTooltipPositions.dPadUp}
```

## Debugging Steps

### Step 1: Check Browser Console
Open browser DevTools (F12 or Cmd+Option+I) and check the Console tab for errors.

### Step 2: Check If Positions Are Loading
In the console, type:
```javascript
// Check if back positions exist
console.log('tooltipPositions:', tooltipPositions);
console.log('back positions:', tooltipPositions?.back);
```

### Step 3: Common Issues

#### Issue A: Hooks Error
If you see "Rendered more hooks than during the previous render" or similar:
- The safety check `if (!position) return null;` in HotspotTooltip might be causing issues
- This is because returning null conditionally inside a component after using hooks violates React rules

**FIX**: Move the safety check BEFORE any hooks:
```javascript
function HotspotTooltip({ label, value, position, ...props }) {
  if (!position || typeof position.left === 'undefined') {
    return null;  // This is BEFORE any useState calls - should be OK
  }
  // ... rest of component with hooks
}
```

#### Issue B: Undefined Position Properties
If tooltips try to render with undefined positions, the crash happens at:
```javascript
position.left  // crashes if position is undefined
```

**FIX**: Add optional chaining everywhere position is accessed:
```javascript
position?.left
position?.top
```

#### Issue C: LocalStorage Has Old Format
If localStorage still has the old format (flat object instead of front/back):

**FIX**: Clear localStorage:
```javascript
// In browser console:
localStorage.removeItem('buttonMappingTooltipPositions');
localStorage.removeItem('buttonMappingLeaderLinePositions');
localStorage.removeItem('hotspotPositions');
location.reload();
```

## Quick Fix to Test

Add error boundary to see what's breaking:

```javascript
// Add at top of ButtonMapping component's return:
try {
  return (
    <div className="bg-black flex flex-col h-screen w-full">
      {/* ... rest of JSX */}
    </div>
  );
} catch (error) {
  console.error('Render error:', error);
  return <div className="text-white p-8">Error: {error.message}</div>;
}
```

## Expected Back View Elements

In back view, only these should render:
- Controller back image: `/ghost-controller-back-white.png`
- 8 tooltips: leftStick, leftTrigger, dPadUp, dPadDown, rightTrigger, buttonY, buttonA, rightStick
- Corresponding hotspots and leader lines
- Front/Back toggle at bottom

## Files Modified
- `src/components/ButtonMapping.jsx` - Main file with all changes
- `public/ghost-controller-back-white.png` - Back view image (added)

## Next Session TODO
1. Debug the blank page issue using steps above
2. Once back view renders, position all back view elements correctly
3. Test switching between front/back maintains separate positions
4. Update SESSION_NOTES.md with final coordinates for both views
