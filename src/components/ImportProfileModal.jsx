import { useState } from 'react';

// Image assets
const imgRadioIcon = "/figmaAssets/radio-unselected.svg";
const imgRadioIconSelected = "/figmaAssets/radio-selected.svg";
const imgChevron = "/figmaAssets/chevron-small.svg";

export default function ImportProfileModal({ isOpen, onClose, onImport, targetProfile }) {
  const [selectedProfile, setSelectedProfile] = useState('desktop');
  const [expandedSections, setExpandedSections] = useState({
    desktop: true,
    figma: false,
    marvelRivals: false,
  });

  const handleImport = () => {
    onImport(targetProfile, selectedProfile);
    onClose();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen) return null;

  const profileNames = {
    p1: 'P1: Desktop: Default',
    p2: 'P2',
    p3: 'P3',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background-950 rounded-16 shadow-[20px_20px_40px_0px_rgba(0,0,0,0.4)] w-[456px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <h2 className="font-logitech font-bold text-text-neutral-default text-2xl tracking-[-0.96px] leading-[28px]">
                Import G HUB Profile
              </h2>
              <p className="font-logitech text-text-neutral-muted text-base tracking-[-0.48px] leading-[1.28]">
                Select the G HUB profile you'd like to import to <span className="font-bold">{profileNames[targetProfile] || targetProfile} Onboard Memory.</span>
              </p>
            </div>

            {/* Profile Sections */}
            <div className="flex flex-col gap-04 w-[388px]">
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
                        <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgChevron} />
                      </div>
                    </div>
                  </div>
                </button>

                {expandedSections.desktop && (
                  <>
                    <ProfileItem
                      id="desktop"
                      name="Default"
                      selected={selectedProfile === 'desktop'}
                      onClick={() => setSelectedProfile('desktop')}
                    />
                    <ProfileItem
                      id="fps"
                      name="First Person Shooter"
                      selected={selectedProfile === 'fps'}
                      onClick={() => setSelectedProfile('fps')}
                    />
                  </>
                )}
              </div>

              {/* Figma Section */}
              <CollapsedSection
                name="Figma"
                expanded={expandedSections.figma}
                onToggle={() => toggleSection('figma')}
              />

              {/* Marvel Rivals Section */}
              <CollapsedSection
                name="Marvel Rivals"
                expanded={expandedSections.marvelRivals}
                onToggle={() => toggleSection('marvelRivals')}
              />
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
            onClick={handleImport}
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
function ProfileItem({ id, name, selected, onClick }) {
  return (
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
    </button>
  );
}

// Collapsed Section Component
function CollapsedSection({ name, expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex gap-2 h-10 items-center px-3 pr-1 rounded-08 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
    >
      <p className="flex-1 font-logitech text-text-neutral-muted text-sm tracking-[-0.42px] leading-[1.3] overflow-hidden text-ellipsis whitespace-nowrap text-left">
        {name}
      </p>
      <div className="relative shrink-0 w-8 h-8">
        <div className={`absolute left-1 w-6 h-6 top-1 transition-transform ${expanded ? '' : 'rotate-180'}`}>
          <div className="absolute inset-[37.5%_31.25%]">
            <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgChevron} />
          </div>
        </div>
      </div>
    </button>
  );
}
