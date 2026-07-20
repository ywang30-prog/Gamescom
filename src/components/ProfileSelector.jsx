// Image assets
const imgOnboardMemoryIcon = "/figmaAssets/onboard-memory-empty-icon.svg";
const imgGhubLogo = "/figmaAssets/ghub-logo.svg";
const imgChevron = "/figmaAssets/chevron-icon.svg";

export default function ProfileSelector({
  currentPreset,
  hasUnsavedChanges,
  onPresetClick,
  onSaveSettings
}) {
  const isOnboardPreset = (preset) => {
    return ['p1', 'p2', 'p3'].includes(preset);
  };

  const getPresetDisplayName = () => {
    const presets = {
      desktop: 'Desktop: Default',
      fps: 'Desktop: First Person Shooter',
      figma: 'Figma',
      marvelRivals: 'Marvel Rivals',
      p1: 'P1: Desktop: Default',
      p2: 'P2 Ghost',
      p3: 'P3 Ghost',
    };
    return presets[currentPreset] || 'Desktop: Default';
  };

  const getPresetLabel = () => {
    return isOnboardPreset(currentPreset) ? 'GHOST' : 'G HUB';
  };

  const getPresetIcon = () => {
    return isOnboardPreset(currentPreset) ? imgOnboardMemoryIcon : imgGhubLogo;
  };

  return (
    <button
      onClick={onPresetClick}
      className="bg-[#242424] flex h-14 items-center justify-between p-2 rounded-lg hover:opacity-80 transition-opacity"
      style={{ width: '100%', cursor: 'pointer' }}
    >
      <div className="flex gap-3 items-center flex-1" style={{ pointerEvents: 'none' }}>
        <div className="bg-[#1a1a1a] relative rounded-full shrink-0 w-10 h-10 flex items-center justify-center">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-[8.33%]">
              <img
                alt={getPresetLabel()}
                className="absolute block max-w-none w-full h-full"
                src={getPresetIcon()}
                draggable="false"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2px] items-start">
          <p className="font-logitech text-primary-default text-xs leading-[1.3]">
            {getPresetLabel()}
          </p>
          <p className="font-logitech font-bold text-[#e6e6e6] text-sm tracking-[-0.42px] leading-[1.3]">
            {getPresetDisplayName()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center" style={{ pointerEvents: 'none' }}>
        {/* Save button - only shown for onboard profiles */}
        {isOnboardPreset(currentPreset) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSaveSettings();
            }}
            disabled={!hasUnsavedChanges}
            style={{ pointerEvents: 'auto' }}
            className={`h-8 px-6 rounded-full font-logitech font-bold text-xs tracking-[0.36px] uppercase flex items-center justify-center transition-colors ${
              hasUnsavedChanges
                ? 'bg-[#00b6fa] text-black hover:bg-[#00a0e0] active:bg-[#0090d0]'
                : 'bg-[#242424] text-[#666] cursor-not-allowed'
            }`}
          >
            Save
          </button>
        )}

        <div className="overflow-hidden relative shrink-0 w-6 h-6 flex items-center justify-center">
          <div className="absolute inset-[29.17%_37.5%]">
            <img alt="Chevron" className="absolute block max-w-none w-full h-full" src={imgChevron} draggable="false" />
          </div>
        </div>
      </div>
    </button>
  );
}
