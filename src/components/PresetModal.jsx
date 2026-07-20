import { useState, useEffect } from 'react';
import Toggle from './Toggle';
import OverflowMenu from './OverflowMenu';

// Image assets from Figma
const imgRadioIcon = "/figmaAssets/radio-unselected.svg";
const imgRadioIconSelected = "/figmaAssets/radio-selected.svg";
const imgColor = "/figmaAssets/search-icon.svg";
const imgVector = "/figmaAssets/ghub-logo.svg";
const imgColor1 = "/figmaAssets/info-icon.svg";
const imgColor2 = "/figmaAssets/chevron-small.svg";
const imgPath = "/figmaAssets/more-options-dot.svg";
const imgVector1 = "/figmaAssets/onboard-memory-icon.svg";
const imgVector2 = "/figmaAssets/more-options-dot.svg";
const imgGameIcon = "/figmaAssets/game-icon.svg";
const imgProfileIcon = "/figmaAssets/profile-icon.svg";

export default function PresetModal({ isOpen, onClose, onSave, currentPreset, onOpenImportModal }) {
  const isOnboardPreset = (preset) => ['p1', 'p2', 'p3'].includes(preset);

  const [selectedPreset, setSelectedPreset] = useState(currentPreset);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    ghub: true,
    desktop: true,
    onboard: true,
  });
  const [onboardMemoryEnabled, setOnboardMemoryEnabled] = useState(isOnboardPreset(currentPreset));
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Update onboard memory toggle when modal opens or currentPreset changes
  useEffect(() => {
    if (isOpen) {
      setOnboardMemoryEnabled(isOnboardPreset(currentPreset));
      setSelectedPreset(currentPreset);
    }
  }, [isOpen, currentPreset]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = () => {
    onSave(selectedPreset);
    onClose();
  };

  const handleMenuOpen = (presetId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.top,
      left: rect.right + 8,
    });
    setOpenMenuId(presetId);
  };

  const handleMenuItemClick = (item) => {
    console.log(`Menu item clicked: ${item} for preset ${openMenuId}`);

    if (item === 'Import G HUB Profile' && onOpenImportModal) {
      onOpenImportModal(openMenuId);
    }

    // Handle other menu item actions here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background-950 rounded-16 shadow-[20px_20px_40px_0px_rgba(0,0,0,0.4)] w-[456px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Overflow Menu */}
        <OverflowMenu
          isOpen={openMenuId !== null}
          onClose={() => setOpenMenuId(null)}
          position={menuPosition}
          onItemClick={handleMenuItemClick}
        />
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8">
            {/* G HUB Section */}
            <div className="flex flex-col gap-04">
              {/* G HUB Header */}
              <button
                onClick={() => toggleSection('ghub')}
                className="flex gap-2 h-10 items-center px-3 pr-1 rounded-08 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
              >
                <div className="relative shrink-0 w-6 h-6">
                  <div className="absolute inset-[8.33%_10.65%]">
                    <img alt="G HUB Logo" className="absolute block max-w-none w-full h-full" src={imgVector} />
                  </div>
                </div>
                <div className="flex flex-1 gap-2 items-center">
                  <p className="font-logitech font-bold text-text-neutral-default text-base tracking-[-0.48px] leading-[1.28] overflow-hidden text-ellipsis whitespace-nowrap">
                    G HUB
                  </p>
                  <div className="relative shrink-0 w-5 h-5">
                    <div className="absolute inset-[8.33%]">
                      <img alt="Info" className="absolute block max-w-none w-full h-full" src={imgColor1} />
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-8 h-8">
                  <div className={`absolute left-1 w-6 h-6 top-1 transition-transform ${expandedSections.ghub ? '' : 'rotate-180'}`}>
                    <div className="absolute inset-[37.5%_31.25%]">
                      <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgColor2} />
                    </div>
                  </div>
                </div>
              </button>

              {expandedSections.ghub && (
                <>
                  {/* Search and Manage */}
                  <div className="flex gap-2 items-start py-2">
                    <div className="flex-1 bg-[#2e2e2e] rounded-lg h-10 flex items-center gap-2 px-3 border border-transparent focus-within:border-[#00b6fa] transition-all relative overflow-hidden group">
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[rgba(251,251,251,0.14)] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />

                      <div className="relative shrink-0 w-4 h-4 z-10">
                        <div className="absolute inset-[16.67%]">
                          <img alt="Search" className="absolute block max-w-none w-full h-full" src={imgColor} />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-text-neutral-muted font-logitech text-[14px] tracking-[-0.42px] leading-[1.3] outline-none placeholder:text-text-neutral-muted relative z-10"
                      />
                    </div>
                    <button className="border-2 border-stroke-neutral-default h-10 px-6 rounded-40 hover:bg-surface-neutral-default/30 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default flex items-center justify-center">
                      <p className="font-logitech font-bold text-text-neutral-default text-sm tracking-[0.42px] uppercase leading-[1.16]">
                        Manage
                      </p>
                    </button>
                  </div>

                  {/* Desktop Section */}
                  <div className="flex flex-col gap-04">
                    <button
                      onClick={() => toggleSection('desktop')}
                      className="flex gap-2 h-10 items-center px-3 pr-1 rounded-08 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
                    >
                      <p className="flex-1 font-logitech text-text-neutral-muted text-sm tracking-[-0.42px] leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap text-left">
                        Desktop
                      </p>
                      <div className="relative shrink-0 w-8 h-8">
                        <div className={`absolute left-1 w-6 h-6 top-1 transition-transform ${expandedSections.desktop ? '' : 'rotate-180'}`}>
                          <div className="absolute inset-[37.5%_31.25%]">
                            <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgColor2} />
                          </div>
                        </div>
                      </div>
                    </button>

                    {expandedSections.desktop && (
                      <>
                        <ProfileItem
                          id="desktop"
                          name="Default"
                          selected={selectedPreset === 'desktop'}
                          onClick={() => setSelectedPreset('desktop')}
                          showVerticalDots={true}
                          onMenuClick={handleMenuOpen}
                        />
                        <ProfileItem
                          id="fps"
                          name="First Person Shooter"
                          selected={selectedPreset === 'fps'}
                          onClick={() => setSelectedPreset('fps')}
                          showVerticalDots={true}
                          onMenuClick={handleMenuOpen}
                        />
                      </>
                    )}
                  </div>

                  {/* Figma Section */}
                  <CollapsedSection name="Figma" icon={imgProfileIcon} onClick={() => setSelectedPreset('figma')} />

                  {/* Marvel Rivals Section */}
                  <CollapsedSection name="Marvel Rivals" icon={imgGameIcon} onClick={() => setSelectedPreset('marvelRivals')} />
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-stroke-neutral-disabled w-full" />

            {/* Onboard Memory Section */}
            <div className="flex flex-col gap-04">
              <button
                onClick={() => toggleSection('onboard')}
                className="flex gap-2 h-10 items-center px-3 pr-1 rounded-08 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
              >
                <div className="relative shrink-0 w-6 h-6">
                  <div className="absolute inset-[1.91%_2.47%_4.29%_3.72%]">
                    <img alt="Onboard Memory" className="absolute block max-w-none w-full h-full" src={imgVector1} />
                  </div>
                </div>
                <div className="flex flex-1 gap-2 items-center">
                  <p className="font-logitech font-bold text-text-neutral-default text-base tracking-[-0.48px] leading-[1.28] overflow-hidden text-ellipsis whitespace-nowrap">
                    Onboard Memory
                  </p>
                  <div className="relative shrink-0 w-5 h-5">
                    <div className="absolute inset-[8.33%]">
                      <img alt="Info" className="absolute block max-w-none w-full h-full" src={imgColor1} />
                    </div>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Toggle
                    enabled={onboardMemoryEnabled}
                    onChange={setOnboardMemoryEnabled}
                  />
                </div>
                <div className="relative shrink-0 w-8 h-8">
                  <div className={`absolute left-1 w-6 h-6 top-1 transition-transform ${expandedSections.onboard ? '' : 'rotate-180'}`}>
                    <div className="absolute inset-[37.5%_31.25%]">
                      <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgColor2} />
                    </div>
                  </div>
                </div>
              </button>

              {expandedSections.onboard && onboardMemoryEnabled && (
                <>
                  <ProfileItem
                    id="p1"
                    name="P1: Desktop: Default"
                    selected={selectedPreset === 'p1'}
                    onClick={() => setSelectedPreset('p1')}
                    showVerticalDots={true}
                    onMenuClick={handleMenuOpen}
                  />
                  <ProfileItem
                    id="p2"
                    name="P2 Ghost"
                    selected={selectedPreset === 'p2'}
                    onClick={() => setSelectedPreset('p2')}
                    showVerticalDots={true}
                    onMenuClick={handleMenuOpen}
                  />
                  <ProfileItem
                    id="p3"
                    name="P3 Ghost"
                    selected={selectedPreset === 'p3'}
                    onClick={() => setSelectedPreset('p3')}
                    showVerticalDots={true}
                    onMenuClick={handleMenuOpen}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stroke-neutral-disabled" />

        {/* Footer Actions */}
        <div className="flex gap-6 items-center justify-end p-8">
          <button
            onClick={onClose}
            className="border-2 border-stroke-neutral-default h-10 px-6 rounded-40 hover:bg-surface-neutral-default/30 active:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default flex items-center justify-center"
          >
            <p className="font-logitech font-bold text-text-neutral-default text-sm tracking-[0.42px] uppercase leading-[1.16]">
              Cancel
            </p>
          </button>
          <button
            onClick={handleSave}
            className="bg-primary-default h-10 px-6 rounded-40 hover:bg-[#00a0e0] active:bg-[#0090d0] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black flex items-center justify-center"
          >
            <p className="font-logitech font-bold text-[#050505] text-sm tracking-[0.42px] uppercase leading-[1.16]">
              Save
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Profile Item Component
function ProfileItem({ id, name, selected, onClick, showVerticalDots = false, onMenuClick }) {
  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(id, e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex gap-1 h-10 items-center pl-6 pr-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default rounded-08 w-full ${
          selected ? 'bg-[#021d2c]' : 'hover:bg-surface-neutral-default/30'
        }`}
      >
        <div className="relative shrink-0 w-9 h-9">
          <img
            alt="Radio"
            className="absolute block max-w-none w-5 h-5 left-2 top-2"
            src={selected ? imgRadioIconSelected : imgRadioIcon}
          />
        </div>
        <p
          className={`flex-1 font-logitech ${
            selected ? 'font-bold text-primary-default' : 'text-text-neutral-muted'
          } text-sm tracking-[-0.42px] leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap text-left`}
        >
          {name}
        </p>
        <button
          onClick={handleMenuClick}
          className="relative shrink-0 w-6 h-6 hover:bg-surface-neutral-default/50 rounded-04 transition-colors"
        >
          {showVerticalDots ? (
            <>
              <div className="-translate-y-1/2 absolute aspect-[2/2] flex items-center justify-center left-[45.83%] right-[45.83%] top-[calc(50%-6px)]">
                <div className="flex-none rotate-90 w-[2px] h-[2px]">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-[-25%]">
                      <img alt="" className="block max-w-none w-full h-full" src={imgPath} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="-translate-y-1/2 absolute aspect-[2/2] flex items-center justify-center left-[45.83%] right-[45.83%] top-1/2">
                <div className="flex-none rotate-90 w-[2px] h-[2px]">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-[-25%]">
                      <img alt="" className="block max-w-none w-full h-full" src={imgPath} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="-translate-y-1/2 absolute aspect-[2/2] flex items-center justify-center left-[45.83%] right-[45.83%] top-[calc(50%+6px)]">
                <div className="flex-none rotate-90 w-[2px] h-[2px]">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-[-25%]">
                      <img alt="" className="block max-w-none w-full h-full" src={imgPath} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </button>
      </button>
    </div>
  );
}

// Collapsed Section Component
function CollapsedSection({ name, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="flex gap-2 h-10 items-center px-3 pr-1 rounded-08 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
    >
      {icon && (
        <div className="relative shrink-0 w-4 h-4">
          <img alt="" className="w-full h-full object-contain" src={icon} />
        </div>
      )}
      <p className="flex-1 font-logitech text-text-neutral-muted text-sm tracking-[-0.42px] leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap text-left">
        {name}
      </p>
      <div className="relative shrink-0 w-8 h-8">
        <div className="absolute left-1 w-6 h-6 top-1 rotate-180">
          <div className="absolute inset-[37.5%_31.25%]">
            <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgColor2} />
          </div>
        </div>
      </div>
    </button>
  );
}
