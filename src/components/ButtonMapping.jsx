import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';
import ProfileSelector from './ProfileSelector';
import ActionsModal from './ActionsModal';
import DeviceStatusWidget from './DeviceStatusWidget';
import BinaryToggle from './BinaryToggle';

// Image assets
const imgBatteryIcon = "/figmaAssets/battery-icon.svg";
const imgStickIcon = "/figmaAssets/stick-button-icon.svg";
const imgBumperIcon = "/figmaAssets/bumper-button-icon.svg";
const imgTriggerIcon = "/figmaAssets/triggers-icon.svg";
const imgDPadUpIcon = "/figmaAssets/dpad-up-button-icon.svg";
const imgDPadDownIcon = "/figmaAssets/dpad-down-button-icon.svg";
const imgDPadLeftIcon = "/figmaAssets/dpad-left-button-icon.svg";
const imgDPadRightIcon = "/figmaAssets/dpad-right-button-icon.svg";
const imgButtonAIcon = "/figmaAssets/button-a-icon.svg";
const imgButtonBIcon = "/figmaAssets/button-b-icon.svg";
const imgButtonXIcon = "/figmaAssets/button-x-icon.svg";

// Leader line vector images from Figma
const imgVector75 = "/figmaAssets/leader-line-75.svg";
const imgVector80 = "/figmaAssets/leader-line-80.svg";
const imgVector74 = "/figmaAssets/leader-line-74.svg";
const imgVector79 = "/figmaAssets/leader-line-79.svg";
const imgVector81 = "/figmaAssets/leader-line-81.svg";
const imgVector82 = "/figmaAssets/leader-line-82.svg";
const imgVector83 = "/figmaAssets/leader-line-83.svg";
const imgVector76 = "/figmaAssets/leader-line-76.svg";
const imgVector77 = "/figmaAssets/leader-line-77.svg";
const imgVector78 = "/figmaAssets/leader-line-78.svg";

const buttonMappings = [
  { id: 'leftStick', label: 'Left Stick', icon: imgStickIcon, defaultAssignment: 'Left Stick' },
  { id: 'rightStick', label: 'Right Stick', icon: imgStickIcon, defaultAssignment: 'Right Stick' },
  { id: 'leftBumper', label: 'Left Bumper', icon: imgBumperIcon, defaultAssignment: 'Left Bumper' },
  { id: 'rightBumper', label: 'Right Bumper', icon: imgBumperIcon, defaultAssignment: 'Right Bumper' },
  { id: 'leftTrigger', label: 'Left Trigger', icon: imgTriggerIcon, defaultAssignment: 'Left Trigger' },
  { id: 'rightTrigger', label: 'Right Trigger', icon: imgTriggerIcon, defaultAssignment: 'Right Trigger' },
  { id: 'dPadUp', label: 'D Pad Up', icon: imgDPadUpIcon, defaultAssignment: 'D Pad Up' },
  { id: 'dPadDown', label: 'D Pad Down', icon: imgDPadDownIcon, defaultAssignment: 'D Pad Down' },
  { id: 'dPadLeft', label: 'D Pad Left', icon: imgDPadLeftIcon, defaultAssignment: 'D Pad Left' },
  { id: 'dPadRight', label: 'D Pad Right', icon: imgDPadRightIcon, defaultAssignment: 'D Pad Right' },
  { id: 'buttonA', label: 'Button A', icon: imgButtonAIcon, defaultAssignment: 'Button A' },
  { id: 'buttonB', label: 'Button B', icon: imgButtonBIcon, defaultAssignment: 'Button B' },
  { id: 'buttonX', label: 'Button X', icon: imgButtonXIcon, defaultAssignment: 'Button X' },
  { id: 'buttonY', label: 'Button Y', icon: imgButtonAIcon, defaultAssignment: 'Button Y' },
  { id: 'buttonShare', label: 'Button Share', icon: imgButtonAIcon, defaultAssignment: 'Share' },
];

// Category-based actions
const categoryActions = {
  'Buttons': [
    { id: 'leftStick', label: 'Left Stick' },
    { id: 'rightStick', label: 'Right Stick' },
    { id: 'leftBumper', label: 'Left Bumper' },
    { id: 'rightBumper', label: 'Right Bumper' },
    { id: 'leftTrigger', label: 'Left Trigger' },
    { id: 'rightTrigger', label: 'Right Trigger' },
    { id: 'dPadUp', label: 'D Pad Up' },
    { id: 'dPadDown', label: 'D Pad Down' },
    { id: 'dPadLeft', label: 'D Pad Left' },
    { id: 'dPadRight', label: 'D Pad Right' },
    { id: 'buttonA', label: 'Button A' },
    { id: 'buttonB', label: 'Button B' },
    { id: 'buttonX', label: 'Button X' },
    { id: 'buttonY', label: 'Button Y' },
    { id: 'buttonShare', label: 'Button Share' },
  ],
  'Assignment': [
    { id: 'highContrast', label: 'High Contrast' },
    { id: 'launchApp', label: 'Launch App' },
    { id: 'magnifier', label: 'Magnifier' },
    { id: 'openGuide', label: 'Open Guide' },
    { id: 'playOrPause', label: 'Play or Pause' },
    { id: 'quickSettings', label: 'Quick Settings' },
    { id: 'record', label: 'Record' },
  ],
  'System': [
    { id: 'mute', label: 'Mute' },
    { id: 'volumeUp', label: 'Volume Up' },
    { id: 'volumeDown', label: 'Volume Down' },
  ],
  'Macros': [
    { id: 'rapidFire', label: 'Rapid Fire' },
    { id: 'bunnyHop', label: 'Bunny Hop' },
    { id: 'buildWall', label: 'Build Wall' },
    { id: 'quickBuy', label: 'Quick Buy' },
    { id: 'chatMacro1', label: 'Chat Macro 1' },
    { id: 'chatMacro2', label: 'Chat Macro 2' },
  ],
};

// Hotspot positions from Figma (exact ml-[] mt-[] values)
const hotspotPositions = [
  { left: 276.03, top: 246 },       // Hotspot 1
  { left: 462.29, top: 101.51 },    // Hotspot 2
  { left: 468.3, top: 180.59 },     // Hotspot 3
  { left: 182.03, top: 121 },       // Hotspot 4
  { left: 407.03, top: 199 },       // Hotspot 5
  { left: 127.03, top: 170 },       // Hotspot 6
  { left: 180.03, top: 222 },       // Hotspot 7
  { left: 232.03, top: 170 },       // Hotspot 8
  { left: 448.03, top: 129 },       // Hotspot 9
  { left: 515.27, top: 133.62 },    // Hotspot 10
];

// Combined actions for modal - includes all categories
const allModalActions = [
  ...buttonMappings,
  ...categoryActions['Assignment'],
  ...categoryActions['System'],
  ...categoryActions['Macros'],
];

export default function ButtonMapping() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('front');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverTooltip, setDragOverTooltip] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [draggedButton, setDraggedButton] = useState(null);
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState(null);
  const [showResetButton, setShowResetButton] = useState(null);
  const [hoveredLine, setHoveredLine] = useState(null);
  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedTooltipForModal, setSelectedTooltipForModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Buttons');
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);
  const [presetConfig, setPresetConfig] = useState('Default');
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const controllerRef = useRef(null);

  // Load hotspot positions from localStorage (same as Home page)
  const [hotspotPositions, setHotspotPositions] = useState(() => {
    const defaults = {
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
      'Menu Button': { left: 711, top: 159 },
      'View Button': { left: 451, top: 159 },
      'Button Share': { left: 502, top: 272 },
      'Profile Button': { left: 664, top: 273 },
    };
    const saved = localStorage.getItem('hotspotPositions');
    if (saved) {
      // Merge saved data with defaults to include any new buttons
      return { ...defaults, ...JSON.parse(saved) };
    }
    return defaults;
  });
  const tooltipRefs = useRef([]);
  const presetDropdownRef = useRef(null);
  const previousHasChangedRef = useRef(false);
  const gamepadRafRef = useRef(null);
  const lastPressedButtons = useRef(new Set());

  // Preset-specific default tooltip assignments
  const presetDefaultMappings = {
    'Default': {
      leftStick: 'Left Stick',
      leftBumper: 'Left Bumper',
      dPadUp: 'D Pad Up',
      dPadLeft: 'D Pad Left',
      dPadDown: 'D Pad Down',
      dPadRight: 'D Pad Right',
      rightBumper: 'Right Bumper',
      buttonY: 'Button Y',
      buttonB: 'Button B',
      buttonX: 'Button X',
      buttonA: 'Button A',
      rightStick: 'Right Stick',
      leftTrigger: 'Left Trigger',
      rightTrigger: 'Right Trigger',
      buttonShare: 'Share',
      viewButton: 'View',
      menuButton: 'Menu',
      profileButton: 'Profile'
    },
    'FPS config': {
      leftStick: 'Bunny Hop',
      leftBumper: 'Left Bumper',
      dPadUp: 'Chat Macro 1',
      dPadLeft: 'Volume Down',
      dPadDown: 'Chat Macro 2',
      dPadRight: 'Volume Up',
      rightBumper: 'Right Bumper',
      buttonY: 'Quick Settings',
      buttonB: 'Rapid Fire',
      buttonX: 'Build Wall',
      buttonA: 'Quick Buy',
      rightStick: 'Record',
      leftTrigger: 'Left Trigger',
      rightTrigger: 'Right Trigger',
      buttonShare: 'Share',
      viewButton: 'View',
      menuButton: 'Menu',
      profileButton: 'Profile'
    },
    'Racing config': {
      leftStick: 'Left Stick',
      leftBumper: 'Left Bumper',
      dPadUp: 'Volume Up',
      dPadLeft: 'Mute',
      dPadDown: 'Volume Down',
      dPadRight: 'Play or Pause',
      rightBumper: 'Right Bumper',
      buttonY: 'Quick Settings',
      buttonB: 'Launch App',
      buttonX: 'Record',
      buttonA: 'Play or Pause',
      rightStick: 'Right Stick',
      leftTrigger: 'Left Trigger',
      rightTrigger: 'Right Trigger',
      buttonShare: 'Share',
      viewButton: 'View',
      menuButton: 'Menu',
      profileButton: 'Profile'
    }
  };

  // Get default assignments based on current preset
  const getDefaultTooltipAssignments = (preset) => {
    return presetDefaultMappings[preset] || presetDefaultMappings['Default'];
  };

  const [assignments, setAssignments] = useState(() => {
    const currentProfile = localStorage.getItem('currentPreset') || 'desktop';
    const saved = localStorage.getItem(`buttonMappings_${currentProfile}`);
    if (saved) {
      return JSON.parse(saved);
    }
    const defaults = {};
    buttonMappings.forEach(btn => {
      defaults[btn.id] = btn.defaultAssignment;
    });
    return defaults;
  });

  const [tooltipAssignments, setTooltipAssignments] = useState(() => {
    const currentProfile = localStorage.getItem('currentPreset') || 'desktop';
    // Try loading from new key format first
    const saved = localStorage.getItem(`tooltipAssignments_${currentProfile}_Default`);
    const defaults = getDefaultTooltipAssignments('Default');
    if (saved) {
      // Merge saved data with defaults to include any new keys (like bumpers)
      return {...defaults, ...JSON.parse(saved)};
    }
    // Clear old format key if it exists
    localStorage.removeItem(`tooltipAssignments_${currentProfile}`);
    return {...defaults};
  });

  const checkIfOverTooltip = (x, y) => {
    for (let i = 0; i < tooltipRefs.current.length; i++) {
      const tooltipEl = tooltipRefs.current[i];
      if (!tooltipEl) continue;

      const rect = tooltipEl.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return { isOver: true, index: i };
      }
    }

    return { isOver: false, index: null };
  };

  const handleDragStart = (e, button) => {
    setDraggingId(button.id);
    setDraggedButton(button);

    // Initialize drag position at start
    setDragPosition({ x: e.clientX, y: e.clientY });

    // Create a small transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);

    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', button.id);
  };

  const handleDrag = (e) => {
    if (e.clientX !== 0 && e.clientY !== 0) {
      setDragPosition({ x: e.clientX, y: e.clientY });
      const { isOver, index } = checkIfOverTooltip(e.clientX, e.clientY);
      setDragOverTooltip(isOver);
      setHoveredTooltipIndex(index);
    }
  };

  const handleDragEnd = (e) => {
    // Check if dropped over a tooltip and activate it using last known position
    const { isOver, index } = checkIfOverTooltip(dragPosition.x, dragPosition.y);
    if (isOver && index !== null && draggedButton) {
      // Map index to tooltip ID
      const tooltipIds = [
        'leftStick', 'leftBumper', 'dPadUp', 'dPadLeft', 'dPadDown', 'dPadRight',
        'rightBumper', 'buttonY', 'buttonB', 'buttonX', 'buttonA', 'rightStick', 'buttonShare', 'viewButton', 'menuButton', 'profileButton'
      ];
      const tooltipId = tooltipIds[index];

      // Update tooltip assignment with dragged button label
      setTooltipAssignments(prev => ({
        ...prev,
        [tooltipId]: draggedButton.label
      }));

      // Only set active if assignment is different from default
      // If assignment matches default, clear active state
      const defaults = getDefaultTooltipAssignments(presetConfig);
      if (draggedButton.label === defaults[tooltipId]) {
        if (activeTooltip === tooltipId) {
          setActiveTooltip(null);
        }
      } else {
        setActiveTooltip(tooltipId);
      }
    }

    setDraggingId(null);
    setDraggedButton(null);
    setDragOverTooltip(false);
    setHoveredTooltipIndex(null);
  };

  const handleTooltipClick = (tooltipId, tooltipLabel) => {
    // Open actions modal
    setSelectedTooltipForModal({ id: tooltipId, label: tooltipLabel });
    setIsActionsModalOpen(true);
  };

  const handleActionSelect = (actionLabel) => {
    if (selectedTooltipForModal) {
      // Update tooltip assignment
      setTooltipAssignments(prev => ({
        ...prev,
        [selectedTooltipForModal.id]: actionLabel
      }));

      // Set active state if different from default
      const defaults = getDefaultTooltipAssignments(presetConfig);
      if (actionLabel === defaults[selectedTooltipForModal.id]) {
        if (activeTooltip === selectedTooltipForModal.id) {
          setActiveTooltip(null);
        }
      } else {
        setActiveTooltip(selectedTooltipForModal.id);
      }
    }
  };

  const handleResetTooltip = (tooltipId) => {
    // Reset to preset-specific default assignment
    const defaults = getDefaultTooltipAssignments(presetConfig);
    setTooltipAssignments(prev => ({
      ...prev,
      [tooltipId]: defaults[tooltipId]
    }));
    // Clear active and reset button states
    setActiveTooltip(null);
    setShowResetButton(null);
  };

  const handleResetAllTooltips = () => {
    // Reset ALL tooltips to preset-specific defaults
    const defaults = getDefaultTooltipAssignments(presetConfig);
    setTooltipAssignments({...defaults});
    // Clear active and reset button states
    setActiveTooltip(null);
    setShowResetButton(null);
  };

  const handleResetCurrent = () => {
    if (selectedTooltipForModal) {
      // Reset only the currently selected tooltip to its preset-specific default assignment
      const defaults = getDefaultTooltipAssignments(presetConfig);
      setTooltipAssignments(prev => ({
        ...prev,
        [selectedTooltipForModal.id]: defaults[selectedTooltipForModal.id]
      }));
      // Clear active state if this tooltip was active
      if (activeTooltip === selectedTooltipForModal.id) {
        setActiveTooltip(null);
      }
      setShowResetButton(null);
    }
  };

  // Profile management state
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    // Check for global unsaved changes flag
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  });
  // Track if THIS page specifically has changes (local)
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [savedSettings, setSavedSettings] = useState(null);

  // Edit mode state for leader lines and tooltips
  const [isEditMode, setIsEditMode] = useState(false);
  const [controllerYOffset, setControllerYOffset] = useState(8);

  // Undo/Redo state
  const [editHistory, setEditHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const saveHistoryTimeoutRef = useRef(null);
  const [tooltipPositions, setTooltipPositions] = useState(() => {
    const defaults = {
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
    };
    const saved = localStorage.getItem('buttonMappingTooltipPositions');
    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
    }
    return defaults;
  });

  // Leader line positions - control points for the SVG paths
  const [leaderLinePositions, setLeaderLinePositions] = useState(() => {
    // Default leader line paths - store as arrays of {x, y} points
    const defaults = {
      leftStick: [
        { x: 80.3, y: 143.5 },
        { x: 152.4, y: 143.5 },
        { x: 330.6, y: -27.8 }
      ],
      leftBumper: [
        { x: 270.6, y: 122.2 },
        { x: 151.7, y: 80.8 },
        { x: 79.5, y: 80.8 }
      ],
      dPadUp: [
        { x: 262.7, y: 136.8 },
        { x: 153.3, y: 157.3 },
        { x: 81.1, y: 157.3 }
      ],
      dPadLeft: [
        { x: 220.7, y: 193.3 },
        { x: 153.8, y: 223.9 },
        { x: 79.9, y: 223.9 }
      ],
      dPadDown: [
        { x: 263.7, y: 220.2 },
        { x: 153.7, y: 264.1 },
        { x: 79.2, y: 264.1 }
      ],
      dPadRight: [
        { x: 313.3, y: 202.9 },
        { x: 152.9, y: 332.4 },
        { x: 79.8, y: 332.4 }
      ],
      rightBumper: [
        { x: 611, y: 58 },
        { x: 543.1, y: 58 },
        { x: 440, y: 99.5 }
      ],
      buttonY: [
        { x: 612.4, y: 51.6 },
        { x: 545.9, y: 51.6 },
        { x: 442.7, y: 26 }
      ],
      buttonB: [
        { x: -152.3, y: -7.8 },
        { x: -91.6, y: 23.5 },
        { x: -24.8, y: 23.5 }
      ],
      buttonX: [
        { x: 358, y: 54 },
        { x: 390.7, y: 88.1 },
        { x: 552.2, y: 217.6 },
        { x: 613.8, y: 217.6 }
      ],
      buttonA: [
        { x: 612.4, y: 161.7 },
        { x: 548.4, y: 161.7 },
        { x: 441, y: 127.4 }
      ],
      rightStick: [
        { x: 612.4, y: 317.7 },
        { x: 553.6, y: 317.7 },
        { x: 371.9, y: 145.3 }
      ],
      buttonShare: [
        { x: 351.1, y: 201.7 },
        { x: 152.8, y: 378.6 },
        { x: 79.8, y: 378.6 }
      ],
      viewButton: [
        { x: -41.2, y: 2.2 },
        { x: 33.8, y: 2.2 },
        { x: 201.6, y: 15.1 }
      ],
      menuButton: [
        { x: 635.8, y: 176.5 },
        { x: 568.9, y: 176.5 },
        { x: 419.5, y: 190.7 }
      ],
      profileButton: [
        { x: 733.2, y: 371.1 },
        { x: 672.6, y: 371.1 },
        { x: 466.1, y: 196.5 }
      ]
    };
    const saved = localStorage.getItem('buttonMappingLeaderLinePositions');
    if (saved) {
      return { ...defaults, ...JSON.parse(saved) };
    }
    return defaults;
  });

  const saveToHistory = useCallback(() => {
    const newState = {
      tooltipPositions: JSON.parse(JSON.stringify(tooltipPositions)),
      leaderLinePositions: JSON.parse(JSON.stringify(leaderLinePositions)),
      hotspotPositions: JSON.parse(JSON.stringify(hotspotPositions))
    };

    // Remove any states after current index (when undoing then making new change)
    setEditHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);

      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });

    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [tooltipPositions, leaderLinePositions, hotspotPositions, historyIndex]);

  const debouncedSaveToHistory = useCallback(() => {
    if (saveHistoryTimeoutRef.current) {
      clearTimeout(saveHistoryTimeoutRef.current);
    }
    saveHistoryTimeoutRef.current = setTimeout(() => {
      saveToHistory();
    }, 500); // Save to history 500ms after user stops dragging
  }, [saveToHistory]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = editHistory[newIndex];
      setTooltipPositions(state.tooltipPositions);
      setLeaderLinePositions(state.leaderLinePositions);
      setHotspotPositions(state.hotspotPositions);
    }
  };

  const handleRedo = () => {
    if (historyIndex < editHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = editHistory[newIndex];
      setTooltipPositions(state.tooltipPositions);
      setLeaderLinePositions(state.leaderLinePositions);
      setHotspotPositions(state.hotspotPositions);
    }
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode - save positions
      localStorage.setItem('buttonMappingTooltipPositions', JSON.stringify(tooltipPositions));
      localStorage.setItem('buttonMappingLeaderLinePositions', JSON.stringify(leaderLinePositions));
      localStorage.setItem('hotspotPositions', JSON.stringify(hotspotPositions));
      console.log('✅ Hotspot, tooltip, and leader line positions saved!');
      // Clear history when exiting edit mode
      setEditHistory([]);
      setHistoryIndex(-1);
    } else {
      // Entering edit mode - save initial state
      const initialState = {
        tooltipPositions: JSON.parse(JSON.stringify(tooltipPositions)),
        leaderLinePositions: JSON.parse(JSON.stringify(leaderLinePositions)),
        hotspotPositions: JSON.parse(JSON.stringify(hotspotPositions))
      };
      setEditHistory([initialState]);
      setHistoryIndex(0);
    }
    setIsEditMode(!isEditMode);
  };

  const handlePresetClick = () => {
    setIsPresetModalOpen(true);
  };

  const handlePresetSave = (presetId) => {
    setCurrentPreset(presetId);
    localStorage.setItem('currentPreset', presetId);
    setIsPresetModalOpen(false);

    // Load saved settings for the new profile
    const savedMappings = localStorage.getItem(`buttonMappings_${presetId}`);
    const savedTooltips = localStorage.getItem(`tooltipAssignments_${presetId}_${presetConfig}`);

    if (savedMappings) {
      const loadedMappings = JSON.parse(savedMappings);
      setAssignments(loadedMappings);
    } else {
      // Reset to defaults if no saved data
      const defaults = {};
      buttonMappings.forEach(btn => {
        defaults[btn.id] = btn.defaultAssignment;
      });
      setAssignments(defaults);
    }

    const defaults = getDefaultTooltipAssignments(presetConfig);
    if (savedTooltips) {
      const loadedTooltips = JSON.parse(savedTooltips);
      // Merge with defaults to include any new keys
      setTooltipAssignments({...defaults, ...loadedTooltips});
    } else {
      // Clear old format key if it exists
      localStorage.removeItem(`tooltipAssignments_${presetId}`);
      // Reset to defaults if no saved data
      setTooltipAssignments({...defaults});
    }

    // Set saved settings baseline to the newly loaded data
    setTimeout(() => {
      setSavedSettings({
        assignments: savedMappings ? JSON.parse(savedMappings) : assignments,
        tooltipAssignments: savedTooltips ? JSON.parse(savedTooltips) : tooltipAssignments
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
      assignments: { ...assignments },
      tooltipAssignments: { ...tooltipAssignments }
    });
    setHasLocalChanges(false);
    setHasUnsavedChanges(false);
    localStorage.setItem('hasUnsavedChanges', 'false');
    // Dispatch custom event so other pages can update
    window.dispatchEvent(new CustomEvent('unsavedChangesUpdated', { detail: { hasChanges: false } }));

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

  // One-time cleanup of old localStorage format
  useEffect(() => {
    // Clear old format keys that don't have preset config suffix
    const profiles = ['desktop', 'fps', 'figma', 'marvelRivals', 'p1', 'p2', 'p3'];
    profiles.forEach(profile => {
      const oldKey = `tooltipAssignments_${profile}`;
      if (localStorage.getItem(oldKey)) {
        localStorage.removeItem(oldKey);
      }
    });
  }, []); // Run once on mount

  // Initialize saved settings
  useEffect(() => {
    if (savedSettings === null) {
      const globalFlag = localStorage.getItem('hasUnsavedChanges') === 'true';

      // Always initialize with current state
      setSavedSettings({
        assignments: { ...assignments },
        tooltipAssignments: { ...tooltipAssignments }
      });

      // If global flag is false, a save happened elsewhere - accept current state as saved
      // Otherwise, preserve the global flag state
      setHasUnsavedChanges(globalFlag);
      setHasLocalChanges(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSettings]); // Only depend on savedSettings to run once on mount

  // Track changes
  useEffect(() => {
    if (savedSettings === null) return;

    const hasChanges =
      JSON.stringify(assignments) !== JSON.stringify(savedSettings.assignments) ||
      JSON.stringify(tooltipAssignments) !== JSON.stringify(savedSettings.tooltipAssignments);

    // Only update and dispatch if hasChanges actually changed
    if (hasChanges !== previousHasChangedRef.current) {
      previousHasChangedRef.current = hasChanges;

      // Track local changes for this page
      setHasLocalChanges(hasChanges);
      setHasUnsavedChanges(hasChanges);
      // Sync to localStorage so other pages know about unsaved changes
      localStorage.setItem('hasUnsavedChanges', hasChanges.toString());
      // Dispatch custom event so other pages can listen
      window.dispatchEvent(new CustomEvent('unsavedChangesUpdated', { detail: { hasChanges } }));
    }
  }, [assignments, tooltipAssignments, savedSettings]);

  // Persist assignments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`buttonMappings_${currentPreset}`, JSON.stringify(assignments));
  }, [assignments, currentPreset]);

  // Update tooltip assignments when preset config changes
  useEffect(() => {
    const saved = localStorage.getItem(`tooltipAssignments_${currentPreset}_${presetConfig}`);
    const defaults = getDefaultTooltipAssignments(presetConfig);
    if (saved) {
      // Load saved customizations for this preset, merged with defaults
      setTooltipAssignments({...defaults, ...JSON.parse(saved)});
    } else {
      // Load preset-specific defaults
      setTooltipAssignments({...defaults});
    }
  }, [presetConfig, currentPreset]);

  // Save tooltip assignments with preset config key
  useEffect(() => {
    localStorage.setItem(`tooltipAssignments_${currentPreset}_${presetConfig}`, JSON.stringify(tooltipAssignments));
  }, [tooltipAssignments, currentPreset, presetConfig]);

  // Close preset dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(e.target)) {
        setPresetDropdownOpen(false);
      }
    };

    if (presetDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [presetDropdownOpen]);

  // Global sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentPreset' && e.newValue) {
        setCurrentPreset(e.newValue);
        // Capture current settings as baseline when profile changes from another page
        setSavedSettings({
          assignments: { ...assignments },
          tooltipAssignments: { ...tooltipAssignments }
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
  }, [assignments, tooltipAssignments]);

  // Ref to hold current state values for event listener
  const currentStateRef = useRef({ assignments, tooltipAssignments });
  useEffect(() => {
    currentStateRef.current = { assignments, tooltipAssignments };
  }, [assignments, tooltipAssignments]);

  // Gamepad button polling for tooltip hover states
  useEffect(() => {
    const gamepadButtonMap = {
      0: 'buttonA',
      1: 'buttonB',
      2: 'buttonX',
      3: 'buttonY',
      4: 'leftBumper',
      5: 'rightBumper',
      10: 'leftStick',
      11: 'rightStick',
      12: 'dPadUp',
      13: 'dPadDown',
      14: 'dPadLeft',
      15: 'dPadRight',
    };

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (gamepad) {
        gamepad.buttons.forEach((button, index) => {
          const buttonKey = `${index}`;
          let tooltipId = gamepadButtonMap[index];

          // Handle triggers differently in Back view (reversed)
          if (viewMode === 'back') {
            if (index === 6) tooltipId = 'buttonY';  // Left Trigger -> Left Trigger tooltip
            if (index === 7) tooltipId = 'dPadUp';   // Right Trigger -> Right Trigger tooltip
          }

          if (button.pressed && !lastPressedButtons.current.has(buttonKey)) {
            lastPressedButtons.current.add(buttonKey);
            if (tooltipId) {
              setHoveredTooltipId(tooltipId);
            }
          } else if (!button.pressed && lastPressedButtons.current.has(buttonKey)) {
            lastPressedButtons.current.delete(buttonKey);
            if (tooltipId && hoveredTooltipId === tooltipId) {
              setHoveredTooltipId(null);
            }
          }
        });
      }

      gamepadRafRef.current = requestAnimationFrame(pollGamepad);
    };

    gamepadRafRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      if (gamepadRafRef.current) {
        cancelAnimationFrame(gamepadRafRef.current);
        gamepadRafRef.current = null;
      }
    };
  }, [hoveredTooltipId, viewMode]);

  // Listen for updates from other pages
  useEffect(() => {
    const handleUnsavedChangesUpdate = (event) => {
      setHasUnsavedChanges(event.detail.hasChanges);
      // If another page saved, update our saved settings to current state
      if (!event.detail.hasChanges) {
        const current = currentStateRef.current;
        setSavedSettings({
          assignments: { ...current.assignments },
          tooltipAssignments: { ...current.tooltipAssignments }
        });
        setHasLocalChanges(false);
      }
    };

    window.addEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
    return () => window.removeEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
  }, []); // No dependencies - listener registered once

  // Keyboard shortcuts for undo/redo in edit mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditMode) return;

      // Cmd+Z or Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Cmd+Shift+Z or Ctrl+Shift+Z for redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, historyIndex, editHistory]);

  // Track position changes and save to history (debounced)
  useEffect(() => {
    if (isEditMode && historyIndex >= 0) {
      debouncedSaveToHistory();
    }
  }, [tooltipPositions, leaderLinePositions, hotspotPositions, isEditMode]);

  // Close reset button when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close reset button if clicking outside of tooltips
      if (showResetButton && !e.target.closest('[data-reset-button]') && !e.target.closest('[data-tooltip]')) {
        setShowResetButton(null);
      }
    };

    if (showResetButton) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showResetButton]);

  const filteredButtons = buttonMappings.filter(btn =>
    btn.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get default assignments for current preset (used for isModified checks)
  const defaultTooltipAssignments = getDefaultTooltipAssignments(presetConfig);

  return (
    <div className="bg-black flex flex-col h-screen w-full">
      <style>{`
        .custom-scrollbar {
          overflow: overlay;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #242424;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333333;
        }
      `}</style>
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

      {/* Main content */}
      <div className="flex-1 flex gap-4 overflow-hidden pb-8 px-8 pt-4">
        {/* Left Panel */}
        <div className="w-[420px] flex flex-col gap-2 shrink-0">
          {/* Profile Selector */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl w-full">
            <ProfileSelector
              currentPreset={currentPreset}
              hasUnsavedChanges={hasUnsavedChanges}
              onPresetClick={handlePresetClick}
              onSaveSettings={handleSaveSettings}
            />
          </div>

          {/* Button Remapping Panel */}
          <div className="bg-[#1a1a1a] rounded-2xl flex-1 flex flex-col overflow-hidden w-full">
            {/* Header */}
            <div className="p-6 pb-0">
              <h2 className="font-logitech font-bold text-[#e6e6e6] text-[20px] tracking-[-0.42px] leading-[1.3]">
                Button Remapping
              </h2>
              <p className="font-logitech text-[13px] text-[#8e8e8f] mt-2 leading-[1.3]">
                Choose a preset or customize your controller
              </p>
            </div>

            {/* Front/Back Segmented Control */}
            <div className="px-6 pt-6">
              <div className="border border-[#2e2e2e] flex gap-1 items-center p-1 rounded-lg mb-6">
                <button
                  onClick={() => setViewMode('front')}
                  className={`flex-1 h-8 flex items-center justify-center px-4 rounded transition-colors ${
                    viewMode === 'front'
                      ? 'bg-[#042f44] text-[#00b6fa] font-bold'
                      : 'text-[#a7a7a8] hover:bg-[#2e2e2e]'
                  }`}
                >
                  <span className="font-logitech text-[14px] tracking-[-0.42px] leading-[1.3]">Front</span>
                </button>
                <button
                  onClick={() => setViewMode('back')}
                  className={`flex-1 h-8 flex items-center justify-center px-4 rounded transition-colors ${
                    viewMode === 'back'
                      ? 'bg-[#042f44] text-[#00b6fa] font-bold'
                      : 'text-[#a7a7a8] hover:bg-[#2e2e2e]'
                  }`}
                >
                  <span className="font-logitech text-[14px] tracking-[-0.42px] leading-[1.3]">Back</span>
                </button>
              </div>
            </div>

            {/* Preset Dropdown */}
            <div className="px-6 relative" ref={presetDropdownRef}>
              <div className="flex items-center justify-between mb-[15px]">
                <span className="font-logitech text-[14px] text-white font-bold tracking-[-0.42px] leading-[1.3]">Preset</span>
              </div>
              <div className="relative group">
                <div
                  className={`bg-[#2e2e2e] h-10 px-2 flex items-center justify-between cursor-pointer relative rounded-lg transition-all overflow-hidden ${
                    presetDropdownOpen
                      ? 'border border-[#00b6fa]'
                      : 'border border-transparent'
                  }`}
                  onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-2 relative z-10">
                    <div className="relative shrink-0 w-4 h-4">
                      <img alt="" className="w-full h-full object-contain" src={presetConfig === 'Default' ? '/figmaAssets/profile-icon.svg' : '/figmaAssets/game-icon.svg'} />
                    </div>
                    <span className={`text-[14px] tracking-[-0.42px] leading-[1.3] font-logitech transition-colors ${
                      presetDropdownOpen
                        ? 'text-[#e6e6e6] font-bold'
                        : 'text-[#a7a7a8] group-hover:text-[#e6e6e6]'
                    }`}>{presetConfig}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#a7a7a8] transition-transform relative z-10" style={{
                    transform: presetDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </div>
              </div>

              {/* Dropdown List */}
              {presetDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-6 right-6 bg-[#2e2e2e] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
                  {['Default', 'FPS config', 'Racing config'].map((option) => {
                    const isSelected = option === presetConfig;
                    const iconSrc = option === 'Default' ? '/figmaAssets/profile-icon.svg' : '/figmaAssets/game-icon.svg';
                    return (
                      <div
                        key={option}
                        className={`h-10 px-3 flex items-center gap-2 cursor-pointer text-[14px] tracking-[-0.42px] font-logitech transition-colors relative overflow-hidden group ${
                          isSelected ? 'text-[#00b6fa]' : 'text-[#a7a7a8]'
                        }`}
                        onClick={() => {
                          setPresetConfig(option);
                          setPresetDropdownOpen(false);
                        }}
                      >
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="relative shrink-0 w-4 h-4 z-10">
                          <img alt="" className="w-full h-full object-contain" src={iconSrc} />
                        </div>
                        <span className="relative z-10">{option}</span>
                      </div>
                    );
                  })}

                  {/* Divider */}
                  <div className="h-px bg-[#404040] mx-3" />

                  {/* Preset Action Buttons */}
                  <div className="px-3 py-[10px] flex flex-col gap-[10px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPresetDropdownOpen(false);
                        // TODO: Add create preset functionality
                        console.log('Create preset clicked');
                      }}
                      className="bg-[#00b6fa] h-8 flex items-center justify-center rounded-[4px] hover:bg-[#00a0e0] transition-colors w-full"
                    >
                      <span className="font-logitech font-bold text-[#1a1a1a] text-[11px] tracking-[0.275px] uppercase leading-[11px]">
                        CREATE
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPresetDropdownOpen(false);
                        // TODO: Add import preset functionality
                        console.log('Import preset clicked');
                      }}
                      className="border-2 border-[#4d4d4d] h-8 flex items-center justify-center rounded-[4px] hover:border-[#666] transition-colors w-full"
                    >
                      <span className="font-logitech font-bold text-[#e6e6e6] text-[11px] tracking-[0.275px] uppercase leading-[11px]">
                        IMPORT
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="py-6 px-6">
              <div className="h-px bg-[#37383b] w-full" />
            </div>

            {/* Search */}
            <div className="px-6 pb-4">
              <button
                onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
                className="flex items-center justify-between mb-[15px] w-full"
              >
                <span className="font-logitech text-[14px] text-white font-bold tracking-[-0.42px] leading-[1.3]">Library</span>
                <div className={`relative w-6 h-6 transition-transform duration-200 ${isLibraryExpanded ? 'rotate-0' : 'rotate-180'}`}>
                  <div className="absolute inset-[37.5%_29.17%]">
                    <img src="/figmaAssets/chevron-up-small-correct.svg" alt="" className="absolute block max-w-none w-full h-full" />
                  </div>
                </div>
              </button>
              {isLibraryExpanded && <div
                className={`bg-[#2e2e2e] h-10 rounded-lg flex items-center px-2 gap-2 transition-all relative overflow-hidden group ${
                  searchQuery ? 'border border-[#00b6fa]' : 'border border-transparent'
                }`}
                style={{ width: '100%' }}
              >
                {/* Hover state overlay */}
                <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />

                {/* Content */}
                <div className="relative flex items-center gap-2 flex-1">
                  <Search className="w-4 h-4 text-[#a7a7a8] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 bg-transparent text-[14px] outline-none font-logitech tracking-[-0.42px] leading-[1.3] placeholder:text-[#8e8e8f] ${
                      searchQuery ? 'text-[#e6e6e6]' : 'text-[#8e8e8f]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSearchQuery('');
                      }}
                      className="w-6 h-6 flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity relative z-10"
                      aria-label="Clear search"
                      type="button"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 7L17 17M17 7L7 17"
                          stroke="#a7a7a8"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>}
            </div>

            {isLibraryExpanded && <div className="px-6 pb-4">
              <div className="flex border-2 border-[#2e2e2e] rounded-lg p-1 gap-1">
                {Object.keys(categoryActions).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-1 h-8 text-[14px] tracking-[-0.42px] leading-[1.3] rounded transition-colors font-logitech ${
                      activeCategory === category
                        ? 'bg-[#042f44] text-[#00b6fa] font-bold'
                        : 'text-[#a7a7a8] hover:bg-[#2e2e2e]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>}

            {isLibraryExpanded && <div className="flex-1 overflow-hidden relative">
              <div
                className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar absolute inset-0 px-6 pb-6"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'transparent transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.scrollbarColor = '#242424 transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.scrollbarColor = 'transparent transparent';
                }}
              >
                <div className="flex flex-col gap-1">
                {categoryActions[activeCategory]
                  .filter(action =>
                    action.label.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((action) => (
                    <div
                      key={action.id}
                      draggable
                      onDragStart={(e) => {
                        const buttonData = buttonMappings.find(b => b.id === action.id) || {
                          id: action.id,
                          label: action.label,
                          defaultAssignment: action.label
                        };
                        handleDragStart(e, buttonData);
                      }}
                      onDrag={handleDrag}
                      onDragEnd={handleDragEnd}
                      className={`bg-[#242424] h-[48px] rounded-lg flex items-center gap-2 p-2 transition-colors cursor-grab active:cursor-grabbing group select-none ${
                        draggingId !== action.id ? 'hover:bg-[#4B4B4B]' : 'opacity-30'
                      }`}
                      style={{ userSelect: 'none' }}
                    >
                      {/* Drag icon */}
                      <div className="w-[20px] h-[48px] border-r border-[#2e2e2e] flex items-center justify-start pl-[2px] shrink-0" style={{ pointerEvents: 'none' }}>
                        <div className="w-[11px] h-[18px] relative">
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-0 top-0 transition-colors" />
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-[7px] top-0 transition-colors" />
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-0 top-[7px] transition-colors" />
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-[7px] top-[7px] transition-colors" />
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-0 top-[14px] transition-colors" />
                          <div className="absolute w-1 h-1 rounded-full bg-[#666] group-hover:bg-[#CCCCCC] left-[7px] top-[14px] transition-colors" />
                        </div>
                      </div>

                      {/* Label without icon */}
                      <div className="flex items-center flex-1 pl-2" style={{ pointerEvents: 'none' }}>
                        <span className="text-[#e6e6e6] text-[14px] font-logitech tracking-[-0.42px] leading-[1.3]">
                          {action.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>}
          </div>
        </div>

        {/* Right Panel - Controller View */}
        <div className="flex-1 flex flex-col">
          {/* Edit Mode Toggle */}
          <div className="flex justify-end gap-2 items-center mb-2">
            {isEditMode && (
              <div className="flex gap-2">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`px-3 py-2 rounded-lg font-logitech font-bold text-sm transition-colors ${
                    historyIndex > 0
                      ? 'bg-[#242424] text-white hover:bg-[#333]'
                      : 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                  }`}
                  title="Undo (Cmd+Z)"
                >
                  ↶ Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= editHistory.length - 1}
                  className={`px-3 py-2 rounded-lg font-logitech font-bold text-sm transition-colors ${
                    historyIndex < editHistory.length - 1
                      ? 'bg-[#242424] text-white hover:bg-[#333]'
                      : 'bg-[#1a1a1a] text-[#666] cursor-not-allowed'
                  }`}
                  title="Redo (Cmd+Shift+Z)"
                >
                  ↷ Redo
                </button>
              </div>
            )}
            <button
              onClick={handleToggleEditMode}
              className={`px-4 py-2 rounded-lg font-logitech font-bold text-sm transition-colors ${
                isEditMode
                  ? 'bg-primary-default text-black'
                  : 'bg-[#242424] text-white hover:bg-[#333]'
              }`}
            >
              {isEditMode ? 'Save & Exit Edit Mode' : 'Edit Layout'}
            </button>
            {isEditMode && (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#242424]">
                  <span className="font-logitech font-bold text-sm text-white">Controller Y Offset:</span>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={controllerYOffset}
                    onChange={(e) => setControllerYOffset(parseInt(e.target.value))}
                    className="w-48"
                  />
                  <input
                    type="number"
                    value={controllerYOffset}
                    onChange={(e) => setControllerYOffset(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 rounded bg-[#333] text-white font-logitech text-sm text-center"
                  />
                  <span className="font-logitech text-sm text-[#a7a7a8]">px</span>
                </div>
                <button
                  onClick={() => {
                    console.log('=== TOOLTIP POSITIONS ===');
                    Object.entries(tooltipPositions).forEach(([name, pos]) => {
                      console.log(`${name}: { left: ${pos.left}, top: ${pos.top} },`);
                    });
                    console.log('========================');
                  }}
                  className="px-4 py-2 rounded-lg font-logitech font-bold text-sm bg-[#242424] text-white hover:bg-[#333] transition-colors"
                >
                  Copy Tooltip Positions
                </button>
                <button
                  onClick={() => {
                    console.log('=== LEADER LINE POSITIONS ===');
                    Object.entries(leaderLinePositions).forEach(([name, points]) => {
                      const pointsStr = points.map(p => `{ x: ${p.x}, y: ${p.y} }`).join(', ');
                      console.log(`${name}: [${pointsStr}],`);
                    });
                    console.log('============================');
                  }}
                  className="px-4 py-2 rounded-lg font-logitech font-bold text-sm bg-[#242424] text-white hover:bg-[#333] transition-colors"
                >
                  Copy Leader Line Positions
                </button>
                <button
                  onClick={() => {
                    console.log('=== HOTSPOT POSITIONS ===');
                    Object.entries(hotspotPositions).forEach(([name, pos]) => {
                      console.log(`'${name}': { left: ${pos.left}, top: ${pos.top} },`);
                    });
                    console.log('========================');
                  }}
                  className="px-4 py-2 rounded-lg font-logitech font-bold text-sm bg-[#242424] text-white hover:bg-[#333] transition-colors"
                >
                  Copy Hotspot Positions
                </button>
              </>
            )}
          </div>

          {/* Status Widget */}
          <DeviceStatusWidget />

          {/* Controller visualization centered below */}
          <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 48px - 64px - 32px - 16px - 48px)', marginTop: '16px' }}>
          <div className="relative w-[1188px] h-[771px]" ref={controllerRef}>
            {/* Controller with leader lines and dots */}
            <img
              src="/ghost-controller-white.png"
              alt="Ghost Controller with leader lines"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ pointerEvents: 'none', transform: `translateY(${controllerYOffset}px)` }}
            />


            {/* Hotspots at line endpoints - using positions from Home page */}
            {/* LD1 - Left Stick */}
            <HotspotMarker
              key={`LD1-${viewMode}`}
              name="LD1"
              style={{ left: `${hotspotPositions['Left Stick'].left}px`, top: `${hotspotPositions['Left Stick'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'leftStick'}
              tooltipId="leftStick"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'Left Stick': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* LB - Left Bumper */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LB"
                style={{ left: `${hotspotPositions['Left Bumper'].left}px`, top: `${hotspotPositions['Left Bumper'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'leftBumper'}
                tooltipId="leftBumper"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Left Bumper': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* LD2 - D Pad Up */}
            <HotspotMarker
              key={`LD2-${viewMode}`}
              name="LD2"
              style={{ left: `${hotspotPositions['D Pad Up'].left}px`, top: `${hotspotPositions['D Pad Up'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'dPadUp'}
              tooltipId="dPadUp"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'D Pad Up': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* LD3 - D Pad Down */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LD3"
                style={{ left: `${hotspotPositions['D Pad Left'].left}px`, top: `${hotspotPositions['D Pad Left'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'dPadDown'}
                tooltipId="dPadDown"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'D Pad Left': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* LD4 - D Pad Left */}
            <HotspotMarker
              key={`LD4-${viewMode}`}
              name="LD4"
              style={{ left: `${hotspotPositions['D Pad Down'].left}px`, top: `${hotspotPositions['D Pad Down'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'dPadLeft'}
              tooltipId="dPadLeft"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'D Pad Down': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* LD5 - D Pad Right */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LD5"
                style={{ left: `${hotspotPositions['D Pad Right'].left}px`, top: `${hotspotPositions['D Pad Right'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'dPadRight'}
                tooltipId="dPadRight"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'D Pad Right': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* RB - Right Bumper */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RB"
                style={{ left: `${hotspotPositions['Right Bumper'].left}px`, top: `${hotspotPositions['Right Bumper'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'rightBumper'}
                tooltipId="rightBumper"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Right Bumper': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* RD1 - Button Y */}
            <HotspotMarker
              name="RD1"
              style={{ left: `${hotspotPositions['Button Y'].left}px`, top: `${hotspotPositions['Button Y'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'buttonY'}
              tooltipId="buttonY"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'Button Y': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* RD2 - Button B */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RD2"
                style={{ left: `${hotspotPositions['Button B'].left}px`, top: `${hotspotPositions['Button B'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'buttonB'}
                tooltipId="buttonB"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Button B': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* RD3 - Button X */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RD3"
                style={{ left: `${hotspotPositions['Button X'].left}px`, top: `${hotspotPositions['Button X'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'buttonX'}
                tooltipId="buttonX"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Button X': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* RD4 - Fourth from top right dot */}
            {/* RD4 - Button A */}
            <HotspotMarker
              key={`RD4-${viewMode}`}
              name="RD4"
              style={{ left: `${hotspotPositions['Button A'].left}px`, top: `${hotspotPositions['Button A'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'buttonA'}
              tooltipId="buttonA"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'Button A': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* RD5 - Right Stick */}
            <HotspotMarker
              key={`RD5-${viewMode}`}
              name="RD5"
              style={{ left: `${hotspotPositions['Right Stick'].left}px`, top: `${hotspotPositions['Right Stick'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'rightStick'}
              tooltipId="rightStick"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'Right Stick': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* Share Button */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="SHARE"
                style={{ left: `${hotspotPositions['Button Share'].left}px`, top: `${hotspotPositions['Button Share'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'buttonShare'}
                tooltipId="buttonShare"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Button Share': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}


            {/* View Button */}
            <HotspotMarker
              name="View Button"
              style={{ left: `${hotspotPositions['View Button'].left}px`, top: `${hotspotPositions['View Button'].top + controllerYOffset}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'viewButton'}
              tooltipId="viewButton"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setHotspotPositions(prev => ({
                  ...prev,
                  'View Button': { left: newPos.left, top: newPos.top - controllerYOffset }
                }));
              }}
            />

            {/* Menu Button */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="Menu Button"
                style={{ left: `${hotspotPositions['Menu Button'].left}px`, top: `${hotspotPositions['Menu Button'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'menuButton'}
                tooltipId="menuButton"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Menu Button': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* Profile Button */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="Profile Button"
                style={{ left: `${hotspotPositions['Profile Button'].left}px`, top: `${hotspotPositions['Profile Button'].top + controllerYOffset}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'profileButton'}
                tooltipId="profileButton"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
                isEditMode={isEditMode}
                onPositionChange={(newPos) => {
                  setHotspotPositions(prev => ({
                    ...prev,
                    'Profile Button': { left: newPos.left, top: newPos.top - controllerYOffset }
                  }));
                }}
              />
            )}

            {/* All Leader Lines in one SVG layer */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', zIndex: 1, overflow: 'visible', transform: `translateY(${controllerYOffset}px)` }}>
              {/* L1 - Top Left (Left Stick) */}
              <LeaderLinePath
                points={leaderLinePositions.leftStick}
                lineId="leftStick"
                hoveredTooltipId={hoveredTooltipId}
                transform={viewMode !== 'back' ? 'scale(0.8085) translateY(250px) translateX(-60px)' : 'scale(0.8085) translateY(42px) translateX(-60px)'}
              />

              {/* LB - Left Bumper */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.leftBumper}
                  lineId="leftBumper"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-55px) translateX(-60px)"
                />
              )}

              {/* L2 - Second from Top Left (D Pad Up) */}
              <LeaderLinePath
                points={leaderLinePositions.dPadUp}
                lineId="dPadUp"
                hoveredTooltipId={hoveredTooltipId}
                transform={viewMode !== 'back' ? 'scale(0.8085) translateY(-30px) translateX(-60px)' : 'scale(0.8085) translateY(-38px) translateX(-60px)'}
              />

              {/* L3 - Middle Left (D Pad Left) */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.dPadLeft}
                  lineId="dPadLeft"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-42px) translateX(-60px)"
                />
              )}

              {/* L4 - Fourth from Top Left (D Pad Down) */}
              <LeaderLinePath
                points={leaderLinePositions.dPadDown}
                lineId="dPadDown"
                hoveredTooltipId={hoveredTooltipId}
                transform={viewMode !== 'back' ? 'scale(0.8085) translateY(-30px) translateX(-60px)' : 'scale(0.8085) translateY(-50px) translateX(-60px)'}
              />

              {/* L5 - Bottom Left (D Pad Right) */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.dPadRight}
                  lineId="dPadRight"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-45px) translateX(-60px)"
                />
              )}

              {/* RB - Right Bumper */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.rightBumper}
                  lineId="rightBumper"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-35px) translateX(60px)"
                />
              )}

              {/* R1 - Top Right (Button Y) */}
              <LeaderLinePath
                points={leaderLinePositions.buttonY}
                lineId="buttonY"
                hoveredTooltipId={hoveredTooltipId}
                transform="scale(0.8085) translateY(77px) translateX(60px)"
              />

              {/* R2 - Second from Top Right (Button B) */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.buttonB}
                  lineId="buttonB"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(158px) translateX(698px)"
                />
              )}

              {/* R3 - Middle Right (Button X) */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.buttonX}
                  lineId="buttonX"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(73px) translateX(60px)"
                />
              )}

              {/* R4 - Fourth from Top Right (Button A) */}
              <LeaderLinePath
                points={leaderLinePositions.buttonA}
                lineId="buttonA"
                hoveredTooltipId={hoveredTooltipId}
                transform={viewMode !== 'back' ? 'scale(0.8085) translateY(73px) translateX(60px)' : 'scale(0.8085) translateY(-132px) translateX(60px)'}
              />

              {/* R5 - Bottom Right (Right Stick) */}
              <LeaderLinePath
                points={leaderLinePositions.rightStick}
                lineId="rightStick"
                hoveredTooltipId={hoveredTooltipId}
                transform={viewMode !== 'back' ? 'scale(0.8085) translateY(77px) translateX(60px)' : 'scale(0.8085) translateY(-130px) translateX(60px)'}
              />

              {/* Share Button */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.buttonShare}
                  lineId="buttonShare"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-40px) translateX(-60px)"
                />
              )}

              {/* View Button */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.viewButton}
                  lineId="viewButton"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(73px) translateX(60px)"
                />
              )}

              {/* Menu Button */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.menuButton}
                  lineId="menuButton"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-100px) translateX(36px)"
                />
              )}

              {/* Profile Button */}
              {viewMode !== 'back' && (
                <LeaderLinePath
                  points={leaderLinePositions.profileButton}
                  lineId="profileButton"
                  hoveredTooltipId={hoveredTooltipId}
                  transform="scale(0.8085) translateY(-30px) translateX(-60px)"
                />
              )}
            </svg>

            {/* All Control Points in one top layer */}
            <LeaderLineControlPoints
              lines={[
                {
                  id: 'leftStick',
                  points: leaderLinePositions.leftStick,
                  transform: viewMode !== 'back' ? 'scale(0.8085) translateY(250px) translateX(-60px)' : 'scale(0.8085) translateY(42px) translateX(-60px)'
                },
                ...(viewMode !== 'back' ? [{
                  id: 'leftBumper',
                  points: leaderLinePositions.leftBumper,
                  transform: 'scale(0.8085) translateY(-55px) translateX(-60px)'
                }] : []),
                {
                  id: 'dPadUp',
                  points: leaderLinePositions.dPadUp,
                  transform: viewMode !== 'back' ? 'scale(0.8085) translateY(-30px) translateX(-60px)' : 'scale(0.8085) translateY(-38px) translateX(-60px)'
                },
                ...(viewMode !== 'back' ? [{
                  id: 'dPadLeft',
                  points: leaderLinePositions.dPadLeft,
                  transform: 'scale(0.8085) translateY(-42px) translateX(-60px)'
                }] : []),
                {
                  id: 'dPadDown',
                  points: leaderLinePositions.dPadDown,
                  transform: viewMode !== 'back' ? 'scale(0.8085) translateY(-30px) translateX(-60px)' : 'scale(0.8085) translateY(-50px) translateX(-60px)'
                },
                ...(viewMode !== 'back' ? [{
                  id: 'dPadRight',
                  points: leaderLinePositions.dPadRight,
                  transform: 'scale(0.8085) translateY(-45px) translateX(-60px)'
                }] : []),
                ...(viewMode !== 'back' ? [{
                  id: 'rightBumper',
                  points: leaderLinePositions.rightBumper,
                  transform: 'scale(0.8085) translateY(-35px) translateX(60px)'
                }] : []),
                {
                  id: 'buttonY',
                  points: leaderLinePositions.buttonY,
                  transform: 'scale(0.8085) translateY(77px) translateX(60px)'
                },
                ...(viewMode !== 'back' ? [{
                  id: 'buttonB',
                  points: leaderLinePositions.buttonB,
                  transform: 'scale(0.8085) translateY(158px) translateX(698px)'
                }] : []),
                ...(viewMode !== 'back' ? [{
                  id: 'buttonX',
                  points: leaderLinePositions.buttonX,
                  transform: 'scale(0.8085) translateY(73px) translateX(60px)'
                }] : []),
                {
                  id: 'buttonA',
                  points: leaderLinePositions.buttonA,
                  transform: viewMode !== 'back' ? 'scale(0.8085) translateY(73px) translateX(60px)' : 'scale(0.8085) translateY(-132px) translateX(60px)'
                },
                {
                  id: 'rightStick',
                  points: leaderLinePositions.rightStick,
                  transform: viewMode !== 'back' ? 'scale(0.8085) translateY(77px) translateX(60px)' : 'scale(0.8085) translateY(-130px) translateX(60px)'
                },
                ...(viewMode !== 'back' ? [{
                  id: 'buttonShare',
                  points: leaderLinePositions.buttonShare,
                  transform: 'scale(0.8085) translateY(-40px) translateX(-60px)'
                }] : []),
                ...(viewMode !== 'back' ? [{
                  id: 'viewButton',
                  points: leaderLinePositions.viewButton,
                  transform: 'scale(0.8085) translateY(73px) translateX(60px)'
                }] : []),
                ...(viewMode !== 'back' ? [{
                  id: 'menuButton',
                  points: leaderLinePositions.menuButton,
                  transform: 'scale(0.8085) translateY(-100px) translateX(36px)'
                }] : []),
                ...(viewMode !== 'back' ? [{
                  id: 'profileButton',
                  points: leaderLinePositions.profileButton,
                  transform: 'scale(0.8085) translateY(-30px) translateX(-60px)'
                }] : [])
              ]}
              isEditMode={isEditMode}
              controllerYOffset={controllerYOffset}
              onLineUpdate={(lineId, pointIndex, newPoint) => {
                setLeaderLinePositions(prev => {
                  const newPoints = [...prev[lineId]];
                  newPoints[pointIndex] = newPoint;
                  return {
                    ...prev,
                    [lineId]: newPoints
                  };
                });
              }}
            />

            {/* Animated Tracing Layer - REMOVED (was causing weird animation on tooltips) */}

            {/* Tooltip next to top left leader line */}
            {showResetButton === 'leftStick' && (
              <ResetButton
                position={tooltipPositions.leftStick}
                align="right"
                onClick={() => handleResetTooltip('leftStick')}
              />
            )}
            <HotspotTooltip
              key={`leftStick-${viewMode}`}
              label={viewMode === 'back' ? 'Paddle' : 'Left Stick'}
              value={viewMode === 'back' ? 'Right Paddle 2' : tooltipAssignments.leftStick}
              position={tooltipPositions.leftStick}
              isActive={activeTooltip === 'leftStick'}
              isModified={tooltipAssignments.leftStick !== defaultTooltipAssignments.leftStick}
              isHoveredByDrag={hoveredTooltipIndex === 0}
              tooltipRef={(el) => tooltipRefs.current[0] = el}
              onClick={() => handleTooltipClick('leftStick', viewMode === 'back' ? 'Paddle' : 'Left Stick')}
              tooltipId="leftStick"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  leftStick: newPos
                }));
              }}
            />

            {/* Left Bumper Tooltip */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'leftBumper' && (
                  <ResetButton
                    position={tooltipPositions.leftBumper}
                    align="right"
                    onClick={() => handleResetTooltip('leftBumper')}
                  />
                )}
                <HotspotTooltip
                  label="Bumper"
                  value={tooltipAssignments.leftBumper}
                  position={tooltipPositions.leftBumper}
                  isActive={activeTooltip === 'leftBumper'}
                  isModified={tooltipAssignments.leftBumper !== defaultTooltipAssignments.leftBumper}
                  isHoveredByDrag={hoveredTooltipIndex === 1}
                  tooltipRef={(el) => tooltipRefs.current[1] = el}
                  onClick={() => handleTooltipClick('leftBumper', 'Bumper')}
                  tooltipId="leftBumper"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      leftBumper: newPos
                    }));
                  }}
                />
              </>
            )}

            {/* Tooltip 2 */}
            {(showResetButton === (viewMode === 'back' ? 'rightTrigger' : 'dPadUp')) && (
              <ResetButton
                position={tooltipPositions.dPadUp}
                align="right"
                onClick={() => handleResetTooltip(viewMode === 'back' ? 'rightTrigger' : 'dPadUp')}
              />
            )}
            <HotspotTooltip
              key={`dPadUp-${viewMode}`}
              label={viewMode === 'back' ? 'Trigger' : 'D Pad U'}
              value={viewMode === 'back' ? tooltipAssignments.rightTrigger : tooltipAssignments.dPadUp}
              position={tooltipPositions.dPadUp}
              isActive={activeTooltip === (viewMode === 'back' ? 'rightTrigger' : 'dPadUp')}
              isModified={viewMode === 'back' ? (tooltipAssignments.rightTrigger !== defaultTooltipAssignments.rightTrigger) : (tooltipAssignments.dPadUp !== defaultTooltipAssignments.dPadUp)}
              isHoveredByDrag={hoveredTooltipIndex === 2}
              tooltipRef={(el) => tooltipRefs.current[2] = el}
              onClick={() => handleTooltipClick(viewMode === 'back' ? 'rightTrigger' : 'dPadUp', viewMode === 'back' ? 'Trigger' : 'D Pad U')}
              tooltipId="dPadUp"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  dPadUp: newPos
                }));
              }}
            />

            {/* Tooltip 3 */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'dPadLeft' && (
                  <ResetButton
                    position={tooltipPositions.dPadLeft}
                    align="right"
                    onClick={() => handleResetTooltip('dPadLeft')}
                  />
                )}
                <HotspotTooltip
                  label="D Pad L"
                  value={tooltipAssignments.dPadLeft}
                  position={tooltipPositions.dPadLeft}
                  isActive={activeTooltip === 'dPadLeft'}
                  isModified={tooltipAssignments.dPadLeft !== defaultTooltipAssignments.dPadLeft}
                  isHoveredByDrag={hoveredTooltipIndex === 3}
                  tooltipRef={(el) => tooltipRefs.current[3] = el}
                  onClick={() => handleTooltipClick('dPadLeft', 'D Pad L')}
                  tooltipId="dPadLeft"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      dPadLeft: newPos
                    }));
                  }}
                />
              </>
            )}

            {/* Tooltip 4 */}
            {showResetButton === 'dPadDown' && (
              <ResetButton
                position={tooltipPositions.dPadDown}
                align="right"
                onClick={() => handleResetTooltip('dPadDown')}
              />
            )}
            <HotspotTooltip
              key={`dPadDown-${viewMode}`}
              label={viewMode === 'back' ? 'Paddle' : 'D Pad D'}
              value={viewMode === 'back' ? 'Right Paddle 1' : tooltipAssignments.dPadDown}
              position={tooltipPositions.dPadDown}
              isActive={activeTooltip === 'dPadDown'}
              isModified={tooltipAssignments.dPadDown !== defaultTooltipAssignments.dPadDown}
              isHoveredByDrag={hoveredTooltipIndex === 4}
              tooltipRef={(el) => tooltipRefs.current[4] = el}
              onClick={() => handleTooltipClick('dPadDown', viewMode === 'back' ? 'Paddle' : 'D Pad D')}
              tooltipId="dPadDown"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  dPadDown: newPos
                }));
              }}
            />

            {/* Tooltip 5 */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'dPadRight' && (
                  <ResetButton
                    position={tooltipPositions.dPadRight}
                    align="right"
                    onClick={() => handleResetTooltip('dPadRight')}
                  />
                )}
                <HotspotTooltip
                  label="D Pad R"
                  value={tooltipAssignments.dPadRight}
                  position={tooltipPositions.dPadRight}
                  isActive={activeTooltip === 'dPadRight'}
                  isModified={tooltipAssignments.dPadRight !== defaultTooltipAssignments.dPadRight}
                  isHoveredByDrag={hoveredTooltipIndex === 5}
                  tooltipRef={(el) => tooltipRefs.current[5] = el}
                  onClick={() => handleTooltipClick('dPadRight', 'D Pad R')}
                  tooltipId="dPadRight"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  dPadRight: newPos
                }));
              }}
                />
              </>
            )}

            {/* Right Bumper Tooltip */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'rightBumper' && (
                  <ResetButton
                    position={tooltipPositions.rightBumper}
                    align="left"
                    onClick={() => handleResetTooltip('rightBumper')}
                  />
                )}
                <HotspotTooltip
                  label="Bumper"
                  value={tooltipAssignments.rightBumper}
                  position={tooltipPositions.rightBumper}
                  isActive={activeTooltip === 'rightBumper'}
                  isModified={tooltipAssignments.rightBumper !== defaultTooltipAssignments.rightBumper}
                  align="left"
                  isHoveredByDrag={hoveredTooltipIndex === 6}
                  tooltipRef={(el) => tooltipRefs.current[6] = el}
                  onClick={() => handleTooltipClick('rightBumper', 'Bumper')}
                  tooltipId="rightBumper"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  rightBumper: newPos
                }));
              }}
                />
              </>
            )}

            {/* Tooltip 6 */}
            {(showResetButton === (viewMode === 'back' ? 'leftTrigger' : 'buttonY')) && (
              <ResetButton
                position={tooltipPositions.buttonY}
                align="left"
                onClick={() => handleResetTooltip(viewMode === 'back' ? 'leftTrigger' : 'buttonY')}
              />
            )}
            <HotspotTooltip
              key={`buttonY-${viewMode}`}
              label={viewMode === 'back' ? 'Trigger' : 'Button'}
              value={viewMode === 'back' ? tooltipAssignments.leftTrigger : tooltipAssignments.buttonY}
              position={tooltipPositions.buttonY}
              isActive={activeTooltip === (viewMode === 'back' ? 'leftTrigger' : 'buttonY')}
              isModified={viewMode === 'back' ? (tooltipAssignments.leftTrigger !== defaultTooltipAssignments.leftTrigger) : (tooltipAssignments.buttonY !== defaultTooltipAssignments.buttonY)}
              align="left"
              isHoveredByDrag={hoveredTooltipIndex === 7}
              tooltipRef={(el) => tooltipRefs.current[7] = el}
              onClick={() => handleTooltipClick(viewMode === 'back' ? 'leftTrigger' : 'buttonY', viewMode === 'back' ? 'Trigger' : 'Button')}
              tooltipId="buttonY"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  buttonY: newPos
                }));
              }}
            />

            {/* Tooltip 7 */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'buttonB' && (
                  <ResetButton
                    position={tooltipPositions.buttonB}
                    align="left"
                    onClick={() => handleResetTooltip('buttonB')}
                  />
                )}
                <HotspotTooltip
                  label="Button"
                  value={tooltipAssignments.buttonB}
                  position={tooltipPositions.buttonB}
                  isActive={activeTooltip === 'buttonB'}
                  isModified={tooltipAssignments.buttonB !== defaultTooltipAssignments.buttonB}
                  align="left"
                  isHoveredByDrag={hoveredTooltipIndex === 8}
                  tooltipRef={(el) => tooltipRefs.current[8] = el}
                  onClick={() => handleTooltipClick('buttonB', 'Button')}
                  tooltipId="buttonB"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  buttonB: newPos
                }));
              }}
                />
              </>
            )}

            {/* Tooltip 8 */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'buttonX' && (
                  <ResetButton
                    position={tooltipPositions.buttonX}
                    align="left"
                    onClick={() => handleResetTooltip('buttonX')}
                  />
                )}
                <HotspotTooltip
                  label="Button"
                  value={tooltipAssignments.buttonX}
                  position={tooltipPositions.buttonX}
                  isActive={activeTooltip === 'buttonX'}
                  isModified={tooltipAssignments.buttonX !== defaultTooltipAssignments.buttonX}
                  align="left"
                  isHoveredByDrag={hoveredTooltipIndex === 9}
                  tooltipRef={(el) => tooltipRefs.current[9] = el}
                  onClick={() => handleTooltipClick('buttonX', 'Button')}
                  tooltipId="buttonX"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  buttonX: newPos
                }));
              }}
                />
              </>
            )}

            {/* Tooltip 9 */}
            {showResetButton === 'buttonA' && (
              <ResetButton
                position={tooltipPositions.buttonA}
                align="left"
                onClick={() => handleResetTooltip('buttonA')}
              />
            )}
            <HotspotTooltip
              key={`buttonA-${viewMode}`}
              label={viewMode === 'back' ? 'Paddle' : 'Button'}
              value={viewMode === 'back' ? 'Left Paddle 1' : tooltipAssignments.buttonA}
              position={tooltipPositions.buttonA}
              isActive={activeTooltip === 'buttonA'}
              isModified={tooltipAssignments.buttonA !== defaultTooltipAssignments.buttonA}
              align="left"
              isHoveredByDrag={hoveredTooltipIndex === 10}
              tooltipRef={(el) => tooltipRefs.current[10] = el}
              onClick={() => handleTooltipClick('buttonA', viewMode === 'back' ? 'Paddle' : 'Button')}
              tooltipId="buttonA"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  buttonA: newPos
                }));
              }}
            />

            {/* Tooltip 10 */}
            {showResetButton === 'rightStick' && (
              <ResetButton
                position={tooltipPositions.rightStick}
                align="left"
                onClick={() => handleResetTooltip('rightStick')}
              />
            )}
            <HotspotTooltip
              key={`rightStick-${viewMode}`}
              label={viewMode === 'back' ? 'Paddle' : 'Right Stick'}
              value={viewMode === 'back' ? 'Left Paddle 2' : tooltipAssignments.rightStick}
              position={tooltipPositions.rightStick}
              isActive={activeTooltip === 'rightStick'}
              isModified={tooltipAssignments.rightStick !== defaultTooltipAssignments.rightStick}
              align="left"
              isHoveredByDrag={hoveredTooltipIndex === 11}
              tooltipRef={(el) => tooltipRefs.current[11] = el}
              onClick={() => handleTooltipClick('rightStick', viewMode === 'back' ? 'Paddle' : 'Right Stick')}
              tooltipId="rightStick"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
              isEditMode={isEditMode}
              onPositionChange={(newPos) => {
                setTooltipPositions(prev => ({
                  ...prev,
                  rightStick: newPos
                }));
              }}
            />

            {/* Tooltip 11 - Share Button */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'buttonShare' && (
                  <ResetButton
                    position={tooltipPositions.buttonShare}
                    align="right"
                    onClick={() => handleResetTooltip('buttonShare')}
                  />
                )}
                <HotspotTooltip
                  key={`buttonShare-${viewMode}`}
                  label="Button"
                  value={tooltipAssignments.buttonShare || 'Share'}
                  position={tooltipPositions.buttonShare}
                  isActive={activeTooltip === 'buttonShare'}
                  isModified={tooltipAssignments.buttonShare !== defaultTooltipAssignments.buttonShare}
                  align="right"
                  isHoveredByDrag={hoveredTooltipIndex === 12}
                  tooltipRef={(el) => tooltipRefs.current[12] = el}
                  onClick={() => handleTooltipClick('buttonShare', 'Button')}
                  tooltipId="buttonShare"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      buttonShare: newPos
                    }));
                  }}
                />
              </>
            )}

            {/* Tooltip 12 - View Button */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'viewButton' && (
                  <ResetButton
                    position={tooltipPositions.viewButton}
                    align="left"
                    onClick={() => handleResetTooltip('viewButton')}
                  />
                )}
                <HotspotTooltip
                  key={`viewButton-${viewMode}`}
                  label="Button"
                  value={tooltipAssignments.viewButton || 'View'}
                  position={tooltipPositions.viewButton}
                  isActive={activeTooltip === 'viewButton'}
                  isModified={tooltipAssignments.viewButton !== defaultTooltipAssignments.viewButton}
                  align="left"
                  isHoveredByDrag={hoveredTooltipIndex === 13}
                  tooltipRef={(el) => tooltipRefs.current[13] = el}
                  onClick={() => handleTooltipClick('viewButton', 'Button')}
                  tooltipId="viewButton"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      viewButton: newPos
                    }));
                  }}
                />
              </>
            )}

            {/* Tooltip 13 - Menu Button */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'menuButton' && (
                  <ResetButton
                    position={tooltipPositions.menuButton}
                    align="right"
                    onClick={() => handleResetTooltip('menuButton')}
                  />
                )}
                <HotspotTooltip
                  key={`menuButton-${viewMode}`}
                  label="Button"
                  value={tooltipAssignments.menuButton || 'Menu'}
                  position={tooltipPositions.menuButton}
                  isActive={activeTooltip === 'menuButton'}
                  isModified={tooltipAssignments.menuButton !== defaultTooltipAssignments.menuButton}
                  align="right"
                  isHoveredByDrag={hoveredTooltipIndex === 14}
                  tooltipRef={(el) => tooltipRefs.current[14] = el}
                  onClick={() => handleTooltipClick('menuButton', 'Button')}
                  tooltipId="menuButton"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      menuButton: newPos
                    }));
                  }}
                />
              </>
            )}

            {/* Tooltip 14 - Profile Button */}
            {viewMode !== 'back' && (
              <>
                {showResetButton === 'profileButton' && (
                  <ResetButton
                    position={tooltipPositions.profileButton}
                    align="right"
                    onClick={() => handleResetTooltip('profileButton')}
                  />
                )}
                <HotspotTooltip
                  key={`profileButton-${viewMode}`}
                  label="Button"
                  value={tooltipAssignments.profileButton || 'Profile'}
                  position={tooltipPositions.profileButton}
                  isActive={activeTooltip === 'profileButton'}
                  isModified={tooltipAssignments.profileButton !== defaultTooltipAssignments.profileButton}
                  align="right"
                  isHoveredByDrag={hoveredTooltipIndex === 15}
                  tooltipRef={(el) => tooltipRefs.current[15] = el}
                  onClick={() => handleTooltipClick('profileButton', 'Button')}
                  tooltipId="profileButton"
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setTooltipPositions(prev => ({
                      ...prev,
                      profileButton: newPos
                    }));
                  }}
                />
              </>
            )}
          </div>

          {/* Reset to Default Button - moved from top */}
          <button
            onClick={handleResetAllTooltips}
            className="bg-[#242424] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] px-4 py-2 hover:bg-[#2e2e2e] transition-colors relative"
            style={{ bottom: '715px' }}
          >
            <span className="font-logitech text-xs font-bold tracking-[0.36px] uppercase text-[#e6e6e6] whitespace-nowrap">
              RESET ALL TO DEFAULT
            </span>
          </button>

          {/* View Mode Toggle - Front/Back buttons */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <BinaryToggle
              leftLabel="FRONT"
              rightLabel="BACK"
              value={viewMode === 'front' ? 'left' : 'right'}
              onChange={(value) => setViewMode(value === 'left' ? 'front' : 'back')}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSave={handlePresetSave}
        currentPreset={currentPreset}
        onOpenImportModal={handleOpenImportModal}
      />

      <ImportProfileModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportComplete}
        targetProfile={importTargetProfile}
      />

      {showSaveNotification && (
        <SaveNotification
          profileName={savedProfileInfo.profileName}
          targetSlot={savedProfileInfo.targetSlot}
          onClose={() => setShowSaveNotification(false)}
        />
      )}

      <ActionsModal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        tooltipLabel={selectedTooltipForModal?.label || ''}
        currentValue={selectedTooltipForModal ? tooltipAssignments[selectedTooltipForModal.id] : ''}
        onSelect={handleActionSelect}
        availableActions={allModalActions}
        onResetCurrent={handleResetCurrent}
      />

      {/* Custom drag preview */}
      {draggingId && draggedButton && (
        <div
          className={`fixed pointer-events-none z-50 rounded-lg flex items-center gap-2 p-2 h-[48px] shadow-[10px_10px_20px_0px_rgba(0,0,0,0.4)] select-none ${
            dragOverTooltip ? 'border border-dashed border-[#00b6fa]' : ''
          }`}
          style={{
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '380px',
            backgroundColor: 'rgba(26, 26, 26, 0.8)'
          }}
        >
          <div className="w-[20px] h-[48px] border-r border-[#2e2e2e] flex items-center justify-start pl-[2px] shrink-0">
            <div className="w-[11px] h-[18px] relative">
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-0 top-0" />
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-[7px] top-0" />
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-0 top-[7px]" />
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-[7px] top-[7px]" />
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-0 top-[14px]" />
              <div className="absolute w-1 h-1 rounded-full bg-[#ccc] left-[7px] top-[14px]" />
            </div>
          </div>
          <div className="flex items-center flex-1 pl-2">
            <span className="text-[#e6e6e6] text-[14px] font-logitech tracking-[-0.42px] leading-[1.3]">
              {draggedButton.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Tracing Animation Layer - creates traveling 5px glowing segment
// TracingAnimationLayer removed - was causing weird animated line on tooltips

// Tooltip Component with all states (default, hover, press, active)
// Supports both left and right alignment
// Right-aligned tooltips (1-5) grow to the left, left-aligned tooltips (6-10) grow to the right
function HotspotTooltip({ label, value, position, isActive, isModified, align = 'right', isHoveredByDrag = false, tooltipRef, onClick, tooltipId, onHoverChange, hoveredTooltipId, isEditMode, onPositionChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isHoveredByGamepad = hoveredTooltipId === tooltipId;

  const handleClick = (e) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsPinned(!isPinned);
      setShowEditTooltip(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on input fields or close button
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
      return;
    }
    if (isEditMode && onPositionChange) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.left,
        y: e.clientY - position.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && isEditMode && onPositionChange) {
        const newLeft = e.clientX - dragStart.x;
        const newTop = e.clientY - dragStart.y;
        onPositionChange({
          left: Math.round(newLeft),
          top: Math.round(newTop)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position, isEditMode, onPositionChange]);

  return (
    <div
      className="absolute"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex: (isPinned || isActive) ? 1000 : 1
      }}
      onMouseEnter={() => !isPinned && isEditMode && setShowEditTooltip(true)}
      onMouseLeave={() => !isPinned && isEditMode && setShowEditTooltip(false)}
    >
      <div
        ref={tooltipRef}
        className={`backdrop-blur-sm rounded group ${isDragging ? 'ring-2 ring-primary-default z-50' : ''} ${showEditTooltip && isEditMode && !isPinned ? 'ring-2 ring-yellow-400' : ''} ${isPinned ? 'ring-2 ring-green-500' : ''}`}
        data-tooltip
        style={{
          pointerEvents: 'auto',
          transform: align === 'right' ? 'translateX(-100%)' : 'none',
          cursor: isEditMode ? 'move' : 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: (isHovered || isHoveredByGamepad) ? '#1E1F20' : '#18191A',
          transition: 'background-color 0.2s ease',
          width: '108px'
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => {
          if (!isEditMode) {
            setIsHovered(true);
            onHoverChange && onHoverChange(tooltipId);
          }
        }}
        onMouseLeave={() => {
          if (!isEditMode) {
            setIsHovered(false);
            onHoverChange && onHoverChange(null);
          }
        }}
      >
      <div className={`p-2 flex flex-col gap-2 rounded transition-colors whitespace-nowrap text-left ${
        isActive
          ? ''
          : isHoveredByDrag
          ? 'bg-[rgba(239,250,255,0.14)]'
          : 'group-active:bg-[rgba(239,250,255,0.28)]'
      }`}>
        <p className={`text-xs font-logitech transition-colors ${
          isModified || isActive
            ? 'text-[#e6e6e6]'
            : isHoveredByDrag
            ? 'text-[#e6e6e6]'
            : 'text-[#8e8e8f] group-active:text-[#e6e6e6]'
        }`}>
          {label}
        </p>
        <p className={`text-sm font-logitech font-bold tracking-[-0.42px] transition-colors ${
          isModified || isActive
            ? 'text-[#00b6fa]'
            : isHoveredByDrag
            ? 'text-[#e6e6e6]'
            : 'text-[#8e8e8f] group-active:text-[#e6e6e6]'
        }`}>
          {value}
        </p>
      </div>
      {isEditMode && (showEditTooltip || isPinned) && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 rounded-lg shadow-xl flex gap-2 items-center border-2 border-blue-500" style={{ zIndex: 1001, pointerEvents: 'auto' }}>
          {isPinned && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPinned(false);
                setShowEditTooltip(false);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              ×
            </button>
          )}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-600 font-bold uppercase">X</span>
            <input
              type="text"
              value={position.left}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onPositionChange && onPositionChange({ left: val, top: position.top });
              }}
              className="w-14 h-7 text-center rounded border-2 border-gray-300 focus:border-blue-500 outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#000000',
                backgroundColor: '#ffffff',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <span className="text-gray-400 text-lg font-bold">/</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-600 font-bold uppercase">Y</span>
            <input
              type="text"
              value={position.top}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                onPositionChange && onPositionChange({ left: position.left, top: val });
              }}
              className="w-14 h-7 text-center rounded border-2 border-gray-300 focus:border-blue-500 outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#000000',
                backgroundColor: '#ffffff',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Reset Button Component - appears above active tooltip
function ResetButton({ position, align = 'right', onClick }) {
  return (
    <div
      className="absolute z-50"
      data-reset-button
      style={{
        left: `${position.left}px`,
        top: `${position.top - 40}px`, // 4px gap + 36px button height
        transform: align === 'right' ? 'translateX(-100%)' : 'none'
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="bg-[#242424] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] flex items-center justify-center px-6 h-8 hover:bg-[#4d4d4d] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
      >
        <span className="font-logitech font-bold text-xs text-[#e6e6e6] uppercase tracking-[0.36px] leading-[1.16]">
          RESET
        </span>
      </button>
    </div>
  );
}

// Assignment Callout Component
function AssignmentCallout({ label, value, style, align = 'left' }) {
  return (
    <div
      className={`bg-[rgba(30,31,33,0.6)] px-3 py-2 rounded-lg whitespace-nowrap ${align === 'right' ? 'text-right' : 'text-left'}`}
      style={style}
    >
      <p className="text-[10px] text-[rgba(255,255,255,0.6)] uppercase leading-4 font-logitech">
        {label}
      </p>
      <p className="text-base text-[rgba(255,255,255,0.9)] capitalize leading-6 font-logitech">
        {value}
      </p>
    </div>
  );
}

// Single Leader Line Path - just renders the path, no control points
function LeaderLinePath({ points, lineId, hoveredTooltipId, transform }) {
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const opacity = hoveredTooltipId === lineId ? '0.3' : '0.2';

  return (
    <g style={{ transform }}>
      <path
        d={pathD}
        stroke="#FBFBFB"
        strokeOpacity={opacity}
        strokeWidth="1"
        strokeLinecap="round"
        style={{ transition: 'stroke-opacity 0.2s ease' }}
      />
    </g>
  );
}

// Control Points Layer - renders all control points for all lines in one top layer
function LeaderLineControlPoints({ lines, isEditMode, onLineUpdate, controllerYOffset }) {
  const [draggingLine, setDraggingLine] = useState(null); // {lineId, pointIndex, offsetX, offsetY, initialY}
  const svgRef = useRef(null);

  const handleMouseDown = (e, lineId, pointIndex, point) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();

    // Calculate offset between mouse position and control point position
    const svgContainer = svgRef.current.parentElement;
    const rect = svgContainer.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 567.5;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 351.5;

    setDraggingLine({
      lineId,
      pointIndex,
      offsetX: mouseX - point.x,
      offsetY: mouseY - point.y,
      initialY: point.y  // Store initial Y for horizontal constraint
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingLine || !isEditMode || !svgRef.current) return;

      const line = lines.find(l => l.id === draggingLine.lineId);
      if (!line) return;

      // Find the correct SVG element for this line's transform
      const svgContainer = svgRef.current.parentElement;
      const rect = svgContainer.getBoundingClientRect();

      // Simple coordinate calculation (works for all transforms)
      const mouseX = ((e.clientX - rect.left) / rect.width) * 567.5;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 351.5;

      // Apply the offset so the point stays under the cursor
      const x = mouseX - draggingLine.offsetX;
      let y = mouseY - draggingLine.offsetY;

      // If Shift is held, align Y with the closest adjacent point to create horizontal line
      if (e.shiftKey && line.points.length >= 2) {
        // For a point with neighbors on both sides, choose the closest one
        // For first/last points, use the only neighbor
        if (draggingLine.pointIndex === 0) {
          // First point - align with next point
          y = line.points[1].y;
        } else if (draggingLine.pointIndex === line.points.length - 1) {
          // Last point - align with previous point
          y = line.points[line.points.length - 2].y;
        } else {
          // Middle point - align with the closest adjacent point
          const prevPoint = line.points[draggingLine.pointIndex - 1];
          const nextPoint = line.points[draggingLine.pointIndex + 1];
          const distToPrev = Math.abs(y - prevPoint.y);
          const distToNext = Math.abs(y - nextPoint.y);
          y = distToPrev < distToNext ? prevPoint.y : nextPoint.y;
        }
      }

      onLineUpdate(draggingLine.lineId, draggingLine.pointIndex, {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10
      });
    };

    const handleMouseUp = () => {
      setDraggingLine(null);
    };

    if (draggingLine) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingLine, isEditMode, lines, onLineUpdate]);

  if (!isEditMode) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 567.5 351.5"
      fill="none"
      style={{
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'visible',
        transform: `translateY(${controllerYOffset}px)`
      }}
    >
      {lines.map(line => (
        <g key={line.id} style={{ transform: line.transform }}>
          {line.points.map((point, index) => {
            const isDragging = draggingLine?.lineId === line.id && draggingLine?.pointIndex === index;
            return (
              <g key={`${line.id}-${index}`} style={{ pointerEvents: 'auto' }}>
                {/* Larger invisible hit area */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="20"
                  fill="transparent"
                  style={{ cursor: 'move', pointerEvents: 'auto' }}
                  onMouseDown={(e) => handleMouseDown(e, line.id, index, point)}
                />
                {/* Visible control point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={isDragging ? "#00b6fa" : "#ff6b00"}
                  stroke="white"
                  strokeWidth="1.5"
                  style={{
                    cursor: 'move',
                    pointerEvents: 'none'
                  }}
                />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// Hotspot marker component
function HotspotMarker({ name, style, isSelected, isHovered, tooltipId, onHoverChange, isEditMode, onPositionChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ left: parseInt(style.left), top: parseInt(style.top) });

  useEffect(() => {
    setCurrentPosition({ left: parseInt(style.left), top: parseInt(style.top) });
  }, [style.left, style.top]);

  const handleClick = (e) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      setIsPinned(!isPinned);
      setShowEditTooltip(true);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
      return;
    }
    if (isEditMode && onPositionChange) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - currentPosition.left,
        y: e.clientY - currentPosition.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && isEditMode && onPositionChange) {
        const newLeft = e.clientX - dragStart.x;
        const newTop = e.clientY - dragStart.y;
        const newPos = {
          left: Math.round(newLeft),
          top: Math.round(newTop)
        };
        setCurrentPosition(newPos);
        onPositionChange(newPos);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, isEditMode, onPositionChange]);

  return (
    <div
      className="absolute"
      style={{
        left: `${currentPosition.left}px`,
        top: `${currentPosition.top}px`,
        zIndex: isPinned ? 1000 : 10
      }}
      onMouseEnter={() => !isPinned && isEditMode && setShowEditTooltip(true)}
      onMouseLeave={() => !isPinned && isEditMode && setShowEditTooltip(false)}
    >
      <div
        className={`
          backdrop-blur-[4px] border border-solid
          overflow-hidden rounded-[40px] w-[24px] h-[24px]
          transition-all duration-150 ease-in-out outline-none
          focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-1 focus-visible:ring-offset-black
          ${isDragging ? 'ring-2 ring-primary-default' : ''}
          ${showEditTooltip && isEditMode && !isPinned ? 'ring-2 ring-yellow-400' : ''}
          ${isPinned ? 'ring-2 ring-green-500' : ''}
          ${
            isSelected
              ? 'bg-[rgba(0,182,250,0.25)] border-primary-default'
              : 'bg-[rgba(43,48,59,0.2)] border-stroke-neutral-default'
          }
        `}
        style={{
          cursor: isEditMode ? 'move' : 'pointer',
          pointerEvents: 'auto'
        }}
        title={name}
        aria-label={name}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isEditMode && onHoverChange && onHoverChange(tooltipId)}
        onMouseLeave={() => !isEditMode && onHoverChange && onHoverChange(null)}
      >
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[40px] transition-all duration-200 ease-in ${
          isSelected
            ? 'w-[12px] h-[12px] bg-primary-default'
            : isHovered
            ? 'w-[10px] h-[10px] bg-white'
            : 'w-[8px] h-[8px] bg-white'
        }`} />
      </div>
      {isEditMode && (showEditTooltip || isPinned) && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 rounded-lg shadow-xl flex gap-2 items-center border-2 border-blue-500" style={{ zIndex: 1001, pointerEvents: 'auto' }}>
          {isPinned && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPinned(false);
                setShowEditTooltip(false);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              ×
            </button>
          )}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-600 font-bold uppercase">X</span>
            <input
              type="text"
              value={currentPosition.left}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                const newPos = { left: val, top: currentPosition.top };
                setCurrentPosition(newPos);
                onPositionChange && onPositionChange(newPos);
              }}
              className="w-14 h-7 text-center rounded border-2 border-gray-300 focus:border-blue-500 outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#000000',
                backgroundColor: '#ffffff',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <span className="text-gray-400 text-lg font-bold">/</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-600 font-bold uppercase">Y</span>
            <input
              type="text"
              value={currentPosition.top}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                const newPos = { left: currentPosition.left, top: val };
                setCurrentPosition(newPos);
                onPositionChange && onPositionChange(newPos);
              }}
              className="w-14 h-7 text-center rounded border-2 border-gray-300 focus:border-blue-500 outline-none"
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#000000',
                backgroundColor: '#ffffff',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
