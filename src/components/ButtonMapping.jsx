import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';
import ProfileSelector from './ProfileSelector';
import ActionsModal from './ActionsModal';
import DeviceStatusWidget from './DeviceStatusWidget';

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
    const saved = localStorage.getItem('hotspotPositions');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
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
    };
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
      rightTrigger: 'Right Trigger'
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
      rightTrigger: 'Right Trigger'
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
      rightStick: 'Right Stick'
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
        'rightBumper', 'buttonY', 'buttonB', 'buttonX', 'buttonA', 'rightStick'
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
  const [tooltipPositions, setTooltipPositions] = useState(() => {
    const saved = localStorage.getItem('buttonMappingTooltipPositions');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      leftStick: { left: 27, top: 465 },
      leftBumper: { left: 27, top: 0 },
      dPadUp: { left: 27, top: 90 },
      dPadLeft: { left: 26, top: 180 },
      dPadDown: { left: 26, top: 273 },
      dPadRight: { left: 27, top: 368 },
      rightBumper: { left: 723, top: 0 },
      buttonY: { left: 723, top: 90 },
      buttonB: { left: 723, top: 180 },
      buttonX: { left: 723, top: 273 },
      buttonA: { left: 724, top: 368 },
      rightStick: { left: 724, top: 465 },
    };
  });

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode - save positions
      localStorage.setItem('buttonMappingTooltipPositions', JSON.stringify(tooltipPositions));
      console.log('✅ Tooltip positions saved!');
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
                Copy Positions to Console
              </button>
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
              style={{ pointerEvents: 'none' }}
            />


            {/* Hotspots at line endpoints - using positions from Home page */}
            {/* LD1 - Left Stick */}
            <HotspotMarker
              key={`LD1-${viewMode}`}
              name="LD1"
              style={{ left: `${hotspotPositions['Left Stick'].left}px`, top: `${hotspotPositions['Left Stick'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'leftStick'}
              tooltipId="leftStick"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
            />

            {/* LB - Left Bumper */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LB"
                style={{ left: `${hotspotPositions['Left Bumper'].left}px`, top: `${hotspotPositions['Left Bumper'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'leftBumper'}
                tooltipId="leftBumper"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
              />
            )}

            {/* LD2 - D Pad Up */}
            <HotspotMarker
              key={`LD2-${viewMode}`}
              name="LD2"
              style={{ left: `${hotspotPositions['D Pad Up'].left}px`, top: `${hotspotPositions['D Pad Up'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'dPadUp'}
              tooltipId="dPadUp"
              onHoverChange={setHoveredTooltipId}
              hoveredTooltipId={hoveredTooltipId}
            />

            {/* LD3 - D Pad Left */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LD3"
                style={{ left: `${hotspotPositions['D Pad Left'].left}px`, top: `${hotspotPositions['D Pad Left'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'dPadLeft'}
                tooltipId="dPadLeft"
                onHoverChange={setHoveredTooltipId}
                hoveredTooltipId={hoveredTooltipId}
              />
            )}

            {/* LD4 - D Pad Down */}
            <HotspotMarker
              key={`LD4-${viewMode}`}
              name="LD4"
              style={{ left: `${hotspotPositions['D Pad Down'].left}px`, top: `${hotspotPositions['D Pad Down'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'dPadDown'}
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

            {/* LD5 - D Pad Right */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="LD5"
                style={{ left: `${hotspotPositions['D Pad Right'].left}px`, top: `${hotspotPositions['D Pad Right'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'dPadRight'}
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
            )}

            {/* RB - Right Bumper */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RB"
                style={{ left: `${hotspotPositions['Right Bumper'].left}px`, top: `${hotspotPositions['Right Bumper'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'rightBumper'}
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
            )}

            {/* RD1 - Button Y */}
            <HotspotMarker
              name="RD1"
              style={{ left: `${hotspotPositions['Button Y'].left}px`, top: `${hotspotPositions['Button Y'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'buttonY'}
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

            {/* RD2 - Button B */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RD2"
                style={{ left: `${hotspotPositions['Button B'].left}px`, top: `${hotspotPositions['Button B'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'buttonB'}
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
            )}

            {/* RD3 - Button X */}
            {viewMode !== 'back' && (
              <HotspotMarker
                name="RD3"
                style={{ left: `${hotspotPositions['Button X'].left}px`, top: `${hotspotPositions['Button X'].top}px` }}
                isSelected={false}
                isHovered={hoveredTooltipId === 'buttonX'}
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
            )}

            {/* RD4 - Fourth from top right dot */}
            {/* RD4 - Button A */}
            <HotspotMarker
              key={`RD4-${viewMode}`}
              name="RD4"
              style={{ left: `${hotspotPositions['Button A'].left}px`, top: `${hotspotPositions['Button A'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'buttonA'}
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

            {/* RD5 - Right Stick */}
            <HotspotMarker
              key={`RD5-${viewMode}`}
              name="RD5"
              style={{ left: `${hotspotPositions['Right Stick'].left}px`, top: `${hotspotPositions['Right Stick'].top}px` }}
              isSelected={false}
              isHovered={hoveredTooltipId === 'rightStick'}
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

            {/* Individual Leader Lines - respond to tooltip hover */}
            {/* L1 - Top Left */}
            {viewMode !== 'back' ? (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(250px) translateX(-60px)' }}>
                <path d="M0 218.789H92L233.71 18.38" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'leftStick' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(42px) translateX(-60px)' }}>
                <path d="M1 218.789H145.71" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'leftStick' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* LB - Left Bumper */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-55px) translateX(-60px)' }}>
                <path d="M162 37L85 20H1" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'leftBumper' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* L2 - Second from Top Left */}
            {viewMode !== 'back' ? (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-30px) translateX(-60px)' }}>
                <path d="M136 90L85 83.5H1" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadUp' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-38px) translateX(-60px)' }}>
                <path d="M136 90H1" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadUp' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* L3 - Middle Left */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-42px) translateX(-60px)' }}>
                <path d="M91 162L83.5 173.5H1.5" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadLeft' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* L4 - Fourth from Top Left */}
            {viewMode !== 'back' ? (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-30px) translateX(-60px)' }}>
                <path d="M133 198L55 251H1.5" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadDown' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-50px) translateX(-60px)' }}>
                <path d="M158 198H1.5" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadDown' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* L5 - Bottom Left */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-45px) translateX(-60px)' }}>
                <path d="M195 160L101 347.5H1" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'dPadRight' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* RB - Right Bumper */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-35px) translateX(60px)' }}>
                <path d="M566.5 1H480L418 25" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'rightBumper' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* R1 - Top Right */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(77px) translateX(60px)' }}>
              <path d="M566.5 1H481L426 1" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'buttonY' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
            </svg>

            {/* R2 - Second from Top Right */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(158px) translateX(698px)' }}>
                <path d="M3.432 5.447L15.4331 26.2499H77.9331" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'buttonB' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* R3 - Middle Right */}
            {viewMode !== 'back' && (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(73px) translateX(60px)' }}>
                <path d="M358 54L417 94.5L514 172.5H566.5" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'buttonX' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* R4 - Fourth from Top Right */}
            {viewMode !== 'back' ? (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(73px) translateX(60px)' }}>
                <path d="M566.5 261.5H502.5L420 121" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'buttonA' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-132px) translateX(60px)' }}>
                <path d="M566.5 261.5H398" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'buttonA' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* R5 - Bottom Right */}
            {viewMode !== 'back' ? (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(77px) translateX(60px)' }}>
                <path d="M566.5 350.5H481L337 142.6" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'rightStick' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            ) : (
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 567.5 351.5" fill="none" style={{ pointerEvents: 'none', transform: 'scale(0.8085) translateY(-130px) translateX(60px)' }}>
                <path d="M566.5 350.5H410" stroke="#FBFBFB" strokeOpacity={hoveredTooltipId === 'rightStick' ? '0.3' : '0.2'} strokeWidth="1" strokeLinecap="round" style={{ transition: 'stroke-opacity 0.2s ease' }}/>
              </svg>
            )}

            {/* Animated Tracing Layer */}
            <TracingAnimationLayer hoveredTooltipId={hoveredTooltipId} tooltipRefs={tooltipRefs} />

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
          </div>

          {/* Reset to Default Button - moved from top */}
          <button
            onClick={handleResetAllTooltips}
            className="bg-[#242424] rounded-lg shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] px-4 py-2 hover:bg-[#2e2e2e] transition-colors relative"
            style={{ bottom: '515px' }}
          >
            <span className="font-logitech text-xs font-bold tracking-[0.36px] uppercase text-[#e6e6e6] whitespace-nowrap">
              RESET ALL TO DEFAULT
            </span>
          </button>
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
function TracingAnimationLayer({ hoveredTooltipId, tooltipRefs }) {
  if (!hoveredTooltipId) return null;

  // Mapping of tooltip IDs to their hotspot positions
  const tooltipConfigs = {
    leftStick: { tooltipIndex: 0, align: 'right', hotspotPos: { x: 268, y: 254 } },
    leftBumper: { tooltipIndex: 1, align: 'right', hotspotPos: { x: 200, y: 45 } },
    dPadUp: { tooltipIndex: 2, align: 'right', hotspotPos: { x: 173, y: 115 } },
    dPadLeft: { tooltipIndex: 3, align: 'right', hotspotPos: { x: 122, y: 166 } },
    dPadDown: { tooltipIndex: 4, align: 'right', hotspotPos: { x: 175, y: 217 } },
    dPadRight: { tooltipIndex: 5, align: 'right', hotspotPos: { x: 227, y: 166 } },
    rightBumper: { tooltipIndex: 6, align: 'left', hotspotPos: { x: 550, y: 45 } },
    buttonY: { tooltipIndex: 7, align: 'left', hotspotPos: { x: 560, y: 106 } },
    buttonB: { tooltipIndex: 8, align: 'left', hotspotPos: { x: 623, y: 167 } },
    buttonX: { tooltipIndex: 9, align: 'left', hotspotPos: { x: 488, y: 166 } },
    buttonA: { tooltipIndex: 10, align: 'left', hotspotPos: { x: 560, y: 223 } },
    rightStick: { tooltipIndex: 11, align: 'left', hotspotPos: { x: 467, y: 252 } },
  };

  const config = tooltipConfigs[hoveredTooltipId];
  if (!config) return null;

  const tooltipEl = tooltipRefs.current[config.tooltipIndex];
  if (!tooltipEl) return null;

  const tooltipRect = tooltipEl.getBoundingClientRect();
  const containerEl = tooltipEl.parentElement;
  if (!containerEl) return null;

  const containerRect = containerEl.getBoundingClientRect();

  // Convert tooltip position to relative coordinates
  const tooltipX = tooltipRect.left - containerRect.left;
  const tooltipY = tooltipRect.top - containerRect.top;
  const tooltipW = tooltipRect.width;
  const tooltipH = tooltipRect.height;

  // Hotspot center (add 12px to get to center of 24px hotspot)
  const hotspotCenterX = config.hotspotPos.x + 12;
  const hotspotCenterY = config.hotspotPos.y + 12;

  // Create path: tooltip border - different starting points to ensure all edges are visible
  let completePath;
  if (config.align === 'right') {
    // Right-aligned (left side): start at RIGHT-bottom corner, travel left to ensure left edge is covered
    completePath = `
      M ${tooltipX + tooltipW} ${tooltipY + tooltipH}
      L ${tooltipX + tooltipW} ${tooltipY}
      L ${tooltipX} ${tooltipY}
      L ${tooltipX} ${tooltipY + tooltipH}
      L ${tooltipX + tooltipW} ${tooltipY + tooltipH}
    `;
  } else {
    // Left-aligned (right side): start at LEFT-bottom corner, travel right to ensure right edge is covered
    completePath = `
      M ${tooltipX} ${tooltipY + tooltipH}
      L ${tooltipX} ${tooltipY}
      L ${tooltipX + tooltipW} ${tooltipY}
      L ${tooltipX + tooltipW} ${tooltipY + tooltipH}
      L ${tooltipX} ${tooltipY + tooltipH}
    `;
  }

  // Create mask path - the actual tooltip border outline
  const maskPath = completePath;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
      <defs>
        {/* Mask that defines the 1px border area */}
        <mask id={`borderMask-${hoveredTooltipId}`}>
          <rect x="0" y="0" width="100%" height="100%" fill="black" />
          <path
            d={maskPath}
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>

        <filter id="glowFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="2.5" />
          </feComponentTransfer>
        </filter>

        <style>
          {`
            @keyframes traceAnimation {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
      </defs>

      {/* Traveling glowing segment masked to border area */}
      <path
        d={completePath}
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 2000"
        strokeDashoffset="2008"
        mask={`url(#borderMask-${hoveredTooltipId})`}
        style={{
          filter: 'url(#glowFilter)',
          animation: 'traceAnimation 15.6s ease-out infinite'
        }}
      />
    </svg>
  );
}

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
        top: `${position.top}px`
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
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-2 rounded-lg shadow-xl flex gap-2 items-center border-2 border-blue-500 z-50">
          {isPinned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPinned(false);
                setShowEditTooltip(false);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600"
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

// Hotspot marker component
function HotspotMarker({ name, style, isSelected, isHovered, tooltipId, onHoverChange }) {
  return (
    <button
      className={`
        backdrop-blur-[4px] border border-solid
        absolute overflow-hidden rounded-[40px] w-[24px] h-[24px]
        transition-all duration-150 ease-in-out cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-1 focus-visible:ring-offset-black
        ${
          isSelected
            ? 'bg-[rgba(0,182,250,0.25)] border-primary-default'
            : 'bg-[rgba(43,48,59,0.2)] border-stroke-neutral-default'
        }
      `}
      style={style}
      title={name}
      aria-label={name}
      onMouseEnter={() => onHoverChange && onHoverChange(tooltipId)}
      onMouseLeave={() => onHoverChange && onHoverChange(null)}
    >
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[40px] transition-all duration-200 ease-in ${
        isSelected
          ? 'w-[12px] h-[12px] bg-primary-default'
          : isHovered
          ? 'w-[10px] h-[10px] bg-white'
          : 'w-[8px] h-[8px] bg-white'
      }`} />
    </button>
  );
}
