import { useState } from 'react';

const imgLogoLogitechG = "/figmaAssets/logo-logitech-g.svg";
const imgCloseSmall = "/figmaAssets/close-small.svg";
const imgSearch = "/figmaAssets/search.svg";
const imgChevronUpSmall = "/figmaAssets/chevron-up-small.svg";
const imgChevronDownSmall = "/figmaAssets/chevron-down-small.svg";
const imgMoreOptionsVertical = "/figmaAssets/more-options-vertical.svg";
const imgOnboardMemoryEmpty = "/figmaAssets/onboard-memory-empty.svg";

/**
 * ProfileModal - Profile selector modal with G HUB and Onboard sections
 * Centered on screen, 432px wide
 */
export default function ProfileModal({ isOpen, onClose, activeProfile, onProfileSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Both sections can be expanded independently
  const isOnboardActive = activeProfile.startsWith('p');
  const [gHubExpanded, setGHubExpanded] = useState(!isOnboardActive);
  const [onboardExpanded, setOnboardExpanded] = useState(isOnboardActive);

  if (!isOpen) return null;

  // G HUB profiles
  const gHubProfiles = [
    { id: 'desktop', name: 'Desktop: Default' },
    { id: 'fps', name: 'First Person Shoother' },
    { id: 'p3ghost', name: 'P3: Ghost' },
  ];

  // Onboard profiles
  const onboardProfiles = [
    { id: 'p1', name: 'P1' },
    { id: 'p2', name: 'P2: Ghost' },
    { id: 'p3', name: 'P3' },
  ];

  // Filter profiles based on search
  const filteredGHub = gHubProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOnboard = onboardProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort profiles - active profile first
  const sortedGHub = [...filteredGHub].sort((a, b) => {
    if (a.id === activeProfile) return -1;
    if (b.id === activeProfile) return 1;
    return 0;
  });

  const sortedOnboard = [...filteredOnboard].sort((a, b) => {
    if (a.id === activeProfile) return -1;
    if (b.id === activeProfile) return 1;
    return 0;
  });

  const handleProfileClick = (profileId) => {
    onProfileSelect(profileId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
      />

      {/* Modal - centered on screen */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[432px] bg-[#1a1a1a] border border-[#242424] rounded-2xl shadow-[20px_20px_40px_0px_rgba(0,0,0,0.4)] z-50 flex flex-col overflow-hidden">
        {/* Title bar - p-4 all around */}
        <div className="border-b border-[#242424] flex flex-col gap-6 items-start p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col justify-center leading-[0]">
              <p className="font-logitech font-bold text-xl leading-[28px] text-[#e6e6e6] tracking-[-0.8px]">
                Profiles
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={onClose}
                className="border-2 border-[#2e2e2e] flex gap-0 items-center justify-center overflow-clip p-0 rounded-full w-8 h-8 hover:bg-[#242424] transition-colors"
              >
                <div className="flex flex-1 gap-2 h-full items-center justify-center min-w-0 p-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="Close" className="absolute block max-w-none w-full h-full" src={imgCloseSmall} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search bar - pb-4 px-4 (NO top padding) */}
        <div className="border-b border-[#242424] flex flex-col gap-6 items-start pb-4 px-4">
          <div className="border border-[#2e2e2e] flex h-10 items-center px-0 rounded-lg w-full">
            <div className="flex flex-1 items-center">
              <div className="flex flex-1 gap-2 h-full items-center px-2 rounded-lg">
                <div className="flex gap-2 items-center shrink-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="" className="absolute block max-w-none w-full h-full" src={imgSearch} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none font-logitech text-sm leading-[1.3] text-[#a7a7a8] tracking-[-0.42px] border-none placeholder:text-[#a7a7a8]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - px-4 only */}
        <div className="flex flex-col gap-2 items-start px-4">
          {/* G HUB Profiles Section */}
          <div className="flex flex-col gap-1 items-start w-full">
            {/* Section header - h-10 */}
            <button
              onClick={() => setGHubExpanded(!gHubExpanded)}
              className="flex h-10 items-center w-full hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-1 h-full items-center justify-between pr-1">
                <div className="flex gap-2 items-center shrink-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="" className="absolute block max-w-none w-full h-full" src={imgLogoLogitechG} />
                  </div>
                  <p className="font-logitech font-bold text-sm leading-[1.3] text-[#00b8fc] tracking-[-0.42px]">
                    G HUB Profiles
                  </p>
                </div>
                <div className="w-6 h-6 relative shrink-0">
                  <img alt="" className="absolute block max-w-none w-full h-full" src={gHubExpanded ? imgChevronUpSmall : imgChevronDownSmall} />
                </div>
              </div>
            </button>

            {/* Profile list - border, p-1, gap-1 */}
            {gHubExpanded && (
              <div className="border border-[#242424] flex gap-1 items-start p-1 rounded-lg w-full">
                <div className="flex flex-1 flex-col gap-1 items-start">
                  {sortedGHub.map((profile) => {
                    const isActive = profile.id === activeProfile;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => handleProfileClick(profile.id)}
                        className={`flex gap-2 h-10 items-center w-full pl-3 pr-0 rounded ${
                          isActive ? 'bg-[rgba(0,184,252,0.14)]' : 'hover:bg-[#242424]'
                        } transition-colors`}
                      >
                        {/* Profile name - flex-1 for left alignment */}
                        <div className="flex-1 flex flex-col h-6 justify-center leading-[0] min-w-0 overflow-hidden">
                          <p className={`font-logitech text-sm leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap text-left ${
                            isActive ? 'text-[#00b8fc] font-bold' : 'text-[#a7a7a8]'
                          }`}>
                            {profile.name}
                          </p>
                        </div>

                        {/* Active badge */}
                        {isActive && (
                          <div className="border border-[#00b8fc] flex h-6 items-center justify-center rounded shrink-0">
                            <div className="flex items-center h-full px-3">
                              <p className="font-logitech text-xs leading-[1.3] text-[#00b8fc]">
                                Active
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Kebab menu */}
                        <div className="w-6 h-6 relative shrink-0">
                          <img alt="" className="absolute block max-w-none w-full h-full" src={imgMoreOptionsVertical} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Scrollbar */}
                <div className="bg-[rgba(251,251,251,0.02)] rounded-3xl self-stretch w-[6px] shrink-0">
                  <div className="bg-[#2e2e2e] h-14 w-[6px] rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Onboard Memory Section */}
          <div className="flex flex-col gap-1 items-start w-full">
            {/* Section header - h-10 (same as G HUB) */}
            <button
              onClick={() => setOnboardExpanded(!onboardExpanded)}
              className="flex h-10 items-center w-full hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-1 h-full items-center justify-between pr-1">
                <div className="flex gap-2 items-center shrink-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="" className="absolute block max-w-none w-full h-full" src={imgOnboardMemoryEmpty} />
                  </div>
                  <p className="font-logitech font-bold text-sm leading-[1.3] text-[#e6e6e6] tracking-[-0.42px]">
                    Onboard Memory
                  </p>
                  <div className="border-2 border-[#2e2e2e] flex h-7 items-center px-3 rounded-full shrink-0 hover:bg-[#242424] transition-colors">
                    <p className="font-logitech font-bold text-xs leading-[1.3] text-[#a7a7a8]">
                      Restore
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 relative shrink-0">
                  <img alt="" className="absolute block max-w-none w-full h-full" src={onboardExpanded ? imgChevronUpSmall : imgChevronDownSmall} />
                </div>
              </div>
            </button>

            {/* Profile list */}
            {onboardExpanded && (
              <div className="border border-[#242424] flex gap-1 items-start p-1 rounded-lg w-full">
                <div className="flex flex-1 flex-col gap-1 items-start">
                  {sortedOnboard.map((profile) => {
                    const isActive = profile.id === activeProfile;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => handleProfileClick(profile.id)}
                        className={`flex gap-2 h-10 items-center w-full pl-3 pr-0 rounded ${
                          isActive ? 'bg-[rgba(0,184,252,0.14)]' : 'hover:bg-[#242424]'
                        } transition-colors`}
                      >
                        {/* Profile name - flex-1 for left alignment */}
                        <div className="flex-1 flex flex-col h-6 justify-center leading-[0] min-w-0 overflow-hidden">
                          <p className={`font-logitech text-sm leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap text-left ${
                            isActive ? 'text-[#00b8fc] font-bold' : 'text-[#a7a7a8]'
                          }`}>
                            {profile.name}
                          </p>
                        </div>

                        {/* Active badge */}
                        {isActive && (
                          <div className="border border-[#00b8fc] flex h-6 items-center justify-center rounded shrink-0">
                            <div className="flex items-center h-full px-3">
                              <p className="font-logitech text-xs leading-[1.3] text-[#00b8fc]">
                                Active
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Kebab menu */}
                        <div className="w-6 h-6 relative shrink-0">
                          <img alt="" className="absolute block max-w-none w-full h-full" src={imgMoreOptionsVertical} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Scrollbar */}
                <div className="bg-[rgba(251,251,251,0.02)] rounded-3xl self-stretch w-[6px] shrink-0">
                  <div className="bg-[#2e2e2e] h-14 w-[6px] rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - border-top, pt-4 px-4 */}
        <div className="border-t border-[#242424] flex items-center justify-center pt-4 px-4 pb-4">
          <button className="border-2 border-[#2e2e2e] h-8 px-3 rounded-full hover:bg-[#242424] transition-colors">
            <p className="font-logitech font-bold text-xs leading-[1.3] text-[#a7a7a8] uppercase tracking-[0.36px]">
              Manage profiles
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
