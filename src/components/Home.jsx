import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TabHorizontal from './TabHorizontal';
import ListItem from './ListItem';
import Button from './Button';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import HotspotDetailCard from './HotspotDetailCard';
import SaveNotification from './SaveNotification';
import ProfileSelector from './ProfileSelector';
import DeviceStatusWidget from './DeviceStatusWidget';

// Image assets
const imgIcon = "/figmaAssets/chevron-icon.svg";
const imgFunctionIconsViewCards = "/figmaAssets/actions-icon.svg";
const imgVector1 = "/figmaAssets/chevron-icon.svg";
const imgVector2 = "/figmaAssets/sticks-icon.svg";
const imgVector3 = "/figmaAssets/triggers-icon.svg";
const imgVector4 = "/figmaAssets/input-test-icon.svg";
const imgVector5 = "/figmaAssets/general-settings-icon.svg";
const imgGhostController = "/ghost-controller-white.png";

export default function Home() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('Actions');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [hoveredTooltipId, setHoveredTooltipId] = useState(null);
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
  const [detailCardHotspot, setDetailCardHotspot] = useState(null);
  const [detailCardPosition, setDetailCardPosition] = useState({ left: 0, top: 0 });
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [savedProfileInfo, setSavedProfileInfo] = useState({ profileName: '', targetSlot: '' });

  // Hotspot editing mode
  const [isEditMode, setIsEditMode] = useState(false);
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
      'Menu Button': { left: 711, top: 159 },
      'View Button': { left: 451, top: 159 },
      'Profile Button': { left: 664, top: 273 },
    };
  });
  const [draggingHotspot, setDraggingHotspot] = useState(null);

  // Save positions to localStorage when exiting edit mode
  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode - save positions
      localStorage.setItem('hotspotPositions', JSON.stringify(hotspotPositions));
      console.log('✅ Hotspot positions saved!');
    }
    setIsEditMode(!isEditMode);
  };

  // Track if settings have changed (for Save button)
  // Show save button if ANY page has changes (global)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  });
  // Track if THIS page specifically has changes (local)
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [savedSettings, setSavedSettings] = useState(null);

  const handleMenuClick = (menuName) => {
    console.log(`Menu clicked: ${menuName}`);
    if (menuName === 'Actions') {
      navigate('/mapping');
    } else if (menuName === 'Triggers') {
      navigate('/triggers');
    } else if (menuName === 'Sticks') {
      navigate('/sticks');
    } else if (menuName === 'Aim Training') {
      navigate('/reflex-range');
    } else {
      setSelectedMenu(menuName);
    }
  };

  const handleHotspotClick = (hotspotName, event) => {
    console.log(`Hotspot clicked: ${hotspotName}`);
    setSelectedHotspot(hotspotName);

    // Get hotspot position from its style
    const hotspotStyle = event.currentTarget.style;
    const hotspotLeft = parseInt(hotspotStyle.left);
    const hotspotTop = parseInt(hotspotStyle.top);

    const cardWidth = 340;
    const cardHeight = 400; // approximate height
    const padding = 20;
    const containerWidth = 1188; // controller image width (56% bigger than original)
    const containerHeight = 771; // controller image height (56% bigger than original)
    const centerX = containerWidth / 2; // 381px

    let left, top;

    // Determine which side of the controller the hotspot is on
    if (hotspotLeft < centerX) {
      // Hotspot is on the LEFT side - position card to the LEFT
      left = hotspotLeft - cardWidth - padding;
      // If card would go off left edge, position it inside with padding
      if (left < 0) {
        left = padding;
      }
    } else {
      // Hotspot is on the RIGHT side - position card to the RIGHT
      left = hotspotLeft + 24 + padding; // hotspot width + padding
      // If card would go off right edge, position it inside with padding
      if (left + cardWidth > containerWidth) {
        left = containerWidth - cardWidth - padding;
      }
    }

    // Vertical positioning - center on hotspot
    top = hotspotTop - (cardHeight / 2) + 12; // 12 is half of hotspot height (24px)

    // Adjust vertical position to keep card in bounds
    if (top + cardHeight > containerHeight) {
      top = containerHeight - cardHeight - padding;
    }

    // Ensure card doesn't go off top edge
    if (top < 0) {
      top = padding;
    }

    setDetailCardPosition({ left, top });
    setDetailCardHotspot(hotspotName);
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
  };

  const handlePresetClick = () => {
    console.log('Preset selector clicked');
    setIsPresetModalOpen(true);
  };

  const handlePresetSave = (presetId) => {
    console.log(`Preset saved: ${presetId}`);
    setCurrentPreset(presetId);
    localStorage.setItem('currentPreset', presetId);
    // Reset saved settings when switching profiles
    setSavedSettings(null);
    setHasUnsavedChanges(false);
  };

  const handleOpenImportModal = (targetProfile) => {
    console.log(`Opening import modal for: ${targetProfile}`);
    setImportTargetProfile(targetProfile);
    setIsPresetModalOpen(false);
    setIsImportModalOpen(true);
  };

  const handleImportProfile = (targetProfile, sourceProfile) => {
    console.log(`Importing ${sourceProfile} to ${targetProfile}`);
    // Update the onboard profile mapping to store what was imported
    const newMapping = {
      ...onboardProfileMapping,
      [targetProfile]: sourceProfile,
    };
    setOnboardProfileMapping(newMapping);
    localStorage.setItem('onboardProfileMapping', JSON.stringify(newMapping));
    // Keep the current preset as the onboard slot (don't change to the imported profile)
    // The display will show the imported profile name but keep the onboard icon

    // Show save notification
    const profileNames = {
      desktop: 'Default',
      fps: 'First Person Shooter',
      figma: 'Figma',
      marvelRivals: 'Marvel Rivals',
    };

    setSavedProfileInfo({
      profileName: profileNames[sourceProfile] || sourceProfile,
      targetSlot: targetProfile,
    });
    setShowSaveNotification(true);
  };

  const handleSaveSettings = () => {
    if (!hasUnsavedChanges) return;

    // Clear global unsaved changes flag
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

  const isOnboardPreset = (preset) => {
    return ['p1', 'p2', 'p3'].includes(preset);
  };

  // Initialize saved settings on mount - captures state after all initial effects
  useEffect(() => {
    if (savedSettings === null) {
      setSavedSettings({});
    }
  }, [savedSettings]);

  // Track changes to settings (placeholder for future - Home page doesn't have editable settings yet)
  useEffect(() => {
    if (savedSettings === null) return;
    // For now, no settings to track changes on Home page
    // This will be extended when Home page has editable settings
    setHasUnsavedChanges(false);
  }, [savedSettings]);

  // Global sync: listen for profile changes from other pages/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'currentPreset' && e.newValue) {
        setCurrentPreset(e.newValue);
        // Reset saved settings when profile changes from another page
        setSavedSettings(null);
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
  }, []);

  // Listen for updates from other pages
  useEffect(() => {
    const handleUnsavedChangesUpdate = (event) => {
      setHasUnsavedChanges(event.detail.hasChanges);
    };

    window.addEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
    return () => window.removeEventListener('unsavedChangesUpdated', handleUnsavedChangesUpdate);
  }, []);

  return (
    <div className="bg-black w-full h-screen flex flex-col" data-name="Home" data-node-id="175:3182">
      {/* Navigation */}
      <nav className="flex items-center justify-between gap-4 px-8 py-2 border-b border-solid border-[#333]">
        <div className="inline-flex items-center gap-4" data-name="Tab: Main Navigation">
          <button
            onClick={handleBackClick}
            className="rounded-full bg-[#242424] w-10 h-10 flex items-center justify-center hover:bg-[#333] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#a7a7a8]" />
          </button>
          <div className="flex gap-1 items-center h-10">
            <TabHorizontal active={false} className="flex flex-col gap-[19px] items-center pt-[18px] px-4 rounded shrink-0" insertLabel="HOME" />
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4 rounded shrink-0 w-[5px]">
              <div className="overflow-hidden relative shrink-0 w-4 h-4" data-name="chevron-right">
                <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                  <div className="absolute inset-[-8.33%_-16.67%]">
                    <img alt="Chevron" className="block max-w-none w-full h-full" src={imgIcon} />
                  </div>
                </div>
              </div>
              <div className="h-px rounded-[1px] shrink-0 w-10" />
            </div>
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4 rounded shrink-0">
              <p className="font-logitech font-bold leading-[1.3] text-primary-default text-sm text-center tracking-[-0.42px] whitespace-nowrap">
                GHOST
              </p>
              <div className="bg-stroke-primary-default h-px rounded-[1px] shrink-0 w-6" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex gap-4 overflow-hidden pb-8 px-8 pt-4">
        {/* Side Panel */}
        <div className="w-[420px] flex flex-col gap-2 shrink-0">
          {/* Preset selector */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl w-full">
            <ProfileSelector
              currentPreset={currentPreset}
              hasUnsavedChanges={hasUnsavedChanges}
              onPresetClick={handlePresetClick}
              onSaveSettings={handleSaveSettings}
            />
          </div>

          {/* Menu items */}
          <div className="bg-[#1a1a1a] flex-1 flex flex-col gap-1 p-4 rounded-xl overflow-y-auto">
            {/* Button Remapping */}
            <ListItem
              icon={imgFunctionIconsViewCards}
              title="Button Remapping"
              subtitle="Configure button mappings"
              onClick={() => handleMenuClick('Actions')}
            />
            {/* Sticks */}
            <ListItem
              icon={imgVector2}
              title="Sticks"
              subtitle="Adjust analog stick settings"
              onClick={() => handleMenuClick('Sticks')}
            />
            {/* Triggers */}
            <ListItem
              icon={imgVector3}
              title="Triggers"
              subtitle="Customize trigger behavior"
              onClick={() => handleMenuClick('Triggers')}
            />
            {/* Aim Training */}
            <ListItem
              icon={imgVector4}
              title="Aim Training"
              subtitle="Test controller inputs"
              onClick={() => handleMenuClick('Aim Training')}
            />
            {/* General Settings */}
            <ListItem
              icon={imgVector5}
              title="General Settings"
              subtitle="Configure device settings"
              onClick={() => handleMenuClick('General Settings')}
            />
          </div>
        </div>

        {/* Device section */}
        <div className="flex-1 flex flex-col">
          {/* Edit Mode Toggle */}
          {true && (
            <div className="flex justify-end gap-2 items-center">
              <button
                onClick={handleToggleEditMode}
                className={`px-4 py-2 rounded-lg font-logitech font-bold text-sm transition-colors ${
                  isEditMode
                    ? 'bg-primary-default text-black'
                    : 'bg-[#242424] text-white hover:bg-[#333]'
                }`}
              >
                {isEditMode ? 'Save & Exit Edit Mode' : 'Edit Hotspots'}
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    console.log('=== HOTSPOT POSITIONS ===');
                    const positions = [];
                    Object.entries(hotspotPositions).forEach(([name, pos]) => {
                      const line = `'${name}': { left: ${pos.left}, top: ${pos.top} },`;
                      console.log(line);
                      positions.push(line);
                    });
                    console.log('========================');
                    alert('Positions copied to console! Open DevTools (F12) → Console tab to see them.');
                  }}
                  className="px-4 py-2 rounded-lg font-logitech font-bold text-sm bg-[#242424] text-white hover:bg-[#333] transition-colors"
                >
                  Copy Positions to Console
                </button>
              )}
            </div>
          )}
          {/* Status Widget */}
          <DeviceStatusWidget />

          {/* Device image with hotspots */}
          <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 48px - 64px - 32px - 16px)' }}>
            <div className="relative w-[1188px] h-[771px]">
              <img
                alt="Ghost Controller"
                className="absolute inset-0 w-full h-full object-contain"
                src={imgGhostController}
                style={{ pointerEvents: 'none' }}
              />

              {/* Hotspots at line endpoints */}
              {Object.entries({
                'Left Stick': 'leftStick',
                'Left Bumper': 'leftBumper',
                'D Pad Up': 'dPadUp',
                'D Pad Left': 'dPadLeft',
                'D Pad Down': 'dPadDown',
                'D Pad Right': 'dPadRight',
                'Right Bumper': 'rightBumper',
                'Button Y': 'buttonY',
                'Button B': 'buttonB',
                'Button X': 'buttonX',
                'Button A': 'buttonA',
                'Right Stick': 'rightStick',
                'Left Trigger': 'leftTrigger',
                'Right Trigger': 'rightTrigger',
                'Menu Button': 'menuButton',
                'View Button': 'viewButton',
                'Profile Button': 'profileButton',
              }).map(([name, tooltipId]) => (
                <HotspotMarker
                  key={name}
                  name={name}
                  position={hotspotPositions[name]}
                  onClick={handleHotspotClick}
                  isSelected={selectedHotspot === name}
                  isHovered={hoveredTooltipId === tooltipId}
                  tooltipId={tooltipId}
                  onHoverChange={setHoveredTooltipId}
                  hoveredTooltipId={hoveredTooltipId}
                  isEditMode={isEditMode}
                  onPositionChange={(newPos) => {
                    setHotspotPositions(prev => ({
                      ...prev,
                      [name]: newPos
                    }));
                  }}
                />
              ))}

              {detailCardHotspot && (
                <HotspotDetailCard
                  hotspotName={detailCardHotspot}
                  position={detailCardPosition}
                  onClose={() => {
                    setDetailCardHotspot(null);
                    setSelectedHotspot(null);
                  }}
                />
              )}
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
        onImport={handleImportProfile}
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

// Hotspot marker component with interactive states
function HotspotMarker({ name, position, onClick, isSelected, isHovered: isHoveredProp, tooltipId, onHoverChange, hoveredTooltipId, isEditMode, onPositionChange }) {
  const [isLocalHovered, setIsLocalHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isHovered = isHoveredProp || isLocalHovered;

  // Safety check: if position is undefined, don't render
  if (!position || position.left === undefined || position.top === undefined) {
    console.warn(`HotspotMarker "${name}" has invalid position:`, position);
    return null;
  }

  const handleClick = (e) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsPinned(!isPinned);
      setShowEditTooltip(true);
    } else if (onClick) {
      onClick(name, e);
    }
  };

  const handleMouseEnter = () => {
    if (!isEditMode) {
      setIsLocalHovered(true);
      if (onHoverChange && tooltipId) {
        onHoverChange(tooltipId);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isEditMode) {
      setIsLocalHovered(false);
      if (onHoverChange && hoveredTooltipId === tooltipId) {
        onHoverChange(null);
      }
    }
  };

  const handleMouseDown = (e) => {
    if (isEditMode) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.left,
        y: e.clientY - position.top
      });
    }
  };

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

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  return (
    <div
      className="absolute"
      style={{ left: `${position.left}px`, top: `${position.top}px` }}
      onMouseEnter={() => !isPinned && setShowEditTooltip(true)}
      onMouseLeave={() => !isPinned && setShowEditTooltip(false)}
    >
      <div
        className={`
          backdrop-blur-[4px] border border-solid
          overflow-hidden rounded-[40px] w-[24px] h-[24px]
          transition-all duration-150 ease-in-out outline-none
          focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-1 focus-visible:ring-offset-black
          ${isEditMode ? 'cursor-move' : 'cursor-pointer'}
          ${
            isSelected
              ? 'bg-[rgba(0,182,250,0.25)] border-primary-default'
              : 'bg-[rgba(43,48,59,0.2)] border-stroke-neutral-default'
          }
          ${isDragging ? 'ring-2 ring-primary-default z-50' : ''}
          ${showEditTooltip && isEditMode && !isPinned ? 'ring-2 ring-yellow-400' : ''}
          ${isPinned ? 'ring-2 ring-green-500' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        title={isEditMode ? `${name} (${position.left}, ${position.top})` : name}
        aria-label={name}
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
                onPositionChange({ left: val, top: position.top });
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
                onPositionChange({ left: position.left, top: val });
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
