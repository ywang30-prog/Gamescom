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
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Handler for closing modal
 * @param {string} props.activeProfile - Current active profile (e.g., 'desktop', 'fps', 'p2')
 * @param {Function} props.onProfileSelect - Handler for profile selection (profileId)
 */
export default function ProfileModal({ isOpen, onClose, activeProfile, onProfileSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Determine which section should be expanded based on active profile type
  const isOnboardActive = activeProfile.startsWith('p');
  const [expandedSection, setExpandedSection] = useState(isOnboardActive ? 'onboard' : 'ghub');

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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-[504px] top-[101px] w-[432px] bg-[#1a1a1a] border border-[#242424] rounded-2xl shadow-[20px_20px_40px_0px_rgba(0,0,0,0.4)] z-50 flex flex-col overflow-hidden">
        {/* Title bar */}
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

        {/* Search bar */}
        <div className="border-b border-[#242424] flex flex-col gap-6 items-start justify-center pb-4 px-4">
          <div className="border border-[#2e2e2e] flex flex-wrap gap-y-2 h-10 items-center px-0 rounded-lg w-full">
            <div className="flex flex-1 flex-row items-center self-stretch">
              <div className="flex flex-1 gap-2 h-full items-center min-w-0 px-2 py-0 rounded-lg">
                <div className="flex gap-2 items-center shrink-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="" className="absolute block max-w-none w-full h-full" src={imgSearch} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="flex flex-col justify-center leading-[0] overflow-hidden text-ellipsis whitespace-nowrap bg-transparent outline-none font-logitech text-sm leading-[1.3] text-[#a7a7a8] tracking-[-0.42px] border-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 items-start px-4 py-2">
          {/* G HUB Profiles Section */}
          <div className="flex flex-col gap-1 items-start w-full">
            {/* Section header */}
            <button
              onClick={() => toggleSection('ghub')}
              className="flex flex-wrap gap-y-2 h-10 items-center justify-center w-full hover:opacity-80 transition-opacity"
            >
              <div className="flex flex-1 flex-row items-center self-stretch">
                <div className="flex flex-1 h-full items-center justify-between min-w-0 pr-1">
                  <div className="flex gap-2 items-center shrink-0">
                    <div className="w-6 h-6 relative shrink-0">
                      <img alt="" className="absolute block max-w-none w-full h-full" src={imgLogoLogitechG} />
                    </div>
                    <div className="flex flex-col justify-center leading-[0] overflow-hidden text-ellipsis whitespace-nowrap">
                      <p className="font-logitech font-bold text-sm leading-[1.3] text-[#00b8fc] tracking-[-0.42px] overflow-hidden text-ellipsis">
                        G HUB Profiles
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center shrink-0">
                    <div className="w-6 h-6 relative shrink-0">
                      <img alt="" className="absolute block max-w-none w-full h-full" src={expandedSection === 'ghub' ? imgChevronUpSmall : imgChevronDownSmall} />
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Profile list */}
            {expandedSection === 'ghub' && (
              <div className="border border-[#242424] flex gap-1 items-start p-1 rounded-lg w-full">
                <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
                  {sortedGHub.map((profile) => {
                    const isActive = profile.id === activeProfile;
                    return (
                      <div key={profile.id} className="flex flex-wrap gap-y-2 items-start w-full">
                        <button
                          onClick={() => handleProfileClick(profile.id)}
                          className={`flex flex-1 gap-2 h-10 items-center min-w-0 pl-3 pr-0 rounded ${
                            isActive ? 'bg-[rgba(0,184,252,0.14)]' : 'hover:bg-[#242424]'
                          } transition-colors`}
                        >
                          <div className={`flex flex-1 flex-col h-6 justify-center leading-[0] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${
                            isActive ? 'font-bold' : ''
                          }`}>
                            <p className={`font-logitech text-sm leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis ${
                              isActive ? 'text-[#00b8fc] font-bold' : 'text-[#e6e6e6]'
                            }`}>
                              {profile.name}
                            </p>
                          </div>
                          {isActive && (
                            <div className="border border-[#00b8fc] flex flex-wrap h-6 items-center justify-center max-h-6 min-h-6 rounded shrink-0">
                              <div className="flex flex-row items-center self-stretch">
                                <div className="flex gap-0 h-full items-center overflow-clip p-0 rounded shrink-0">
                                  <div className="flex h-full items-center justify-center px-3 py-0 shrink-0">
                                    <div className="flex flex-col justify-center leading-[0] whitespace-nowrap">
                                      <p className="font-logitech text-xs leading-[1.3] text-[#00b8fc] text-center">
                                        Active
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="w-6 h-6 relative shrink-0">
                            <img alt="" className="absolute block max-w-none w-full h-full" src={imgMoreOptionsVertical} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-[rgba(251,251,251,0.02)] rounded-3xl self-stretch w-[6px] shrink-0">
                  <div className="bg-[#2e2e2e] h-14 w-[6px] rounded-lg" />
                </div>
              </div>
            )}
          </div>

          {/* Onboard Memory Section */}
          <div className="flex flex-col gap-1 items-start w-full">
            {/* Section header */}
            <div className="flex flex-wrap gap-y-2 h-12 items-center justify-center w-full">
              <button
                onClick={() => toggleSection('onboard')}
                className="flex flex-1 flex-row items-center self-stretch hover:opacity-80 transition-opacity"
              >
                <div className="flex flex-1 h-full items-center justify-between min-w-0 pr-1">
                  <div className="flex gap-2 items-center shrink-0">
                    <div className="w-6 h-6 relative shrink-0">
                      <img alt="" className="absolute block max-w-none w-full h-full" src={imgOnboardMemoryEmpty} />
                    </div>
                    <div className="flex flex-col justify-center leading-[0] overflow-hidden text-ellipsis whitespace-nowrap">
                      <p className="font-logitech font-bold text-sm leading-[1.3] text-[#e6e6e6] tracking-[-0.42px] overflow-hidden text-ellipsis">
                        Onboard Memory
                      </p>
                    </div>
                    <div className="border-2 border-[#2e2e2e] flex h-7 items-center max-h-7 min-h-7 px-3 py-0 rounded-full shrink-0 hover:bg-[#242424] transition-colors">
                      <div className="flex flex-col justify-center leading-[0] whitespace-nowrap">
                        <p className="font-logitech font-bold text-xs leading-[1.3] text-[#a7a7a8]">
                          Restore
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    <div className="w-6 h-6 relative shrink-0">
                      <img alt="" className="absolute block max-w-none w-full h-full" src={expandedSection === 'onboard' ? imgChevronUpSmall : imgChevronDownSmall} />
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Profile list */}
            {expandedSection === 'onboard' && (
              <div className="border border-[#242424] flex gap-1 items-start p-1 rounded-lg w-full">
                <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
                  {sortedOnboard.map((profile) => {
                    const isActive = profile.id === activeProfile;
                    return (
                      <div key={profile.id} className="flex flex-wrap gap-y-2 items-start w-full">
                        <button
                          onClick={() => handleProfileClick(profile.id)}
                          className={`flex flex-1 gap-2 h-10 items-center min-w-0 pl-3 pr-0 rounded ${
                            isActive ? 'bg-[rgba(0,184,252,0.14)]' : 'hover:bg-[#242424]'
                          } transition-colors`}
                        >
                          <div className={`flex flex-1 flex-col h-6 justify-center leading-[0] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${
                            isActive ? 'font-bold' : ''
                          }`}>
                            <p className={`font-logitech text-sm leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis ${
                              isActive ? 'text-[#00b8fc] font-bold' : 'text-[#e6e6e6]'
                            }`}>
                              {profile.name}
                            </p>
                          </div>
                          {isActive && (
                            <div className="border border-[#00b8fc] flex flex-wrap h-6 items-center justify-center max-h-6 min-h-6 rounded shrink-0">
                              <div className="flex flex-row items-center self-stretch">
                                <div className="flex gap-0 h-full items-center overflow-clip p-0 rounded shrink-0">
                                  <div className="flex h-full items-center justify-center px-3 py-0 shrink-0">
                                    <div className="flex flex-col justify-center leading-[0] whitespace-nowrap">
                                      <p className="font-logitech text-xs leading-[1.3] text-[#00b8fc] text-center">
                                        Active
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="w-6 h-6 relative shrink-0">
                            <img alt="" className="absolute block max-w-none w-full h-full" src={imgMoreOptionsVertical} />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-[rgba(251,251,251,0.02)] rounded-3xl self-stretch w-[6px] shrink-0">
                  <div className="bg-[#2e2e2e] h-14 w-[6px] rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manage profiles button */}
        <div className="border-t border-[#242424] flex items-center justify-center pt-4 px-4 pb-4">
          <div className="flex gap-4 items-center shrink-0">
            <button className="border-2 border-[#2e2e2e] h-8 px-3 py-0 rounded-full hover:bg-[#242424] transition-colors">
              <div className="flex flex-col justify-center leading-[0] whitespace-nowrap">
                <p className="font-logitech font-bold text-xs leading-[1.3] text-[#a7a7a8] uppercase tracking-[0.36px]">
                  Manage profiles
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
