import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';
import ProfileSelector from './ProfileSelector';

// Image assets
const imgBatteryIcon = "/figmaAssets/battery-icon.svg";

export default function Mapping() {
  const navigate = useNavigate();
  const currentProfile = localStorage.getItem('currentPreset') || 'desktop';

  const [leftDeadzone, setLeftDeadzone] = useState(() => {
    const saved = localStorage.getItem(`stickDeadzone_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 18;
  });
  const [curveAdjustment, setCurveAdjustment] = useState(() => {
    const saved = localStorage.getItem(`stickCurveAdjustment_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [activeStick, setActiveStick] = useState('left');
  const [sensitivity, setSensitivity] = useState(() => {
    const saved = localStorage.getItem(`stickSensitivity_${currentProfile}`);
    return saved || 'Linear';
  });
  const [sensitivityDropdownOpen, setSensitivityDropdownOpen] = useState(false);
  const [isSensitivityExpanded, setIsSensitivityExpanded] = useState(false);
  const sensitivityDropdownRef = useRef(null);

  // Right stick settings (independent from left)
  const [rightInnerDeadzone, setRightInnerDeadzone] = useState(() => {
    const saved = localStorage.getItem(`rightStickInnerDeadzone_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 18;
  });
  const [rightOuterDeadzone, setRightOuterDeadzone] = useState(() => {
    const saved = localStorage.getItem(`rightStickOuterDeadzone_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 5;
  });
  const [rightCurveAdjustment, setRightCurveAdjustment] = useState(() => {
    const saved = localStorage.getItem(`rightStickCurveAdjustment_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 0;
  });
  const [rightSensitivity, setRightSensitivity] = useState(() => {
    const saved = localStorage.getItem(`rightStickSensitivity_${currentProfile}`);
    return saved || 'Linear';
  });

  // Profile management state - synced with localStorage
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(() => {
    return localStorage.getItem('currentPreset') || 'desktop';
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTargetProfile, setImportTargetProfile] = useState(null);
  const [onboardProfileMapping, setOnboardProfileMapping] = useState(() => {
    const saved = localStorage.getItem('onboardProfileMapping');
    return saved ? JSON.parse(saved) : {
      p1: 'desktop',
      p2: 'desktop',
      p3: 'desktop'
    };
  });
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [savedProfileInfo, setSavedProfileInfo] = useState({ profileName: '', targetSlot: '' });

  // Track if settings have changed (for Save button)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    // Check for global unsaved changes flag
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  });
  // Track if THIS page specifically has changes (local)
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [savedSettings, setSavedSettings] = useState(null);
  const isInitialized = useRef(false);

  // Padding to keep curve within container bounds
  const padding = 10;

  // Profile management handlers
  const handlePresetClick = () => {
    setIsPresetModalOpen(true);
  };

  const handlePresetSave = (presetId) => {
    setCurrentPreset(presetId);
    localStorage.setItem('currentPreset', presetId);
    setIsPresetModalOpen(false);

    // Load saved settings for the new profile
    const savedDeadzone = localStorage.getItem(`stickDeadzone_${presetId}`);
    const savedDeadzone2 = localStorage.getItem(`stickDeadzone2_${presetId}`);
    const savedCurve = localStorage.getItem(`stickCurveAdjustment_${presetId}`);
    const savedSens = localStorage.getItem(`stickSensitivity_${presetId}`);
    const savedPoints = localStorage.getItem(`stickControlPoints_${presetId}`);

    const loadedSensitivity = savedSens || 'Linear';
    const loadedCurveAdjustment = savedCurve !== null ? JSON.parse(savedCurve) : 0;
    const defaultControlPoints = getPresetControlPoints(loadedSensitivity, loadedCurveAdjustment);

    setLeftDeadzone(savedDeadzone !== null ? JSON.parse(savedDeadzone) : 18);
    setRightDeadzone(savedDeadzone2 !== null ? JSON.parse(savedDeadzone2) : 5);
    setCurveAdjustment(loadedCurveAdjustment);
    setSensitivity(loadedSensitivity);
    setControlPoints(savedPoints ? JSON.parse(savedPoints) : defaultControlPoints);
    setActiveStick('left');

    // Set saved settings baseline to the newly loaded data
    setTimeout(() => {
      setSavedSettings({
        leftDeadzone: savedDeadzone !== null ? JSON.parse(savedDeadzone) : 18,
        rightDeadzone: savedDeadzone2 !== null ? JSON.parse(savedDeadzone2) : 5,
        curveAdjustment: loadedCurveAdjustment,
        sensitivity: loadedSensitivity,
        controlPoints: savedPoints ? JSON.parse(savedPoints) : defaultControlPoints
      });
    }, 0);

    setHasUnsavedChanges(false);
    localStorage.setItem('hasUnsavedChanges', 'false');
  };

  const handleOpenImportModal = (targetProfile) => {
    setImportTargetProfile(targetProfile);
    setIsPresetModalOpen(false);
    setIsImportModalOpen(true);
  };

  const handleImportComplete = (targetProfile, sourceProfile) => {
    const newMapping = {
      ...onboardProfileMapping,
      [targetProfile]: sourceProfile
    };
    setOnboardProfileMapping(newMapping);
    localStorage.setItem('onboardProfileMapping', JSON.stringify(newMapping));
    setIsImportModalOpen(false);

    // Show save notification
    const profileNames = {
      desktop: 'Default',
      fps: 'First Person Shooter',
      figma: 'Figma',
      marvelRivals: 'Marvel Rivals',
    };
    const sourceName = profileNames[sourceProfile] || sourceProfile;

    setSavedProfileInfo({
      profileName: sourceName,
      targetSlot: targetProfile
    });
    setShowSaveNotification(true);
  };

  const isOnboardPreset = (preset) => {
    return ['p1', 'p2', 'p3'].includes(preset);
  };

  const handleSaveSettings = () => {
    if (!hasUnsavedChanges) return;

    // Update saved settings (commit current state)
    setSavedSettings({
      leftDeadzone,
      rightDeadzone,
      curveAdjustment,
      sensitivity,
      controlPoints: [...controlPoints]
    });

    setHasLocalChanges(false);
    setHasUnsavedChanges(false);
    localStorage.setItem('hasUnsavedChanges', 'false');
    // Dispatch custom event so other pages can update
    window.dispatchEvent(new CustomEvent('unsavedChangesUpdated', { detail: { hasChanges: false } }));

    // Show notification - use the current preset name
    const slotNames = {
      p1: 'P1: Desktop: Default',
      p2: 'P2 Ghost',
      p3: 'P3 Ghost',
    };

    setSavedProfileInfo({
      profileName: slotNames[currentPreset] || currentPreset,
      targetSlot: 'saved' // Special flag to indicate this is a save, not import
    });
    setShowSaveNotification(true);
  };

  // Helper function to get base control points for each sensitivity type at different intensities
  const getPresetControlPoints = (sensitivityType, adjustmentPercent = 0) => {
    const t = adjustmentPercent / 100; // Normalize to 0-1

    // Define baseline (0%) and maximum (100%) control points for each type
    const presets = {
      'Linear': {
        baseline: [
          { x: padding, y: 190 },
          { x: 93, y: 155 },
          { x: 186, y: 120 },
          { x: 279, y: 85 },
          { x: 372 - padding, y: padding }
        ],
        maximum: [
          { x: padding, y: 190 },
          { x: 93, y: 130 },
          { x: 186, y: 70 },
          { x: 279, y: 20 },
          { x: 372 - padding, y: padding }
        ]
      },
      'Delayed': {
        baseline: [
          { x: padding, y: 190 },
          { x: 93, y: 180 },
          { x: 186, y: 160 },
          { x: 279, y: 120 },
          { x: 372 - padding, y: padding }
        ],
        maximum: [
          { x: padding, y: 190 },
          { x: 93, y: 188 },
          { x: 186, y: 185 },
          { x: 279, y: 80 },
          { x: 372 - padding, y: padding }
        ]
      },
      'Aggressive': {
        baseline: [
          { x: padding, y: 190 },
          { x: 93, y: 82 },
          { x: 186, y: 46 },
          { x: 279, y: 28 },
          { x: 372 - padding, y: padding }
        ],
        maximum: [
          { x: padding, y: 190 },
          { x: 93, y: 60 },
          { x: 186, y: 30 },
          { x: 279, y: 20 },
          { x: 372 - padding, y: padding }
        ]
      },
      'Smooth': {
        baseline: [
          { x: padding, y: 190 },
          { x: 93, y: 165 },
          { x: 186, y: 120 },
          { x: 279, y: 75 },
          { x: 372 - padding, y: padding }
        ],
        maximum: [
          { x: padding, y: 190 },
          { x: 93, y: 175 },
          { x: 186, y: 95 },
          { x: 279, y: 20 },
          { x: 372 - padding, y: padding }
        ]
      }
    };

    const preset = presets[sensitivityType] || presets['Linear'];

    // Interpolate between baseline and maximum based on adjustment value
    return preset.baseline.map((point, i) => ({
      x: point.x,
      y: point.y + (preset.maximum[i].y - point.y) * t
    }));
  };

  // Curve control points (5 points distributed across the curve)
  const [controlPoints, setControlPoints] = useState(() => {
    const saved = localStorage.getItem(`stickControlPoints_${currentProfile}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return getPresetControlPoints('Linear', 0);
  });

  const [rightControlPoints, setRightControlPoints] = useState(() => {
    const saved = localStorage.getItem(`rightStickControlPoints_${currentProfile}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return getPresetControlPoints('Linear', 0);
  });

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const previousHasChangedRef = useRef(false);
  const [isDraggingDeadzone, setIsDraggingDeadzone] = useState(false);
  const [isDraggingCurve, setIsDraggingCurve] = useState(false);
  const [isHoveringDeadzone, setIsHoveringDeadzone] = useState(false);
  const [isHoveringCurve, setIsHoveringCurve] = useState(false);

  // Second deadzone slider state (outer deadzone)
  const [rightDeadzone, setRightDeadzone] = useState(() => {
    const saved = localStorage.getItem(`stickDeadzone2_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 5;
  });
  const [isDraggingDeadzone2, setIsDraggingDeadzone2] = useState(false);
  const [isHoveringDeadzone2, setIsHoveringDeadzone2] = useState(false);

  // Gamepad state
  const [leftStickX, setLeftStickX] = useState(0);
  const [leftStickY, setLeftStickY] = useState(0);
  const [rightStickX, setRightStickX] = useState(0);
  const [rightStickY, setRightStickY] = useState(0);
  const gamepadRafRef = useRef(0);

  // Apply both inner and outer deadzones to stick input
  const applyDeadzones = (x, y, innerDeadzonePercent, outerDeadzonePercent) => {
    // Calculate magnitude
    const magnitude = Math.sqrt(x * x + y * y);

    // If stick is at neutral position, return zero immediately
    if (magnitude === 0) {
      return { x: 0, y: 0, magnitude: 0 };
    }

    // Convert deadzones from percentage to 0-1 range
    const innerDeadzone = innerDeadzonePercent / 100;
    const outerDeadzone = outerDeadzonePercent / 100;

    // Calculate the outer limit (1.0 - outer deadzone)
    const outerLimit = 1 - outerDeadzone;

    // If within inner deadzone, return zero
    if (magnitude < innerDeadzone) {
      return { x: 0, y: 0, magnitude: 0 };
    }

    // Clamp magnitude to outer limit
    const clampedMagnitude = Math.min(magnitude, outerLimit);

    // Scale the input so that inner deadzone edge maps to 0 and outer limit maps to 1.0
    const activeRange = outerLimit - innerDeadzone;
    const scaledMagnitude = activeRange > 0 ? (clampedMagnitude - innerDeadzone) / activeRange : 0;

    // Preserve the direction, scale the magnitude to the scaled value
    // Direction unit vector: (x/magnitude, y/magnitude)
    // Apply scaled magnitude: direction * scaledMagnitude
    const scale = scaledMagnitude / magnitude;

    return {
      x: x * scale,
      y: y * scale,
      magnitude: scaledMagnitude
    };
  };

  // Get active stick settings based on selection
  const activeInnerDeadzone = activeStick === 'left' ? leftDeadzone : rightInnerDeadzone;
  const activeOuterDeadzone = activeStick === 'left' ? rightDeadzone : rightOuterDeadzone;
  const activeSensitivity = activeStick === 'left' ? sensitivity : rightSensitivity;
  const activeCurveAdjustment = activeStick === 'left' ? curveAdjustment : rightCurveAdjustment;
  const activeControlPoints = activeStick === 'left' ? controlPoints : rightControlPoints;
  const activeStickX = activeStick === 'left' ? leftStickX : rightStickX;
  const activeStickY = activeStick === 'left' ? leftStickY : rightStickY;

  // Apply deadzones to active stick
  const activeStickWithDeadzone = applyDeadzones(activeStickX, activeStickY, activeInnerDeadzone, activeOuterDeadzone);

  // Apply curve transformation to stick magnitude
  const applyCurveToMagnitude = (magnitude) => {
    if (magnitude === 0) return 0;

    // Map magnitude (0-1) to curve x-axis (0-372)
    const curveX = magnitude * 372;

    // Sample the curve at this x position to get y
    // Use simple linear interpolation between control points
    const points = activeControlPoints;
    let curveY = 190; // Default to bottom

    // Find which segment the x falls into
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      if (curveX >= p1.x && curveX <= p2.x) {
        // Linear interpolation between p1 and p2
        const t = (curveX - p1.x) / (p2.x - p1.x);
        curveY = p1.y + (p2.y - p1.y) * t;
        break;
      }
    }

    // Handle extrapolation for edges
    if (curveX < points[0].x) {
      const slope = (points[1].y - points[0].y) / (points[1].x - points[0].x);
      curveY = points[0].y + slope * (curveX - points[0].x);
    } else if (curveX > points[points.length - 1].x) {
      const lastIdx = points.length - 1;
      const slope = (points[lastIdx].y - points[lastIdx - 1].y) / (points[lastIdx].x - points[lastIdx - 1].x);
      curveY = points[lastIdx].y + slope * (curveX - points[lastIdx].x);
    }

    // Convert curve y to output magnitude (invert y-axis)
    // y=190 is 0%, y=padding is 100%
    const outputMagnitude = (190 - curveY) / (190 - padding);

    // Clamp to 0-1
    return Math.max(0, Math.min(1, outputMagnitude));
  };

  // Calculate curve-adjusted stick position
  const applyCurveToStick = (x, y) => {
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude === 0) return { x: 0, y: 0 };

    const adjustedMagnitude = applyCurveToMagnitude(magnitude);
    const angle = Math.atan2(y, x);

    return {
      x: adjustedMagnitude * Math.cos(angle),
      y: adjustedMagnitude * Math.sin(angle)
    };
  };

  const activeStickCurveAdjusted = applyCurveToStick(activeStickWithDeadzone.x, activeStickWithDeadzone.y);

  // Calculate clamped position for white dot using deadzone-adjusted values
  const getClampedDotPositionWithDeadzone = () => {
    const centerX = 64.9883;
    const centerY = 64.9883;
    const maxRadius = 61;

    // Calculate active visual range (between inner and outer deadzones)
    const innerDeadzoneRadius = maxRadius * (activeInnerDeadzone / 100);
    const outerLimitRadius = maxRadius * (1 - activeOuterDeadzone / 100);
    const activeRange = outerLimitRadius - innerDeadzoneRadius;

    // activeStickWithDeadzone.magnitude is 0-1 after deadzone scaling
    // Map it to the active visual range
    const visualRadius = innerDeadzoneRadius + (activeStickWithDeadzone.magnitude * activeRange);

    const offsetX = activeStickWithDeadzone.x * visualRadius / activeStickWithDeadzone.magnitude;
    const offsetY = activeStickWithDeadzone.y * visualRadius / activeStickWithDeadzone.magnitude;

    // Handle zero magnitude case
    if (activeStickWithDeadzone.magnitude === 0) {
      return { x: centerX, y: centerY };
    }

    return {
      x: centerX + offsetX,
      y: centerY + offsetY
    };
  };

  // Calculate clamped position for blue dot (curve-adjusted)
  const getClampedDotPositionCurveAdjusted = () => {
    const centerX = 64.9883;
    const centerY = 64.9883;
    const maxRadius = 61;

    // Calculate active visual range (between inner and outer deadzones)
    const innerDeadzoneRadius = maxRadius * (activeInnerDeadzone / 100);
    const outerLimitRadius = maxRadius * (1 - activeOuterDeadzone / 100);
    const activeRange = outerLimitRadius - innerDeadzoneRadius;

    // Calculate magnitude of curve-adjusted stick
    const magnitude = Math.sqrt(activeStickCurveAdjusted.x * activeStickCurveAdjusted.x + activeStickCurveAdjusted.y * activeStickCurveAdjusted.y);

    if (magnitude === 0) {
      return { x: centerX, y: centerY };
    }

    // Map the curve-adjusted magnitude (0-1) to the active visual range
    const visualRadius = innerDeadzoneRadius + (magnitude * activeRange);

    const offsetX = activeStickCurveAdjusted.x * visualRadius / magnitude;
    const offsetY = activeStickCurveAdjusted.y * visualRadius / magnitude;

    return {
      x: centerX + offsetX,
      y: centerY + offsetY
    };
  };

  const dotPosition = getClampedDotPositionWithDeadzone();
  const blueDotPosition = getClampedDotPositionCurveAdjusted();

  // Calculate stick magnitude for curve tracer (0 to 1) - use deadzone-adjusted value
  const stickMagnitude = activeStickWithDeadzone.magnitude;

  // Update control points when curveAdjustment changes
  useEffect(() => {
    const intensity = curveAdjustment / 100;
    const maxX = 372 - padding * 2;
    const maxY = 200 - padding * 2;

    const newPoints = [
      { x: padding, y: maxY + padding },
      { x: padding + maxX * 0.25, y: padding + maxY * (1 - 0.25 * (1 - intensity * 0.5)) },
      { x: padding + maxX * 0.5, y: padding + maxY * (1 - 0.5 * (1 - intensity * 0.3)) },
      { x: padding + maxX * 0.75, y: padding + maxY * (1 - 0.75 * (1 + intensity * 0.2)) },
      { x: maxX + padding, y: padding + maxY * (1 - 1 * (1 + intensity * 0.3)) }
    ];

    // Clamp all Y values to ensure they stay within bounds
    const clampedPoints = newPoints.map(point => ({
      x: point.x,
      y: Math.max(padding, Math.min(200 - padding, point.y))
    }));

    setControlPoints(clampedPoints);
  }, [curveAdjustment, padding]);

  // Generate smooth curve that passes exactly through all control points
  const getCurvePath = () => {
    if (controlPoints.length < 2) return '';

    // Use drag position if actively dragging
    const points = controlPoints.map((point, i) =>
      (draggingIndex === i && dragPosition) ? dragPosition : point
    );

    // Calculate slope at start to extend line to left edge
    const startSlope = (points[1].y - points[0].y) / (points[1].x - points[0].x);
    const startY = points[0].y - startSlope * points[0].x; // y at x=0

    // Calculate slope at end to extend line to right edge
    const endPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];
    const endSlope = (endPoint.y - secondLastPoint.y) / (endPoint.x - secondLastPoint.x);
    const endY = endPoint.y + endSlope * (372 - endPoint.x); // y at x=372

    // Start from left edge (x=0)
    let path = `M 0 ${startY}`;

    // Draw to first control point
    path += ` L ${points[0].x} ${points[0].y}`;

    // Draw through all middle points
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    // Extend to right edge (x=372)
    path += ` L 372 ${endY}`;

    return path;
  };

  // Get the visual position for a control point (uses drag position if dragging)
  const getPointPosition = (index) => {
    if (draggingIndex === index && dragPosition) {
      return dragPosition;
    }
    return controlPoints[index];
  };

  // Mouse handlers for dragging control points
  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIndex(index);
    isDraggingRef.current = true;
    setDragPosition(controlPoints[index]);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || draggingIndex === null || !svgRef.current) return;

    e.preventDefault();

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    // Convert mouse position to SVG coordinates
    const x = ((e.clientX - rect.left) / rect.width) * 372;
    const y = ((e.clientY - rect.top) / rect.height) * 200;

    // Constrain within bounds with padding
    const clampedX = Math.max(padding, Math.min(372 - padding, x));
    const clampedY = Math.max(padding, Math.min(200 - padding, y));

    let newPosition;
    // Don't allow dragging start and end points horizontally, only vertically
    if (draggingIndex === 0) {
      newPosition = { x: padding, y: clampedY };
    } else if (draggingIndex === controlPoints.length - 1) {
      newPosition = { x: 372 - padding, y: clampedY };
    } else {
      newPosition = { x: clampedX, y: clampedY };
    }

    // Update drag position immediately for visual feedback
    setDragPosition(newPosition);

    // Update control points state
    setControlPoints(prev => {
      const newPoints = [...prev];
      newPoints[draggingIndex] = newPosition;
      return newPoints;
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setDraggingIndex(null);
    setDragPosition(null);
  };

  useEffect(() => {
    if (draggingIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingIndex, controlPoints.length]);

  // Handle deadzone slider drag end (in case mouse is released outside slider)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingDeadzone) {
        setIsDraggingDeadzone(false);
      }
    };

    if (isDraggingDeadzone) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalMouseUp);
      };
    }
  }, [isDraggingDeadzone]);

  // Handle curve slider drag end (in case mouse is released outside slider)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingCurve) {
        setIsDraggingCurve(false);
      }
    };

    if (isDraggingCurve) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp);
        window.removeEventListener('touchend', handleGlobalMouseUp);
      };
    }
  }, [isDraggingCurve]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sensitivityDropdownRef.current && !sensitivityDropdownRef.current.contains(e.target)) {
        setSensitivityDropdownOpen(false);
      }
    };

    if (sensitivityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [sensitivityDropdownOpen]);

  // Initialize saved settings once after component mounts
  useEffect(() => {
    if (!isInitialized.current) {
      // Initialize on next tick to ensure controlPoints are set
      // Clear any saved activeStick values to ensure 'left' is always the default
      localStorage.removeItem(`activeStick_${currentPreset}`);

      const timer = setTimeout(() => {
        const globalFlag = localStorage.getItem('hasUnsavedChanges') === 'true';

        // Always initialize with current state
        setSavedSettings({
          leftDeadzone,
          rightDeadzone,
          curveAdjustment,
          sensitivity,
          controlPoints: [...controlPoints]
        });

        // If global flag is false, a save happened elsewhere - accept current state as saved
        // Otherwise, preserve the global flag state
        setHasUnsavedChanges(globalFlag);
        setHasLocalChanges(false);
        isInitialized.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  // Track changes to settings - runs whenever any setting changes
  useEffect(() => {
    // Skip if not initialized yet
    if (!isInitialized.current || savedSettings === null) return;

    const hasChanged =
      leftDeadzone !== savedSettings.leftDeadzone ||
      rightDeadzone !== savedSettings.rightDeadzone ||
      curveAdjustment !== savedSettings.curveAdjustment ||
      sensitivity !== savedSettings.sensitivity ||
      JSON.stringify(controlPoints) !== JSON.stringify(savedSettings.controlPoints);

    // Only update and dispatch if hasChanged actually changed
    if (hasChanged !== previousHasChangedRef.current) {
      previousHasChangedRef.current = hasChanged;

      // Track local changes for this page
      setHasLocalChanges(hasChanged);
      setHasUnsavedChanges(hasChanged);
      // Sync to localStorage so other pages know about unsaved changes
      localStorage.setItem('hasUnsavedChanges', hasChanged.toString());
      // Dispatch custom event so other pages can listen
      window.dispatchEvent(new CustomEvent('unsavedChangesUpdated', { detail: { hasChanges: hasChanged } }));
    }
  }, [leftDeadzone, rightDeadzone, curveAdjustment, sensitivity, controlPoints, savedSettings]);

  // Persist stick settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`stickDeadzone_${currentPreset}`, JSON.stringify(leftDeadzone));
  }, [leftDeadzone, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`stickDeadzone2_${currentPreset}`, JSON.stringify(rightDeadzone));
  }, [rightDeadzone, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`stickCurveAdjustment_${currentPreset}`, JSON.stringify(curveAdjustment));
  }, [curveAdjustment, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`stickSensitivity_${currentPreset}`, sensitivity);
  }, [sensitivity, currentPreset]);

  // Persist right stick settings to localStorage
  useEffect(() => {
    localStorage.setItem(`rightStickInnerDeadzone_${currentPreset}`, JSON.stringify(rightInnerDeadzone));
  }, [rightInnerDeadzone, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightStickOuterDeadzone_${currentPreset}`, JSON.stringify(rightOuterDeadzone));
  }, [rightOuterDeadzone, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightStickCurveAdjustment_${currentPreset}`, JSON.stringify(rightCurveAdjustment));
  }, [rightCurveAdjustment, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightStickSensitivity_${currentPreset}`, rightSensitivity);
  }, [rightSensitivity, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightStickControlPoints_${currentPreset}`, JSON.stringify(rightControlPoints));
  }, [rightControlPoints, currentPreset]);

  // Update control points when sensitivity changes (after initialization)
  useEffect(() => {
    if (isInitialized.current) {
      const newPoints = getPresetControlPoints(sensitivity, curveAdjustment);
      setControlPoints(newPoints);
      setHasUnsavedChanges(true);
      setHasLocalChanges(true);
      localStorage.setItem('hasUnsavedChanges', 'true');
    }
  }, [sensitivity]);

  // Update control points when curve adjustment changes (after initialization)
  useEffect(() => {
    if (isInitialized.current) {
      const newPoints = getPresetControlPoints(sensitivity, curveAdjustment);
      setControlPoints(newPoints);
      setHasUnsavedChanges(true);
      setHasLocalChanges(true);
      localStorage.setItem('hasUnsavedChanges', 'true');
    }
  }, [curveAdjustment]);

  useEffect(() => {
    localStorage.setItem(`stickControlPoints_${currentPreset}`, JSON.stringify(controlPoints));
  }, [controlPoints, currentPreset]);

  // Update right control points when right sensitivity changes
  useEffect(() => {
    if (isInitialized.current) {
      const newPoints = getPresetControlPoints(rightSensitivity, rightCurveAdjustment);
      setRightControlPoints(newPoints);
      setHasUnsavedChanges(true);
      setHasLocalChanges(true);
      localStorage.setItem('hasUnsavedChanges', 'true');
    }
  }, [rightSensitivity]);

  // Update right control points when right curve adjustment changes
  useEffect(() => {
    if (isInitialized.current) {
      const newPoints = getPresetControlPoints(rightSensitivity, rightCurveAdjustment);
      setRightControlPoints(newPoints);
      setHasUnsavedChanges(true);
      setHasLocalChanges(true);
      localStorage.setItem('hasUnsavedChanges', 'true');
    }
  }, [rightCurveAdjustment]);

  // Global sync: listen for profile changes from other pages/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentPreset' && e.newValue) {
        setCurrentPreset(e.newValue);
        // Capture current settings as baseline when profile changes from another page
        setSavedSettings({
          leftDeadzone,
          rightDeadzone,
          curveAdjustment,
          sensitivity,
          controlPoints: [...controlPoints]
        });
        setHasUnsavedChanges(false);
      } else if (e.key === 'onboardProfileMapping' && e.newValue) {
        setOnboardProfileMapping(JSON.parse(e.newValue));
      } else if (e.key === 'hasUnsavedChanges') {
        // Update unsaved changes state when it changes in other tabs
        setHasUnsavedChanges(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [leftDeadzone, curveAdjustment, sensitivity, controlPoints]);

  // Ref to hold current state values for event listener
  const currentStateRef = useRef({ leftDeadzone, rightDeadzone, curveAdjustment, sensitivity, controlPoints });
  useEffect(() => {
    currentStateRef.current = { leftDeadzone, rightDeadzone, curveAdjustment, sensitivity, controlPoints };
  }, [leftDeadzone, rightDeadzone, curveAdjustment, sensitivity, controlPoints]);

  // Listen for updates from other pages
  useEffect(() => {
    const handleUnsavedChangesUpdate = (event) => {
      setHasUnsavedChanges(event.detail.hasChanges);
      // If another page saved, update our saved settings to current state
      if (!event.detail.hasChanges) {
        const current = currentStateRef.current;
        setSavedSettings({
          leftDeadzone: current.leftDeadzone,
          rightDeadzone: current.rightDeadzone,
          curveAdjustment: current.curveAdjustment,
          sensitivity: current.sensitivity,
          controlPoints: [...current.controlPoints]
        });
        setHasLocalChanges(false);
      }
    };

    window.addEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
    return () => window.removeEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
  }, []); // No dependencies - listener registered once

  // Gamepad polling effect
  useEffect(() => {
    const pollGamepad = () => {
      try {
        const gamepads = navigator.getGamepads();
        let foundAny = false;

        for (let i = 0; i < gamepads.length; i++) {
          const gp = gamepads[i];
          if (gp && gp.connected) {
            foundAny = true;

            // Read analog stick values
            // Left stick: axes[0] = X, axes[1] = Y
            // Right stick: axes[2] = X, axes[3] = Y
            const leftX = gp.axes[0] || 0;
            const leftY = gp.axes[1] || 0;
            const rightX = gp.axes[2] || 0;
            const rightY = gp.axes[3] || 0;

            // Filter out noise (deadzone at 0.03)
            setLeftStickX(Math.abs(leftX) < 0.03 ? 0 : leftX);
            setLeftStickY(Math.abs(leftY) < 0.03 ? 0 : leftY);
            setRightStickX(Math.abs(rightX) < 0.03 ? 0 : rightX);
            setRightStickY(Math.abs(rightY) < 0.03 ? 0 : rightY);

            break;
          }
        }

        if (!foundAny) {
          setLeftStickX(0);
          setLeftStickY(0);
          setRightStickX(0);
          setRightStickY(0);
        }
      } catch (err) {
        console.error('Gamepad error:', err);
      }
      gamepadRafRef.current = requestAnimationFrame(pollGamepad);
    };

    gamepadRafRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      cancelAnimationFrame(gamepadRafRef.current);
    };
  }, []);

  return (
    <div className="bg-black w-full min-w-[1440px] h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between gap-4 px-8 py-2 border-b border-solid border-[#333]">
        <div className="inline-flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-[#242424] w-10 h-10 flex items-center justify-center hover:bg-[#333] transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#a7a7a8]" />
          </button>

          <div className="flex gap-1 items-center h-10">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col gap-[19px] items-center pt-[18px] px-4 cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary-default rounded"
            >
              <span className="font-logitech text-[14px] text-[#a7a7a8] tracking-[-0.42px] leading-[1.3]">
                GHOST
              </span>
              <div className="h-px rounded-[1px] shrink-0 w-10" />
            </button>
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4 w-[5px]">
              <ChevronRight className="w-4 h-4 text-[#a7a7a8]" />
              <div className="h-px rounded-[1px] shrink-0 w-10" />
            </div>
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4">
              <span className="font-logitech font-bold leading-[1.3] text-[#00b6fa] text-sm text-center tracking-[-0.42px] whitespace-nowrap">
                BUTTON REMAPPING
              </span>
              <div className="bg-[#00b6fa] h-px rounded-[1px] shrink-0 w-6" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex px-8 pb-8 gap-4 overflow-hidden pt-4">
        {/* Left Sidebar */}
        <div className="w-[420px] flex flex-col gap-2 shrink-0">
          {/* Preset Selector */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl w-full">
            <ProfileSelector
              currentPreset={currentPreset}
              hasUnsavedChanges={hasUnsavedChanges}
              onPresetClick={handlePresetClick}
              onSaveSettings={handleSaveSettings}
            />
          </div>

          {/* Controls Panel */}
          <div className="bg-[#1a1a1a] rounded-xl flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="font-logitech font-bold text-[#e6e6e6] text-[20px] tracking-[-0.42px] leading-[1.3]">
                Sticks
              </h2>
              <p className="font-logitech text-[13px] text-[#8e8e8f] mt-2 leading-[1.3]">
                Adjust stick deadzone and curve sensitivity
              </p>
            </div>

            {/* Stick Selector Tab */}
            <div className="border border-[#2e2e2e] flex gap-1 items-center p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveStick('left')}
                className={`flex-1 h-8 flex items-center justify-center px-4 rounded transition-colors ${
                  activeStick === 'left'
                    ? 'bg-[#042f44] text-[#00b6fa] font-bold'
                    : 'text-[#a7a7a8] hover:bg-[#2e2e2e]'
                }`}
              >
                <span className="font-logitech text-[14px] tracking-[-0.42px] leading-[1.3]">
                  Left
                </span>
              </button>
              <button
                onClick={() => setActiveStick('right')}
                className={`flex-1 h-8 flex items-center justify-center px-4 rounded transition-colors ${
                  activeStick === 'right'
                    ? 'bg-[#042f44] text-[#00b6fa] font-bold'
                    : 'text-[#a7a7a8] hover:bg-[#2e2e2e]'
                }`}
              >
                <span className="font-logitech text-[14px] tracking-[-0.42px] leading-[1.3]">
                  Right
                </span>
              </button>
            </div>

            {/* Inner Deadzone */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] text-white font-bold tracking-[-0.42px] font-logitech">
                  Inner Deadzone
                </span>
              </div>

              <div className="flex items-end gap-4 mb-2">
                <div className="flex-1">
                  <div className="relative h-[22px] mb-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeStick === 'left' ? leftDeadzone : rightInnerDeadzone}
                      onChange={(e) => activeStick === 'left' ? setLeftDeadzone(Number(e.target.value)) : setRightInnerDeadzone(Number(e.target.value))}
                      onMouseDown={() => setIsDraggingDeadzone(true)}
                      onMouseUp={() => setIsDraggingDeadzone(false)}
                      onTouchStart={() => setIsDraggingDeadzone(true)}
                      onTouchEnd={() => setIsDraggingDeadzone(false)}
                      onMouseEnter={() => setIsHoveringDeadzone(true)}
                      onMouseLeave={() => setIsHoveringDeadzone(false)}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                    />
                    {/* Slider track */}
                    <div className="absolute inset-y-[9px] left-0 right-0 h-[4px] bg-[#2e2e2e] rounded-full pointer-events-none" />
                    {/* Active track */}
                    <div
                      className="absolute inset-y-[9px] left-0 h-[4px] bg-[#00b6fa] rounded-full pointer-events-none"
                      style={{ width: `${activeStick === 'left' ? leftDeadzone : rightInnerDeadzone}%` }}
                    />
                    {/* Slider thumb */}
                    <div
                      className={`slider-thumb-container absolute top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none ${isHoveringDeadzone ? 'hovering' : ''} ${isDraggingDeadzone ? 'dragging' : ''}`}
                      style={{ left: `calc(${activeStick === 'left' ? leftDeadzone : rightInnerDeadzone}% - 16px)` }}
                    >
                      {/* Glow effect */}
                      <div
                        className="slider-glow absolute inset-0 w-8 h-8 bg-[#00b6fa] rounded-full pointer-events-none"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      />
                      {/* Main thumb */}
                      <div className="absolute inset-[8px] w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex justify-between font-logitech text-[12px] text-[#a7a7a8]">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="bg-[#2e2e2e] rounded-lg h-10 w-[74px] flex items-center justify-center px-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeStick === 'left' ? leftDeadzone : rightInnerDeadzone}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      if (activeStick === 'left') {
                        setLeftDeadzone(value);
                      } else {
                        setRightInnerDeadzone(value);
                      }
                    }}
                    className={`bg-transparent font-logitech text-[14px] tracking-[-0.42px] w-full text-center outline-none transition-colors ${isDraggingDeadzone ? 'text-[#ececec]' : 'text-[#a7a7a8]'}`}
                  />
                  <span className={`font-logitech text-[14px] transition-colors ${isDraggingDeadzone ? 'text-[#ececec]' : 'text-[#a7a7a8]'}`}>%</span>
                </div>
              </div>
            </div>

            {/* Outer Deadzone */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] text-white font-bold tracking-[-0.42px] font-logitech">
                  Outer Deadzone
                </span>
              </div>

              <div className="flex items-end gap-4 mb-2">
                <div className="flex-1">
                  <div className="relative h-[22px] mb-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeOuterDeadzone}
                      onChange={(e) => activeStick === 'left' ? setRightDeadzone(Number(e.target.value)) : setRightOuterDeadzone(Number(e.target.value))}
                      onMouseDown={() => setIsDraggingDeadzone2(true)}
                      onMouseUp={() => setIsDraggingDeadzone2(false)}
                      onTouchStart={() => setIsDraggingDeadzone2(true)}
                      onTouchEnd={() => setIsDraggingDeadzone2(false)}
                      onMouseEnter={() => setIsHoveringDeadzone2(true)}
                      onMouseLeave={() => setIsHoveringDeadzone2(false)}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                    />
                    {/* Slider track */}
                    <div className="absolute inset-y-[9px] left-0 right-0 h-[4px] bg-[#2e2e2e] rounded-full pointer-events-none" />
                    {/* Active track */}
                    <div
                      className="absolute inset-y-[9px] left-0 h-[4px] bg-[#00b6fa] rounded-full pointer-events-none"
                      style={{ width: `${activeOuterDeadzone}%` }}
                    />
                    {/* Slider thumb */}
                    <div
                      className={`slider-thumb-container absolute top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none ${isHoveringDeadzone2 ? 'hovering' : ''} ${isDraggingDeadzone2 ? 'dragging' : ''}`}
                      style={{ left: `calc(${activeOuterDeadzone}% - 16px)` }}
                    >
                      {/* Glow effect */}
                      <div
                        className="slider-glow absolute inset-0 w-8 h-8 bg-[#00b6fa] rounded-full pointer-events-none"
                        style={{
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      />
                      {/* Main thumb */}
                      <div className="absolute inset-[8px] w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex justify-between font-logitech text-[12px] text-[#a7a7a8]">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
                <div className="bg-[#2e2e2e] rounded-lg h-10 w-[74px] flex items-center justify-center px-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeOuterDeadzone}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      if (activeStick === 'left') {
                        setRightDeadzone(value);
                      } else {
                        setRightOuterDeadzone(value);
                      }
                    }}
                    className={`bg-transparent font-logitech text-[14px] tracking-[-0.42px] w-full text-center outline-none transition-colors ${isDraggingDeadzone2 ? 'text-[#ececec]' : 'text-[#a7a7a8]'}`}
                  />
                  <span className={`font-logitech text-[14px] transition-colors ${isDraggingDeadzone2 ? 'text-[#ececec]' : 'text-[#a7a7a8]'}`}>%</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-stroke-neutral-disabled w-full mb-6" />

            {/* Sensitivity Accordion */}
            <div className="mb-6">
              <button
                onClick={() => setIsSensitivityExpanded(!isSensitivityExpanded)}
                className="flex items-center justify-between mb-[15px] w-full"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-white font-bold font-logitech tracking-[-0.42px] leading-[1.3]">Sensitivity</span>
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-[8.33%]">
                      <img src="/info-icon.svg" alt="" className="absolute block inset-0 w-full h-full" />
                    </div>
                  </div>
                </div>
                <div className={`relative w-6 h-6 transition-transform duration-200 ${isSensitivityExpanded ? 'rotate-0' : 'rotate-180'}`}>
                  <div className="absolute inset-[37.5%_29.17%]">
                    <img src="/figmaAssets/chevron-up-small-correct.svg" alt="" className="absolute block max-w-none w-full h-full" />
                  </div>
                </div>
              </button>

              {isSensitivityExpanded && (
              <>
              <div className="relative" ref={sensitivityDropdownRef}>
              {/* Collapsed Dropdown Button */}
              <div
                className="bg-[#242424] h-[72px] p-2 flex items-center justify-between cursor-pointer rounded-lg relative overflow-hidden group"
                onClick={() => setSensitivityDropdownOpen(!sensitivityDropdownOpen)}
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex gap-4 h-14 items-center relative z-10">
                  {/* Curve Icon */}
                  <div className="bg-[#1a1a1a] shrink-0 flex items-center justify-center rounded overflow-hidden px-2 py-[7px]" style={{ width: '64px', height: '56px' }}>
                    <div className="transform scale-y-[-1] rotate-180" style={{ width: '48px', height: '20px' }}>
                      <img
                        src={`/figmaAssets/curve-${activeSensitivity.toLowerCase()}.svg`}
                        alt={activeSensitivity}
                        className="w-full h-full block object-contain"
                      />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-logitech font-bold text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                      {activeSensitivity}
                    </p>
                    <p className="font-logitech text-[12px] text-[#a7a7a8] leading-[1.3]">
                      {activeSensitivity === 'Linear' && 'Predictable, no acceleration'}
                      {activeSensitivity === 'Delayed' && 'Sniping and precise shots'}
                      {activeSensitivity === 'Aggressive' && 'Quick reactions, fast flick'}
                      {activeSensitivity === 'Smooth' && 'S curve, most balanced'}
                    </p>
                  </div>
                </div>

                {/* Chevron */}
                <div className="h-14 w-6 flex items-center justify-center relative z-10">
                  <ChevronDown className="w-4 h-4 text-[#a7a7a8] transition-transform" style={{
                    transform: sensitivityDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </div>
              </div>

              {/* Dropdown List */}
              {sensitivityDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#2e2e2e] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] z-50 overflow-hidden p-2 flex flex-col gap-1">
                  {[
                    { name: 'Linear', desc: 'Predictable, no acceleration' },
                    { name: 'Delayed', desc: 'Sniping and precise shots' },
                    { name: 'Aggressive', desc: 'Quick reactions, fast flick' },
                    { name: 'Smooth', desc: 'S curve, most balanced' }
                  ].map((option) => {
                    const isSelected = option.name === activeSensitivity;
                    return (
                      <div
                        key={option.name}
                        className={`bg-[#242424] h-[72px] p-2 flex items-center justify-between cursor-pointer rounded-lg relative overflow-hidden group ${
                          isSelected ? '' : 'hover:bg-[rgba(251,251,251,0.14)]'
                        }`}
                        onClick={() => {
                          if (activeStick === 'left') {
                            setSensitivity(option.name);
                          } else {
                            setRightSensitivity(option.name);
                          }
                          setSensitivityDropdownOpen(false);
                        }}
                      >
                        <div className="flex gap-4 h-14 items-center relative z-10">
                          {/* Curve Icon */}
                          <div className="bg-[#1a1a1a] shrink-0 flex items-center justify-center rounded overflow-hidden px-2 py-[7px]" style={{ width: '64px', height: '56px' }}>
                            <div className="transform scale-y-[-1] rotate-180" style={{ width: '48px', height: '20px' }}>
                              <img
                                src={`/figmaAssets/curve-${option.name.toLowerCase()}.svg`}
                                alt={option.name}
                                className="w-full h-full block object-contain"
                              />
                            </div>
                          </div>

                          {/* Labels */}
                          <div className="flex flex-col gap-[6px]">
                            <p className={`font-logitech text-[14px] tracking-[-0.42px] leading-[1.3] ${
                              isSelected ? 'font-bold text-[#00b6fa]' : 'text-[#e6e6e6]'
                            }`}>
                              {option.name}
                            </p>
                            <p className="font-logitech text-[12px] text-[#a7a7a8] leading-[1.3]">
                              {option.desc}
                            </p>
                          </div>
                        </div>

                        {/* Chevron - hidden in dropdown */}
                        <div className="h-14 w-6 opacity-0" />
                      </div>
                    );
                  })}
                </div>
              )}
              </div>

            {/* Curve Adjustment */}
            <div className="mb-6 mt-6">
              <div className="flex h-6 items-center mb-[15px]">
                <p className="font-logitech font-bold text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap">
                  Curve Adjustment
                </p>
              </div>
              <div className="flex gap-4 h-10 items-center">
                <div className="flex-1 flex flex-col items-start min-h-0 min-w-0">
                  <div className="h-[22px] relative rounded-[2px] w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeCurveAdjustment}
                      onChange={(e) => activeStick === 'left' ? setCurveAdjustment(Number(e.target.value)) : setRightCurveAdjustment(Number(e.target.value))}
                      onMouseDown={() => setIsDraggingCurve(true)}
                      onMouseUp={() => setIsDraggingCurve(false)}
                      onTouchStart={() => setIsDraggingCurve(true)}
                      onTouchEnd={() => setIsDraggingCurve(false)}
                      onMouseEnter={() => setIsHoveringCurve(true)}
                      onMouseLeave={() => setIsHoveringCurve(false)}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-[2px] pointer-events-none">
                      {/* Slider Rail */}
                      <div className="absolute h-[18px] left-0 right-0 top-1/2 -translate-y-1/2">
                        <div className="absolute h-[4px] left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                          <div className="w-[4px] h-full bg-[#2e2e2e] rounded-full" style={{ width: '100%', height: '4px' }} />
                        </div>
                      </div>

                      {/* Tick marks */}
                      <div className="absolute inset-[7px_12px]">
                        {[1.11, 13.33, 25.56, 37.78, 50, 62.22, 74.44, 86.67, 98.89].map((position, i) => {
                          return (
                            <div
                              key={i}
                              className="absolute top-1/2 -translate-y-1/2"
                              style={{ left: `${position}%` }}
                            >
                              <div
                                className="bg-[#5a5a5a] rounded-full -translate-x-1/2"
                                style={{ width: '2px', height: '2px' }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Slider Track (filled portion) */}
                      <div className="absolute top-0 bottom-0 left-0" style={{ right: `${100 - activeCurveAdjustment}%` }}>
                        <div className="absolute h-[4px] left-0 right-[1px] top-1/2 -translate-y-1/2">
                          <div className="h-full bg-[#00b6fa] rounded-full" />
                        </div>
                        {/* Slider Thumb */}
                        <div className={`slider-thumb-container absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none ${isHoveringCurve ? 'hovering' : ''} ${isDraggingCurve ? 'dragging' : ''}`}>
                          {/* Glow effect */}
                          <div
                            className="slider-glow absolute inset-0 w-8 h-8 bg-[#00b6fa] rounded-full pointer-events-none"
                            style={{
                              opacity: 0,
                              transition: 'opacity 0.2s'
                            }}
                          />
                          {/* Main thumb */}
                          <div className="absolute inset-[8px] w-4 h-4 bg-white rounded-full shadow-[1px_1px_10px_rgba(0,0,0,0.4)] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start rounded-lg w-[74px]">
                  <div className="bg-[#2e2e2e] flex h-10 items-center justify-center px-4 rounded-lg w-full gap-0">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={activeCurveAdjustment}
                      onChange={(e) => {
                        const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                        if (activeStick === 'left') {
                          setCurveAdjustment(value);
                        } else {
                          setRightCurveAdjustment(value);
                        }
                      }}
                      className={`bg-transparent font-logitech text-[14px] tracking-[-0.42px] leading-[1.3] w-[42px] text-center outline-none transition-colors ${isDraggingCurve ? 'text-[#ececec]' : 'text-[#8e8e8f]'}`}
                    />
                    <span className={`font-logitech text-[14px] transition-colors ${isDraggingCurve ? 'text-[#ececec]' : 'text-[#8e8e8f]'}`}>%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curve Editor Grid */}
            <style>
              {`
                .control-point-group:hover circle:first-child {
                  opacity: 0.15 !important;
                }
                .control-point-group.dragging circle:first-child {
                  opacity: 0.25 !important;
                }

                .slider-thumb-container.hovering .slider-glow {
                  opacity: 0.15 !important;
                }
                .slider-thumb-container.dragging .slider-glow {
                  opacity: 0.25 !important;
                }

                @keyframes pulse-ring {
                  0% {
                    stroke-width: 3;
                    stroke-opacity: 0.8;
                    r: 64.5551px;
                  }
                  100% {
                    stroke-width: 0;
                    stroke-opacity: 0;
                    r: 80px;
                  }
                }

                .pulse-ring {
                  animation: pulse-ring 1.5s ease-out infinite;
                }
              `}
            </style>
            <div className="border border-[#4d4d4d] rounded relative h-[200px] overflow-hidden">
              {/* Grid */}
              <div className="grid grid-cols-[repeat(18,1fr)] grid-rows-[repeat(10,1fr)] h-full w-full">
                {[...Array(180)].map((_, i) => (
                  <div key={i} className="border-[1px] border-[rgba(255,255,255,0.1)]" />
                ))}
              </div>

              {/* Curve visualization - dynamic based on control points */}
              <svg
                ref={svgRef}
                className="absolute inset-0"
                viewBox="0 0 372 200"
                style={{ pointerEvents: 'auto', userSelect: 'none' }}
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00b6fa" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00b6fa" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Gradient fill under the curve */}
                <path
                  d={`${getCurvePath()} L 372 200 L 0 200 Z`}
                  fill="url(#curveGradient)"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Dimmed base curve */}
                <path
                  d={getCurvePath()}
                  stroke="#00b6fa"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.35"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Active trace that fills up with stick movement */}
                <path
                  d={getCurvePath()}
                  stroke="#00b6fa"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    pointerEvents: 'none',
                    strokeDasharray: '1000',
                    strokeDashoffset: 1000 - (stickMagnitude * 1000)
                  }}
                />

                {/* Control points */}
                {controlPoints.map((point, i) => {
                  const pos = getPointPosition(i);
                  const isActive = draggingIndex === i;
                  return (
                    <g key={i} className={`control-point-group ${isActive ? 'dragging' : ''}`}>
                      {/* Hover/active glow effect */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill="#00b6fa"
                        style={{
                          pointerEvents: 'none',
                          opacity: 0,
                          transition: 'opacity 0.2s'
                        }}
                      />
                      {/* Main control point */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="3"
                        fill="white"
                        stroke="#00b6fa"
                        strokeWidth="1.5"
                        style={{
                          pointerEvents: 'auto',
                          cursor: 'pointer'
                        }}
                        onMouseDown={handleMouseDown(i)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            </>
            )}
            </div>
          </div>
        </div>

        {/* Center - Controller Visualization */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Header aligned with G Hub section */}
          <div className="flex items-center justify-end w-full h-[71px] shrink-0">
            <div className="flex gap-4 items-center">
              <h1 className="font-logitech font-bold leading-[28px] text-white text-2xl text-right tracking-[-0.96px] whitespace-nowrap">
                Ghost
              </h1>
              <div className="bg-[#082b0d] rounded flex gap-1 h-8 items-center overflow-hidden pl-1 pr-3 py-1.5">
                <div className="relative shrink-0 w-6 h-6">
                  <div className="absolute inset-[12.5%_31.25%]">
                    <img alt="Battery" className="absolute block max-w-none w-full h-full" src={imgBatteryIcon} />
                  </div>
                </div>
                <div className="flex h-6 items-center">
                  <p className="font-logitech font-bold text-[12px] text-[#2dba3e] leading-[1.3] whitespace-nowrap">50%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controller visualization centered below */}
          <div className="flex-1 flex flex-col items-center justify-center">

          <div className="relative w-[1188px] h-[771px]">
            {/* Controller Image - changes based on active stick */}
            <img
              src={activeStick === 'left' ? '/ghost-controller-left-stick.png' : '/ghost-controller-right-stick.png'}
              alt={`Ghost Controller - ${activeStick === 'left' ? 'Left' : 'Right'} Stick Focus`}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ pointerEvents: 'none' }}
            />

            {/* Deadzone Indicator on Left Thumbstick - centered concentrically */}
            <div
              className="absolute"
              style={{
                left: activeStick === 'left' ? '279px' : '479px',
                top: '238px',
                width: '117px',
                height: '117px',
                transform: 'translate(-50%, -50%)',
                overflow: 'visible'
              }}
            >
              <svg
                viewBox="0 0 129.984 129.977"
                className="w-full h-full"
                style={{ display: 'block', overflow: 'visible' }}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="filter0_i" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="16.2396"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.713726 0 0 0 0 0.980392 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                  </filter>
                  <filter id="filter1_i" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="8.11979"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                  </filter>
                  <radialGradient id="innerCircleGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.8"/>
                    <stop offset="85%" stopColor="#0a0a0a" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0"/>
                  </radialGradient>
                  {/* Blue gradient for active input area */}
                  <radialGradient id="blueActiveGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#1a4d5e" stopOpacity="0.9"/>
                    <stop offset="50%" stopColor="#0d3847" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#00293a" stopOpacity="0.5"/>
                  </radialGradient>
                  {/* Mask for outer deadzone ring */}
                  <mask id="outerDeadzoneMask">
                    <circle cx="64.9883" cy="64.9883" r="60" fill="white"/>
                    <circle cx="64.9883" cy="64.9883" r={Math.max(60 * (100 - activeOuterDeadzone) / 100, 4)} fill="black"/>
                  </mask>
                </defs>
                {/* Outer ring with glow */}
                <g filter="url(#filter0_i)">
                  <circle cx="64.9883" cy="64.9883" r="64.9883" fill="#101113" fillOpacity="0.01"/>
                </g>

                {/* Pulsing ring - only visible when dragging either deadzone slider */}
                {(isDraggingDeadzone || isDraggingDeadzone2) && (
                  <circle
                    cx="64.9883"
                    cy="64.9883"
                    r="64.5551"
                    stroke="#00B6FA"
                    strokeWidth="3"
                    strokeOpacity="0.8"
                    fill="none"
                  >
                    <animate
                      attributeName="r"
                      from="64.5551"
                      to="80"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-width"
                      from="3"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      from="0.8"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Static outer circle */}
                <circle
                  cx="64.9883"
                  cy="64.9883"
                  r="64.5551"
                  stroke="#00B6FA"
                  strokeWidth="0.866598"
                  fill="none"
                />

                {/* Blue active input area - shows full stick range */}
                <circle
                  cx="64.9883"
                  cy="64.9883"
                  r="60"
                  fill="url(#blueActiveGradient)"
                />

                {/* Inner deadzone circle - scales with slider (covers blue gradient as it grows) */}
                <g filter="url(#filter1_i)">
                  <circle
                    cx="64.9883"
                    cy="64.9883"
                    r={Math.min(4 + (55 * (activeInnerDeadzone / 100)), 60)}
                    fill="url(#innerCircleGradient)"
                    stroke="#00B6FA"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                </g>

                {/* Outer deadzone ring - shrinks inward as slider increases */}
                <g filter="url(#filter1_i)" mask="url(#outerDeadzoneMask)">
                  <circle
                    cx="64.9883"
                    cy="64.9883"
                    r="60"
                    fill="url(#innerCircleGradient)"
                    stroke="#00B6FA"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                  />
                </g>

                {/* Crosshair - faint white lines through center */}
                <line
                  x1="10"
                  y1="64.9883"
                  x2="119.9766"
                  y2="64.9883"
                  stroke="#FBFBFB"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />
                <line
                  x1="64.9883"
                  y1="10"
                  x2="64.9883"
                  y2="119.9766"
                  stroke="#FBFBFB"
                  strokeWidth="0.5"
                  strokeOpacity="0.3"
                />

                {/* Line connecting white dot to blue dot */}
                {(activeStickWithDeadzone.magnitude > 0) && (
                  <line
                    x1={dotPosition.x}
                    y1={dotPosition.y}
                    x2={blueDotPosition.x}
                    y2={blueDotPosition.y}
                    stroke="#00b6fa"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                  />
                )}

                {/* Center dot (white) - moves with left stick input */}
                <circle
                  cx={dotPosition.x}
                  cy={dotPosition.y}
                  r="3.51252"
                  fill="#FBFBFB"
                />

                {/* Blue pulsing dot - curve-adjusted output */}
                {(activeStickWithDeadzone.magnitude > 0) && (
                  <>
                    {/* Pulsing glow */}
                    <circle
                      cx={blueDotPosition.x}
                      cy={blueDotPosition.y}
                      r="8"
                      fill="#00b6fa"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        values="6;10;6"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.1;0.3"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* Solid blue dot */}
                    <circle
                      cx={blueDotPosition.x}
                      cy={blueDotPosition.y}
                      r="3.51252"
                      fill="#00b6fa"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSave={handlePresetSave}
        currentPreset={currentPreset}
        onOpenImportModal={handleOpenImportModal}
      />

      {/* Import Profile Modal */}
      <ImportProfileModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        targetProfile={importTargetProfile}
        onImport={handleImportComplete}
      />

      {/* Save Notification */}
      {showSaveNotification && (
        <SaveNotification
          profileName={savedProfileInfo.profileName}
          targetSlot={savedProfileInfo.targetSlot}
          onClose={() => setShowSaveNotification(false)}
        />
      )}
    </div>
  );
}
 
