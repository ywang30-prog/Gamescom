import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Button from './Button';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';
import ProfileSelector from './ProfileSelector';
import DeviceStatusWidget from './DeviceStatusWidget';
import BinaryToggle from './BinaryToggle';
import Toggle from './Toggle';
import MouseClickIndicator from './MouseClickIndicator';

// Image assets
const imgBatteryIcon = "/figmaAssets/battery-icon.svg";
const imgPresetIcon = "/figmaAssets/preset-icon.svg";
const imgPresetLinear = "/figmaAssets/preset-linear.svg";
const imgPresetAggressive = "/figmaAssets/preset-aggressive.svg";
const imgPresetExponential = "/figmaAssets/preset-exponential.svg";
const imgTriggerRange = "/figmaAssets/trigger-range.svg";

export default function TriggerDeadzone() {
  const navigate = useNavigate();
  const currentProfile = localStorage.getItem('currentPreset') || 'desktop';

  const [leftStartValue, setLeftStartValue] = useState(() => {
    const saved = localStorage.getItem(`leftTriggerStartValue_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 30;
  });
  const [leftEndValue, setLeftEndValue] = useState(() => {
    const saved = localStorage.getItem(`leftTriggerEndValue_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 70;
  });
  const [rightStartValue, setRightStartValue] = useState(() => {
    const saved = localStorage.getItem(`rightTriggerStartValue_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 30;
  });
  const [rightEndValue, setRightEndValue] = useState(() => {
    const saved = localStorage.getItem(`rightTriggerEndValue_${currentProfile}`);
    return saved !== null ? JSON.parse(saved) : 70;
  });
  const [leftTriggerMode, setLeftTriggerMode] = useState(() => {
    // Force default to 'analog'
    return 'analog';
  });
  const [rightTriggerMode, setRightTriggerMode] = useState(() => {
    // Force default to 'analog'
    return 'analog';
  });
  const [activeTrigger, setActiveTrigger] = useState(() => {
    const saved = localStorage.getItem(`activeTrigger_${currentProfile}`);
    return saved || 'left';
  });

  // Position values for left trigger (finalized)
  const leftTriggerX = 78;
  const leftTriggerY = -30;
  const leftTriggerScale = 1.8;

  // Arc position for left trigger (finalized)
  const arcLeftOffset = -20;
  const arcTopOffset = -200;

  // Right trigger position (finalized - Y compensated for editor removal)
  const rightTriggerX = -80;
  const rightTriggerY = -25; // Moved up 20px more from -5px
  const rightTriggerScale = 1.8;

  // Right trigger arc position (finalized - also compensated for editor removal)
  const rightArcLeftOffset = 273;
  const rightArcTopOffset = -193; // Moved up 20px more from -173px
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isHoveringStart, setIsHoveringStart] = useState(false);
  const [isHoveringEnd, setIsHoveringEnd] = useState(false);
  const [leftTriggerPreset, setLeftTriggerPreset] = useState(() => {
    const saved = localStorage.getItem(`leftTriggerPreset_${currentProfile}`);
    return saved || 'Linear';
  });
  const [rightTriggerPreset, setRightTriggerPreset] = useState(() => {
    const saved = localStorage.getItem(`rightTriggerPreset_${currentProfile}`);
    return saved || 'Linear';
  });
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [isTriggerModeExpanded, setIsTriggerModeExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const sliderRef = useRef(null);
  const presetDropdownRef = useRef(null);
  const [currentTriggerValue, setCurrentTriggerValue] = useState(0);
  const [registeredTriggerValue, setRegisteredTriggerValue] = useState(0);
  const previousHasChangedRef = useRef(false);
  const gamepadRafRef = useRef(0);

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

  // Active value selectors based on which trigger is selected
  const activeStartValue = activeTrigger === 'left' ? leftStartValue : rightStartValue;
  const activeEndValue = activeTrigger === 'left' ? leftEndValue : rightEndValue;
  const activeTriggerMode = activeTrigger === 'left' ? leftTriggerMode : rightTriggerMode;
  const activeTriggerPreset = activeTrigger === 'left' ? leftTriggerPreset : rightTriggerPreset;
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

  // New toggle states
  const [applyToBothTriggers, setApplyToBothTriggers] = useState(() => {
    const saved = localStorage.getItem('applyToBothTriggers');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [showAdvancedTriggerControl, setShowAdvancedTriggerControl] = useState(() => {
    const saved = localStorage.getItem('showAdvancedTriggerControl');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [switchToMouseClick, setSwitchToMouseClick] = useState(() => {
    const saved = localStorage.getItem('switchToMouseClick');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Binary toggle indicator position (for mouse click mode) - finalized
  const binaryToggleLeftOffset = 4;  // Left trigger X offset
  const binaryToggleTopOffset = -4;    // Left trigger Y offset
  const rightBinaryToggleLeftOffset = 272;  // Right trigger X offset
  const rightBinaryToggleTopOffset = -4;    // Right trigger Y offset

  // Padding for curve control points
  const padding = 10;

  // Helper function to get base control points for each trigger preset type
  const getPresetControlPoints = (presetType) => {
    const presets = {
      'Linear': [
        { x: padding, y: 190 },
        { x: 93, y: 155 },
        { x: 186, y: 120 },
        { x: 279, y: 85 },
        { x: 372 - padding, y: padding }
      ],
      'Aggressive': [
        { x: padding, y: 190 },
        { x: 93, y: 82 },
        { x: 186, y: 46 },
        { x: 279, y: 28 },
        { x: 372 - padding, y: padding }
      ],
      'Exponential': [
        { x: padding, y: 190 },
        { x: 93, y: 165 },
        { x: 186, y: 120 },
        { x: 279, y: 75 },
        { x: 372 - padding, y: padding }
      ]
    };

    return presets[presetType] || presets['Linear'];
  };

  // Curve control points for triggers
  const [leftTriggerControlPoints, setLeftTriggerControlPoints] = useState(() => {
    const saved = localStorage.getItem(`leftTriggerControlPoints_${currentProfile}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return getPresetControlPoints('Linear');
  });

  const [rightTriggerControlPoints, setRightTriggerControlPoints] = useState(() => {
    const saved = localStorage.getItem(`rightTriggerControlPoints_${currentProfile}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return getPresetControlPoints('Linear');
  });

  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragPosition, setDragPosition] = useState(null);
  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Active control points based on which trigger is selected
  const activeTriggerControlPoints = activeTrigger === 'left' ? leftTriggerControlPoints : rightTriggerControlPoints;
  const setActiveTriggerControlPoints = activeTrigger === 'left' ? setLeftTriggerControlPoints : setRightTriggerControlPoints;

  // Profile management handlers
  const handlePresetClick = () => {
    setIsPresetModalOpen(true);
  };

  const handlePresetSave = (presetId) => {
    setCurrentPreset(presetId);
    localStorage.setItem('currentPreset', presetId);
    setIsPresetModalOpen(false);

    // Load saved settings for the new profile
    const savedLeftStart = localStorage.getItem(`leftTriggerStartValue_${presetId}`);
    const savedLeftEnd = localStorage.getItem(`leftTriggerEndValue_${presetId}`);
    const savedLeftMode = localStorage.getItem(`leftTriggerMode_${presetId}`);
    const savedLeftPreset = localStorage.getItem(`leftTriggerPreset_${presetId}`);
    const savedRightStart = localStorage.getItem(`rightTriggerStartValue_${presetId}`);
    const savedRightEnd = localStorage.getItem(`rightTriggerEndValue_${presetId}`);
    const savedRightMode = localStorage.getItem(`rightTriggerMode_${presetId}`);
    const savedRightPreset = localStorage.getItem(`rightTriggerPreset_${presetId}`);
    const savedActive = localStorage.getItem(`activeTrigger_${presetId}`);

    setLeftStartValue(savedLeftStart !== null ? JSON.parse(savedLeftStart) : 30);
    setLeftEndValue(savedLeftEnd !== null ? JSON.parse(savedLeftEnd) : 70);
    setLeftTriggerMode(savedLeftMode || 'analog');
    setLeftTriggerPreset(savedLeftPreset || 'Linear');
    setRightStartValue(savedRightStart !== null ? JSON.parse(savedRightStart) : 30);
    setRightEndValue(savedRightEnd !== null ? JSON.parse(savedRightEnd) : 70);
    setRightTriggerMode(savedRightMode || 'analog');
    setRightTriggerPreset(savedRightPreset || 'Linear');
    setActiveTrigger(savedActive || 'left');

    // Set saved settings baseline to the newly loaded data
    setTimeout(() => {
      setSavedSettings({
        leftStartValue: savedLeftStart !== null ? JSON.parse(savedLeftStart) : 30,
        leftEndValue: savedLeftEnd !== null ? JSON.parse(savedLeftEnd) : 70,
        leftTriggerMode: savedLeftMode || 'analog',
        leftTriggerPreset: savedLeftPreset || 'Linear',
        rightStartValue: savedRightStart !== null ? JSON.parse(savedRightStart) : 30,
        rightEndValue: savedRightEnd !== null ? JSON.parse(savedRightEnd) : 70,
        rightTriggerMode: savedRightMode || 'analog',
        rightTriggerPreset: savedRightPreset || 'Linear',
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
      leftStartValue,
      leftEndValue,
      leftTriggerMode,
      leftTriggerPreset,
      rightStartValue,
      rightEndValue,
      rightTriggerMode,
      rightTriggerPreset,
    });

    setHasLocalChanges(false);
    setHasUnsavedChanges(false);
    localStorage.setItem('hasUnsavedChanges', 'false');
    // Dispatch custom event so other pages can update
    window.dispatchEvent(new CustomEvent('unsavedChangesUpdated', { detail: { hasChanges: false } }));

    // Show notification
    const slotNames = {
      p1: 'P1: Desktop: Default',
      p2: 'P2 Ghost',
      p3: 'P3 Ghost',
    };

    setSavedProfileInfo({
      profileName: slotNames[currentPreset] || currentPreset,
      targetSlot: 'saved'
    });
    setShowSaveNotification(true);
  };

  // Apply deadzone to raw trigger value
  const applyDeadzone = (rawValue, start, end) => {
    if (rawValue < start) {
      return 0; // Below deadzone start - no input
    } else if (rawValue > end) {
      return 100; // Above deadzone end - full input
    } else {
      // Within deadzone range - map linearly from 0 to 100
      return ((rawValue - start) / (end - start)) * 100;
    }
  };

  // Initialize saved settings on mount - captures state after all initial effects
  useEffect(() => {
    if (savedSettings === null) {
      const globalFlag = localStorage.getItem('hasUnsavedChanges') === 'true';

      // Always initialize with current state
      setSavedSettings({
        leftStartValue,
        leftEndValue,
        leftTriggerMode,
        leftTriggerPreset,
        rightStartValue,
        rightEndValue,
        rightTriggerMode,
        rightTriggerPreset,
      });

      // If global flag is false, a save happened elsewhere - accept current state as saved
      // Otherwise, preserve the global flag state
      setHasUnsavedChanges(globalFlag);
      setHasLocalChanges(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSettings]); // Only depend on savedSettings to run once on mount

  // Track changes to settings
  useEffect(() => {
    if (savedSettings === null) return;

    const hasChanged =
      leftStartValue !== savedSettings.leftStartValue ||
      leftEndValue !== savedSettings.leftEndValue ||
      leftTriggerMode !== savedSettings.leftTriggerMode ||
      leftTriggerPreset !== savedSettings.leftTriggerPreset ||
      rightStartValue !== savedSettings.rightStartValue ||
      rightEndValue !== savedSettings.rightEndValue ||
      rightTriggerMode !== savedSettings.rightTriggerMode ||
      rightTriggerPreset !== savedSettings.rightTriggerPreset;

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
  }, [leftStartValue, leftEndValue, leftTriggerMode, leftTriggerPreset, rightStartValue, rightEndValue, rightTriggerMode, rightTriggerPreset, savedSettings]);

  // Persist trigger settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`leftTriggerStartValue_${currentPreset}`, JSON.stringify(leftStartValue));
  }, [leftStartValue, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`leftTriggerEndValue_${currentPreset}`, JSON.stringify(leftEndValue));
  }, [leftEndValue, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightTriggerStartValue_${currentPreset}`, JSON.stringify(rightStartValue));
  }, [rightStartValue, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightTriggerEndValue_${currentPreset}`, JSON.stringify(rightEndValue));
  }, [rightEndValue, currentPreset]);

  // Show pulse when dragging
  useEffect(() => {
    setShowPulse(isDraggingStart || isDraggingEnd);
  }, [isDraggingStart, isDraggingEnd]);

  useEffect(() => {
    localStorage.setItem(`leftTriggerMode_${currentPreset}`, leftTriggerMode);
  }, [leftTriggerMode, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightTriggerMode_${currentPreset}`, rightTriggerMode);
  }, [rightTriggerMode, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`leftTriggerPreset_${currentPreset}`, leftTriggerPreset);
  }, [leftTriggerPreset, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightTriggerPreset_${currentPreset}`, rightTriggerPreset);
  }, [rightTriggerPreset, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`activeTrigger_${currentPreset}`, activeTrigger);
  }, [activeTrigger, currentPreset]);

  // Persist toggle states
  useEffect(() => {
    localStorage.setItem('applyToBothTriggers', JSON.stringify(applyToBothTriggers));
  }, [applyToBothTriggers]);

  useEffect(() => {
    localStorage.setItem('showAdvancedTriggerControl', JSON.stringify(showAdvancedTriggerControl));
  }, [showAdvancedTriggerControl]);

  useEffect(() => {
    localStorage.setItem('switchToMouseClick', JSON.stringify(switchToMouseClick));

    // Force applyToBothTriggers ON when mouse click mode is enabled
    if (switchToMouseClick && !applyToBothTriggers) {
      setApplyToBothTriggers(true);
    }
  }, [switchToMouseClick, applyToBothTriggers]);

  // Generate smooth curve that passes exactly through all control points
  const getCurvePath = () => {
    const points = activeTriggerControlPoints.map((point, i) =>
      (draggingIndex === i && dragPosition) ? dragPosition : point
    );

    if (points.length < 2) return '';

    // Calculate slope at start to extend line to left edge
    const startSlope = (points[1].y - points[0].y) / (points[1].x - points[0].x);
    const startY = points[0].y - startSlope * points[0].x;

    // Calculate slope at end to extend line to right edge
    const endPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];
    const endSlope = (endPoint.y - secondLastPoint.y) / (endPoint.x - secondLastPoint.x);
    const endY = endPoint.y + endSlope * (372 - endPoint.x);

    let path = `M 0 ${startY}`;
    path += ` L ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }

    path += ` L 372 ${endY}`;
    return path;
  };

  // Mouse handlers for dragging control points
  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingIndex(index);
    isDraggingRef.current = true;
    setDragPosition(activeTriggerControlPoints[index]);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || draggingIndex === null || !svgRef.current) return;

    e.preventDefault();

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 372;
    const y = ((e.clientY - rect.top) / rect.height) * 200;

    const clampedX = Math.max(padding, Math.min(372 - padding, x));
    const clampedY = Math.max(padding, Math.min(200 - padding, y));

    let newPosition;
    if (draggingIndex === 0) {
      newPosition = { x: padding, y: clampedY };
    } else if (draggingIndex === activeTriggerControlPoints.length - 1) {
      newPosition = { x: 372 - padding, y: clampedY };
    } else {
      newPosition = { x: clampedX, y: clampedY };
    }

    setDragPosition(newPosition);
    setActiveTriggerControlPoints(prev => {
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

  // Update control points when preset changes
  useEffect(() => {
    if (activeTrigger === 'left') {
      const newPoints = getPresetControlPoints(leftTriggerPreset);
      setLeftTriggerControlPoints(newPoints);
    } else {
      const newPoints = getPresetControlPoints(rightTriggerPreset);
      setRightTriggerControlPoints(newPoints);
    }
  }, [leftTriggerPreset, rightTriggerPreset, activeTrigger]);

  // Persist control points
  useEffect(() => {
    localStorage.setItem(`leftTriggerControlPoints_${currentPreset}`, JSON.stringify(leftTriggerControlPoints));
  }, [leftTriggerControlPoints, currentPreset]);

  useEffect(() => {
    localStorage.setItem(`rightTriggerControlPoints_${currentPreset}`, JSON.stringify(rightTriggerControlPoints));
  }, [rightTriggerControlPoints, currentPreset]);

  // Handle dragging
  useEffect(() => {
    if (draggingIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingIndex, activeTriggerControlPoints.length]);

  // Apply to both triggers logic - sync settings when toggled ON
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    if (applyToBothTriggers && activeTrigger === 'left') {
      // Sync left settings to right when left trigger is active
      setRightStartValue(leftStartValue);
      setRightEndValue(leftEndValue);
      setRightTriggerMode(leftTriggerMode);
      setRightTriggerPreset(leftTriggerPreset);
    }
  }, [applyToBothTriggers, leftStartValue, leftEndValue, leftTriggerMode, leftTriggerPreset, activeTrigger]);

  useEffect(() => {
    if (!isInitialized.current) return;

    if (applyToBothTriggers && activeTrigger === 'right') {
      // Sync right settings to left when right trigger is active
      setLeftStartValue(rightStartValue);
      setLeftEndValue(rightEndValue);
      setLeftTriggerMode(rightTriggerMode);
      setLeftTriggerPreset(rightTriggerPreset);
    }
  }, [applyToBothTriggers, rightStartValue, rightEndValue, rightTriggerMode, rightTriggerPreset, activeTrigger]);

  // Global sync: listen for profile changes from other pages/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentPreset' && e.newValue) {
        setCurrentPreset(e.newValue);
        // Reset saved settings when profile changes from another page
        setSavedSettings(null);
        setHasUnsavedChanges(false);
        localStorage.setItem('hasUnsavedChanges', 'false');
      } else if (e.key === 'onboardProfileMapping' && e.newValue) {
        setOnboardProfileMapping(JSON.parse(e.newValue));
      } else if (e.key === 'hasUnsavedChanges') {
        // Update unsaved changes state when it changes in other tabs
        setHasUnsavedChanges(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Ref to hold current state values for event listener
  const currentStateRef = useRef({ leftStartValue, leftEndValue, leftTriggerMode, leftTriggerPreset, rightStartValue, rightEndValue, rightTriggerMode, rightTriggerPreset });
  useEffect(() => {
    currentStateRef.current = { leftStartValue, leftEndValue, leftTriggerMode, leftTriggerPreset, rightStartValue, rightEndValue, rightTriggerMode, rightTriggerPreset };
  }, [leftStartValue, leftEndValue, leftTriggerMode, leftTriggerPreset, rightStartValue, rightEndValue, rightTriggerMode, rightTriggerPreset]);

  // Listen for updates from other pages
  useEffect(() => {
    const handleUnsavedChangesUpdate = (event) => {
      setHasUnsavedChanges(event.detail.hasChanges);
      // If another page saved, update our saved settings to current state
      if (!event.detail.hasChanges) {
        const current = currentStateRef.current;
        setSavedSettings({
          leftStartValue: current.leftStartValue,
          leftEndValue: current.leftEndValue,
          leftTriggerMode: current.leftTriggerMode,
          leftTriggerPreset: current.leftTriggerPreset,
          rightStartValue: current.rightStartValue,
          rightEndValue: current.rightEndValue,
          rightTriggerMode: current.rightTriggerMode,
          rightTriggerPreset: current.rightTriggerPreset,
        });
        setHasLocalChanges(false);
      }
    };

    window.addEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
    return () => window.removeEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
  }, []); // No dependencies - listener registered once

  // Handle dragging for range slider
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sliderRef.current || (!isDraggingStart && !isDraggingEnd)) return;

      e.preventDefault();

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const roundedValue = Math.round(percentage);

      if (isDraggingStart) {
        if (activeTrigger === 'left') {
          setLeftStartValue(Math.min(roundedValue, leftEndValue));
        } else {
          setRightStartValue(Math.min(roundedValue, rightEndValue));
        }
      } else if (isDraggingEnd) {
        if (activeTrigger === 'left') {
          setLeftEndValue(Math.max(roundedValue, leftStartValue));
        } else {
          setRightEndValue(Math.max(roundedValue, rightStartValue));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
    };

    if (isDraggingStart || isDraggingEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, leftStartValue, leftEndValue, rightStartValue, rightEndValue, activeTrigger]);

  // Close preset dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(e.target)) {
        setIsPresetDropdownOpen(false);
      }
    };

    if (isPresetDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPresetDropdownOpen]);

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

            // Read trigger values - most controllers use buttons 6 (L2) and 7 (R2)
            let leftTrigger = 0;
            let rightTrigger = 0;

            if (gp.buttons[6]) {
              leftTrigger = gp.buttons[6].value;
            }
            if (gp.buttons[7]) {
              rightTrigger = gp.buttons[7].value;
            }

            // Filter out controller noise - anything below 3% is considered 0
            leftTrigger = leftTrigger < 0.03 ? 0 : leftTrigger;
            rightTrigger = rightTrigger < 0.03 ? 0 : rightTrigger;

            const triggerValue = activeTrigger === 'left' ? leftTrigger : rightTrigger;

            let triggerPercent = 0;
            let finalRegistered = 0;

            // If trigger value is truly zero, reset everything immediately
            if (triggerValue === 0) {
              setCurrentTriggerValue(0);
              setRegisteredTriggerValue(0);
            } else {
              triggerPercent = Math.round(triggerValue * 100);
              setCurrentTriggerValue(triggerPercent);

              // Apply deadzone to get registered value
              const registered = applyDeadzone(triggerPercent, activeStartValue, activeEndValue);
              finalRegistered = Math.round(registered);
              setRegisteredTriggerValue(finalRegistered);
            }

            break;
          }
        }

        if (!foundAny) {
          setCurrentTriggerValue(0);
          setRegisteredTriggerValue(0);
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
  }, [activeTrigger, activeStartValue, activeEndValue]);

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
                TRIGGERS
              </span>
              <div className="bg-[#00b6fa] h-px rounded-[1px] shrink-0 w-6" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex px-8 pb-8 gap-4 pt-4" style={{ overflow: 'visible' }}>
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

          {/* Trigger Controls Panel */}
          <div className="bg-[#1a1a1a] rounded-t-2xl flex-1 pt-4 px-4 overflow-y-auto">
            {/* Header with back button */}
            <div className="mb-6 pb-4 border-b border-[#2e2e2e]">
              <div className="flex items-center gap-4">
                {/* Back button */}
                <button
                  onClick={() => navigate('/')}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#2e2e2e] shrink-0 hover:bg-[#2e2e2e] transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M14 7L9 12L14 17" stroke="#e6e6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Title */}
                <h2 className="font-logitech font-bold text-[#e6e6e6] text-[16px] tracking-[-0.48px] leading-[1.28]">
                  Triggers
                </h2>
              </div>
            </div>

            {/* Switch to mouse click trigger */}
            <div className="bg-[#242424] flex gap-3 items-center p-2 rounded-lg mb-6 w-full">
              <Toggle
                enabled={switchToMouseClick}
                onChange={setSwitchToMouseClick}
              />
              <div className="flex gap-2 h-8 items-center py-0.5 flex-1">
                <span className="font-logitech text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                  Switch to mouse click trigger
                </span>
                <div className="overflow-clip relative shrink-0 w-6 h-6">
                  <div className="absolute inset-[8.33%]">
                    <img src="/info-icon.svg" alt="" className="absolute block inset-0 max-w-none w-full h-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Start and End Inputs */}
            <div className={`flex gap-4 mb-6 ${switchToMouseClick ? 'opacity-45 pointer-events-none' : ''}`}>
              <div className="flex-1 flex flex-col gap-[15px]">
                <label className="font-logitech font-bold text-[14px] text-white tracking-[-0.42px] leading-[1.3]">
                  Deadzone start
                </label>
                <div className="bg-[#242424] h-10 px-4 rounded-lg flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeStartValue}
                    disabled={switchToMouseClick}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      if (activeTrigger === 'left') {
                        setLeftStartValue(value);
                      } else {
                        setRightStartValue(value);
                      }
                    }}
                    className={`bg-transparent text-[14px] tracking-[-0.42px] w-full text-left outline-none font-logitech transition-colors ${
                      isDraggingStart ? 'text-[#ececec]' : 'text-[#a7a7a8]'
                    }`}
                  />
                  <span className={`text-[14px] font-logitech transition-colors ${
                    isDraggingStart ? 'text-[#ececec]' : 'text-[#a7a7a8]'
                  }`}>%</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-[15px]">
                <label className="font-logitech font-bold text-[14px] text-white tracking-[-0.42px] leading-[1.3]">
                  Deadzone end
                </label>
                <div className="bg-[#242424] h-10 px-4 rounded-lg flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={activeEndValue}
                    disabled={switchToMouseClick}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                      if (activeTrigger === 'left') {
                        setLeftEndValue(value);
                      } else {
                        setRightEndValue(value);
                      }
                    }}
                    className={`bg-transparent text-[14px] tracking-[-0.42px] w-full text-left outline-none font-logitech transition-colors ${
                      isDraggingEnd ? 'text-[#ececec]' : 'text-[#a7a7a8]'
                    }`}
                  />
                  <span className={`text-[14px] font-logitech transition-colors ${
                    isDraggingEnd ? 'text-[#ececec]' : 'text-[#a7a7a8]'
                  }`}>%</span>
                </div>
              </div>
            </div>

            {/* Horizontal Range Slider */}
            <div className={`mb-8 select-none ${switchToMouseClick ? 'opacity-45 pointer-events-none' : ''}`}>
              <div className="w-full relative">
                {/* Horizontal Range Slider */}
                <div
                  ref={sliderRef}
                  className="relative h-1 bg-[#2e2e2e] rounded-full select-none"
                >
                  {/* Active range on slider */}
                  <div
                    className="absolute h-full bg-[#00b6fa] rounded-full"
                    style={{
                      left: `${activeStartValue}%`,
                      width: `${activeEndValue - activeStartValue}%`,
                    }}
                  />

                  {/* Start thumb */}
                  <div
                    className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
                    style={{ left: `${activeStartValue}%` }}
                    onMouseDown={() => setIsDraggingStart(true)}
                    onMouseEnter={() => setIsHoveringStart(true)}
                    onMouseLeave={() => setIsHoveringStart(false)}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 w-8 h-8 bg-[#00b6fa] rounded-full pointer-events-none transition-opacity duration-200"
                      style={{
                        opacity: isDraggingStart ? 0.25 : isHoveringStart ? 0.15 : 0
                      }}
                    />
                    {/* Actual thumb */}
                    <div className="w-4 h-4 rounded-full bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.4)]" />
                  </div>

                  {/* End thumb */}
                  <div
                    className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
                    style={{ left: `${activeEndValue}%` }}
                    onMouseDown={() => setIsDraggingEnd(true)}
                    onMouseEnter={() => setIsHoveringEnd(true)}
                    onMouseLeave={() => setIsHoveringEnd(false)}
                  >
                    {/* Glow effect */}
                    <div
                      className="absolute inset-0 w-8 h-8 bg-[#00b6fa] rounded-full pointer-events-none transition-opacity duration-200"
                      style={{
                        opacity: isDraggingEnd ? 0.25 : isHoveringEnd ? 0.15 : 0
                      }}
                    />
                    {/* Actual thumb */}
                    <div className="w-4 h-4 rounded-full bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.4)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle switches */}
            <div className={`flex flex-col gap-[16px] mb-6 ${switchToMouseClick ? 'opacity-45' : ''}`}>
              {/* Apply to both triggers toggle */}
              <div className={`flex gap-[12px] items-center ${switchToMouseClick ? 'pointer-events-none' : ''}`}>
                <Toggle
                  enabled={applyToBothTriggers}
                  onChange={switchToMouseClick ? undefined : setApplyToBothTriggers}
                />
                <span className="font-logitech text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                  Apply to both triggers
                </span>
              </div>

              {/* Advanced trigger control toggle */}
              <div className={`flex gap-[12px] items-center ${switchToMouseClick ? 'pointer-events-none' : ''}`}>
                <Toggle
                  enabled={showAdvancedTriggerControl}
                  onChange={switchToMouseClick ? undefined : setShowAdvancedTriggerControl}
                />
                <div className="flex gap-2 items-center">
                  <span className="font-logitech text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                    Advanced trigger control
                  </span>
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-[8.33%]">
                      <img src="/info-icon.svg" alt="" className="absolute block inset-0 w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Controls - only show when toggle is ON */}
            {showAdvancedTriggerControl && (
              <>
                {/* Bottom section with different background */}
                <div className={`bg-[#1a1a1a] rounded-b-2xl px-4 py-4 -mx-4 flex flex-col gap-6 ${switchToMouseClick ? 'opacity-45' : ''}`}>
                  {/* Curated Presets Header */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between pl-0 pr-2 py-2 rounded-lg">
                      <span className="font-logitech font-bold text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                        Curated Presets
                      </span>
                    </div>
                  </div>

                  {/* Trigger Preset Selector */}
                  <div className={`relative ${switchToMouseClick ? 'pointer-events-none' : ''}`} ref={presetDropdownRef}>
                    {/* Collapsed Dropdown Button */}
                    <div
                      className="bg-[#242424] h-[72px] p-2 flex items-center justify-between cursor-pointer rounded-lg relative overflow-hidden group"
                      onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
                    >
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex gap-4 h-14 items-center relative z-10">
                        {/* Curve Icon */}
                        <div className="bg-[#1a1a1a] shrink-0 flex items-center justify-center rounded overflow-hidden px-2 py-[7px]" style={{ width: '64px', height: '56px' }}>
                          <div className="transform scale-y-[-1] rotate-180" style={{ width: '48px', height: '20px' }}>
                            <img
                              src={`/figmaAssets/curve-${activeTriggerPreset.toLowerCase()}.svg`}
                              alt={activeTriggerPreset}
                              className="w-full h-full block object-contain"
                            />
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="flex flex-col gap-[6px]">
                          <p className="font-logitech font-bold text-[14px] text-[#e6e6e6] tracking-[-0.42px] leading-[1.3]">
                            {activeTriggerPreset}
                          </p>
                          <p className="font-logitech text-[12px] text-[#a7a7a8] leading-[1.3]">
                            {activeTriggerPreset === 'Linear' && 'Consistent trigger response'}
                            {activeTriggerPreset === 'Aggressive' && 'Fast trigger activation'}
                            {activeTriggerPreset === 'Exponential' && 'Gradual then fast activation'}
                          </p>
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className="h-14 w-6 flex items-center justify-center relative z-10">
                        <ChevronDown className="w-4 h-4 text-[#a7a7a8] transition-transform" style={{
                          transform: isPresetDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} />
                      </div>
                    </div>

                    {/* Dropdown List */}
                    {isPresetDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-[#2e2e2e] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] z-50 overflow-hidden p-2 flex flex-col gap-1">
                        {[
                          { name: 'Linear', desc: 'Consistent trigger response' },
                          { name: 'Aggressive', desc: 'Fast trigger activation' },
                          { name: 'Exponential', desc: 'Gradual then fast activation' }
                        ].map((option) => {
                          const isSelected = option.name === activeTriggerPreset;
                          return (
                            <div
                              key={option.name}
                              className={`bg-[#242424] h-[72px] p-2 flex items-center justify-between cursor-pointer rounded-lg relative overflow-hidden group ${
                                isSelected ? '' : 'hover:bg-[rgba(251,251,251,0.14)]'
                              }`}
                              onClick={() => {
                                if (activeTrigger === 'left') {
                                  setLeftTriggerPreset(option.name);
                                } else {
                                  setRightTriggerPreset(option.name);
                                }
                                setIsPresetDropdownOpen(false);
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

                  {/* Curve Graph */}
                  <style>
                    {`
                      .control-point-group:hover circle:first-child {
                        opacity: 0.15 !important;
                      }
                      .control-point-group.dragging circle:first-child {
                        opacity: 0.25 !important;
                      }
                    `}
                  </style>
                  <div className={`border border-[#4d4d4d] rounded overflow-hidden relative h-[194px] ${switchToMouseClick ? 'pointer-events-none' : ''}`}>
                    {/* Grid - 18x10 grid */}
                    <div className="grid grid-cols-[repeat(18,1fr)] grid-rows-[repeat(10,1fr)] h-[200px] w-full">
                      {[...Array(180)].map((_, i) => (
                        <div key={i} className="border-[0.5px] border-[#4d4d4d]" />
                      ))}
                    </div>

                    {/* Curve visualization with interactive control points */}
                    <svg
                      ref={svgRef}
                      className="absolute inset-0"
                      viewBox="0 0 372 200"
                      style={{ pointerEvents: 'auto', userSelect: 'none' }}
                    >
                      <defs>
                        <linearGradient id="triggerCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#00b6fa" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00b6fa" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Gradient fill under the curve */}
                      <path
                        d={`${getCurvePath()} L 372 200 L 0 200 Z`}
                        fill="url(#triggerCurveGradient)"
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

                      {/* Active trace that fills up with trigger press */}
                      <path
                        d={getCurvePath()}
                        stroke="#00b6fa"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          pointerEvents: 'none',
                          strokeDasharray: '1000',
                          strokeDashoffset: 1000 - ((registeredTriggerValue / 100) * 1000)
                        }}
                      />

                      {/* Control points */}
                      {activeTriggerControlPoints.map((point, i) => {
                        const pos = (draggingIndex === i && dragPosition) ? dragPosition : point;
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
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center - Controller Visualization */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Status Widget */}
          <DeviceStatusWidget />

          {/* Controller visualization centered below */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-[800px] relative" style={{ overflow: 'visible' }}>
              <img
                src={
                  activeTrigger === 'left'
                    ? '/ghost-controller-left-trigger.png'
                    : '/ghost-controller-right-trigger.png'
                }
                alt={`Ghost Controller - ${activeTrigger === 'left' ? 'Left' : 'Right'} Trigger`}
                className="w-full h-auto"
                style={{
                  transform: activeTrigger === 'right'
                    ? `scale(${rightTriggerScale}) translateX(${rightTriggerX}px) translateY(${rightTriggerY}px)`
                    : `scale(${leftTriggerScale}) translateX(${leftTriggerX}px) translateY(${leftTriggerY}px)`,
                  pointerEvents: 'none'
                }}
              />

              {/* Trigger Range Indicator - Arc or Binary */}
              {switchToMouseClick ? (
                /* Binary ON/OFF Indicator for Mouse Click Mode */
                <div
                  className="absolute select-none"
                  style={{
                    left: activeTrigger === 'right'
                      ? `calc(15% + ${rightArcLeftOffset + rightBinaryToggleLeftOffset}px)`
                      : `calc(15% + ${arcLeftOffset + binaryToggleLeftOffset}px)`,
                    top: activeTrigger === 'right'
                      ? `calc(52% + ${rightArcTopOffset + rightBinaryToggleTopOffset}px)`
                      : `calc(52% + ${arcTopOffset + binaryToggleTopOffset}px)`,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    overflow: 'visible',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                >
                  <MouseClickIndicator isActive={registeredTriggerValue > 0} />
                </div>
              ) : (
                /* Arc Indicator for Analog Mode */
                <div
                  className="absolute w-[300px] h-[150px] select-none"
                  style={{
                    left: activeTrigger === 'right'
                      ? `calc(15% + ${rightArcLeftOffset}px)`
                      : `calc(15% + ${arcLeftOffset}px)`,
                    top: activeTrigger === 'right'
                      ? `calc(52% + ${rightArcTopOffset}px)`
                      : `calc(52% + ${arcTopOffset}px)`,
                    transform: activeTrigger === 'right' ? 'scaleX(-1)' : 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    overflow: 'visible',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                >
                <style>{`
                  @keyframes pulse-ring {
                    0% {
                      transform: scale(1);
                      opacity: 0.8;
                    }
                    100% {
                      transform: scale(1.15);
                      opacity: 0;
                    }
                  }
                  .arc-pulse-ring {
                    animation: pulse-ring 1.5s ease-out infinite;
                    transform-origin: center;
                  }
                `}</style>
                <svg viewBox="0 0 300 150" className="w-full h-full" fill="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <filter id="round">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="rounded" />
                      <feComposite in="SourceGraphic" in2="rounded" operator="atop"/>
                    </filter>
                    {/* Glow filter for active ticks */}
                    <filter id="tickGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    {/* Clip path - hide top portion, show full bottom arc */}
                    <clipPath id="arcClip">
                      <rect x="-200" y="-50" width="700" height="200" />
                    </clipPath>
                  </defs>


                  {/* Blue arc band removed - available in git history (commit 2959aef) if needed */}

                  {/* Tick marks - 50 ticks around the arc */}
                  {Array.from({ length: 50 }).map((_, i) => {
                    // Position as percentage: 0 = right (0%), 49 = left (100%)
                    // Reversed to match trigger pull direction
                    const position = 100 - (i / 49) * 100;

                    // Check if this tick is in the deadzone range
                    const isInRange = position >= activeStartValue && position <= activeEndValue;

                    // Check if this tick should glow (actively pressed)
                    // Map the registered output (0-100%) back to the deadzone range for visualization
                    const visualPosition = registeredTriggerValue > 0
                      ? activeStartValue + (registeredTriggerValue / 100) * (activeEndValue - activeStartValue)
                      : 0;
                    const isActive = registeredTriggerValue > 0 && position >= activeStartValue && position <= visualPosition;

                    // Arc parameters
                    const cx = 150;
                    const cy = 150;
                    const outerRadius = 150;

                    // Animate tick length: short when outside, long when inside deadzone
                    const shortRadius = 140; // Short tick
                    const longRadius = 125;  // Long tick
                    const innerRadius = isInRange ? longRadius : shortRadius;

                    // Convert position to angle and rotate 180° - 45° clockwise: 0% = left (135°), 100% = right (315°)
                    const angle = 135 + (position / 100) * 180;
                    const rad = (angle * Math.PI) / 180;

                    // Calculate tick endpoints
                    const x1 = cx + outerRadius * Math.cos(rad);
                    const y1 = cy - outerRadius * Math.sin(rad);
                    const x2 = cx + innerRadius * Math.cos(rad);
                    const y2 = cy - innerRadius * Math.sin(rad);

                    // Determine tick appearance
                    let strokeColor, strokeOpacity, filter;
                    if (isActive) {
                      // Active/glowing state - full brightness with glow
                      strokeColor = '#00b6fa';
                      strokeOpacity = 1;
                      filter = 'url(#tickGlow)';
                    } else if (isInRange) {
                      // In deadzone range but not pressed - dimmed blue
                      strokeColor = '#00b6fa';
                      strokeOpacity = 0.4;
                      filter = 'none';
                    } else {
                      // Outside deadzone range - gray
                      strokeColor = '#4d4d4d';
                      strokeOpacity = 1;
                      filter = 'none';
                    }

                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={strokeColor}
                        strokeOpacity={strokeOpacity}
                        strokeWidth="2"
                        strokeLinecap="round"
                        filter={filter}
                        style={{
                          transition: 'all 0.2s ease-out',
                        }}
                      />
                    );
                  })}
                </svg>
                </div>
              )}
            </div>

            {/* Binary Toggle - positioned below controller */}
            <div className="flex justify-center mt-8" style={{ position: 'relative', zIndex: 10 }}>
              <BinaryToggle
                leftLabel="Left"
                rightLabel="Right"
                value={activeTrigger}
                onChange={(value) => setActiveTrigger(value)}
                className="w-auto"
              />
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
        onImport={handleImportComplete}
        targetProfile={importTargetProfile}
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
