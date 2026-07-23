# Mouse Click Trigger Binary Toggle Coordinates

## Position Reference (Finalized)

### Left Trigger Binary Toggle
- **X Offset**: 4px
- **Y Offset**: -4px
- Position relative to arc left offset (-20px) and arc top offset (-200px)

### Right Trigger Binary Toggle
- **X Offset**: 272px
- **Y Offset**: -4px
- Position relative to right arc left offset (273px) and right arc top offset (-193px)

## Component Location
- File: `src/components/TriggerDeadzone.jsx`
- Lines: ~143-146 (binary toggle position constants)
- Component: `MouseClickIndicator` (`src/components/MouseClickIndicator.jsx`)

## Notes
- Binary toggle appears when "Switch to mouse click trigger" is enabled
- Replaces the arc/ticks visualization in mouse click mode
- Shows vertical ON/OFF bar with white thumb that moves when trigger is pressed
- OFF state: 20px height (thumb at top)
- ON state: 136px height (thumb moves down, bar turns blue)
