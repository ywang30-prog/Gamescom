import { useState } from 'react';

const imgLogoLogitechG = "/figmaAssets/logo-logitech-g.svg";
const imgChevronSmallRight = "/figmaAssets/chevron-small-right.svg";
const imgSearchIcon = "/figmaAssets/search-icon.svg"; // TODO: Download this asset
const imgMoreOptions = "/figmaAssets/more-options.svg"; // TODO: Download this asset

/**
 * ProfileModal - Profile selector modal with G HUB and Onboard sections
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Handler for closing modal
 * @param {string} props.activeProfile - Current active profile (e.g., 'desktop', 'fps', 'p1')
 * @param {Function} props.onProfileSelect - Handler for profile selection (profileId)
 */
export default function ProfileModal({ isOpen, onClose, activeProfile, onProfileSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gHubExpanded, setGHubExpanded] = useState(!activeProfile.startsWith('p'));
  const [onboardExpanded, setOnboardExpanded] = useState(activeProfile.startsWith('p'));

  if (!isOpen) return null;

  // G HUB profiles
  const gHubProfiles = [
    { id: 'desktop', name: 'Desktop: Default', isActive: activeProfile === 'desktop' },
    { id: 'fps', name: 'FPS', isActive: activeProfile === 'fps' },
    { id: 'figma', name: 'Figma', isActive: activeProfile === 'figma' },
    { id: 'marvelRivals', name: 'Marvel Rivals', isActive: activeProfile === 'marvelRivals' },
  ];

  // Onboard profiles
  const onboardProfiles = [
    { id: 'p1', name: 'P1', isActive: activeProfile === 'p1' },
    { id: 'p2', name: 'P2', isActive: activeProfile === 'p2' },
    { id: 'p3', name: 'P3', isActive: activeProfile === 'p3' },
  ];

  // Filter profiles based on search
  const filteredGHub = gHubProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOnboard = onboardProfiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = (profileId) => {
    onProfileSelect(profileId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-16 right-8 w-[320px] bg-[#1a1a1a] border border-[#242424] rounded-lg shadow-2xl z-50 flex flex-col max-h-[calc(100vh-96px)]">
        {/* Search bar */}
        <div className="p-3 border-b border-[#242424]">
          <div className="bg-[#242424] flex items-center gap-2 px-3 h-10 rounded-lg">
            <div className="w-4 h-4 opacity-60">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#A7A7A8" strokeWidth="1.5"/>
                <path d="M11 11L14 14" stroke="#A7A7A8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search profiles"
              className="flex-1 bg-transparent outline-none text-sm text-[#e6e6e6] placeholder:text-[#666] font-logitech"
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* G HUB Profiles Section */}
          <div className="border-b border-[#242424]">
            {/* Section header */}
            <button
              onClick={() => setGHubExpanded(!gHubExpanded)}
              className="w-full px-3 py-3 flex items-center justify-between hover:bg-[#242424] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  <img alt="G HUB" src={imgLogoLogitechG} className="w-full h-full" />
                </div>
                <p className="font-logitech font-bold text-xs text-[#a7a7a8] uppercase tracking-wider">
                  G HUB PROFILES
                </p>
              </div>
              <div className={`w-5 h-5 transition-transform ${gHubExpanded ? 'rotate-90' : ''}`}>
                <img alt="" src={imgChevronSmallRight} className="w-full h-full" />
              </div>
            </button>

            {/* Profile list */}
            {gHubExpanded && (
              <div className="pb-2">
                {filteredGHub.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileClick(profile.id)}
                    className={`w-full px-3 py-2 flex items-center justify-between group hover:bg-[#242424] transition-colors ${
                      profile.isActive ? 'bg-[rgba(0,184,252,0.14)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Profile icon - G logo for G HUB profiles */}
                      <div className="w-6 h-6 shrink-0">
                        <img alt="" src={imgLogoLogitechG} className="w-full h-full" />
                      </div>
                      {/* Profile name */}
                      <p className={`font-logitech font-normal text-sm ${
                        profile.isActive ? 'text-primary-default font-bold' : 'text-[#e6e6e6]'
                      } truncate`}>
                        {profile.name}
                      </p>
                      {/* Active chip */}
                      {profile.isActive && (
                        <div className="bg-primary-default/20 px-2 py-0.5 rounded">
                          <p className="font-logitech font-bold text-[10px] text-primary-default uppercase tracking-wider">
                            Active
                          </p>
                        </div>
                      )}
                    </div>
                    {/* More options (three dots) */}
                    <div className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="5" r="1.5" fill="#A7A7A8"/>
                        <circle cx="10" cy="10" r="1.5" fill="#A7A7A8"/>
                        <circle cx="10" cy="15" r="1.5" fill="#A7A7A8"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Onboard Memory Section */}
          <div>
            {/* Section header */}
            <button
              onClick={() => setOnboardExpanded(!onboardExpanded)}
              className="w-full px-3 py-3 flex items-center justify-between hover:bg-[#242424] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5">
                  {/* Using G logo as placeholder for onboard icon */}
                  <img alt="Onboard" src={imgLogoLogitechG} className="w-full h-full opacity-60" />
                </div>
                <p className="font-logitech font-bold text-xs text-[#a7a7a8] uppercase tracking-wider">
                  ONBOARD MEMORY
                </p>
              </div>
              <div className={`w-5 h-5 transition-transform ${onboardExpanded ? 'rotate-90' : ''}`}>
                <img alt="" src={imgChevronSmallRight} className="w-full h-full" />
              </div>
            </button>

            {/* Profile list */}
            {onboardExpanded && (
              <div className="pb-2">
                {filteredOnboard.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileClick(profile.id)}
                    className={`w-full px-3 py-2 flex items-center justify-between group hover:bg-[#242424] transition-colors ${
                      profile.isActive ? 'bg-[rgba(0,184,252,0.14)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Profile icon - onboard icon placeholder */}
                      <div className="w-6 h-6 shrink-0">
                        <img alt="" src={imgLogoLogitechG} className="w-full h-full opacity-60" />
                      </div>
                      {/* Profile name */}
                      <p className={`font-logitech font-normal text-sm ${
                        profile.isActive ? 'text-primary-default font-bold' : 'text-[#e6e6e6]'
                      } truncate`}>
                        {profile.name}
                      </p>
                      {/* Active chip */}
                      {profile.isActive && (
                        <div className="bg-primary-default/20 px-2 py-0.5 rounded">
                          <p className="font-logitech font-bold text-[10px] text-primary-default uppercase tracking-wider">
                            Active
                          </p>
                        </div>
                      )}
                    </div>
                    {/* More options (three dots) */}
                    <div className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="5" r="1.5" fill="#A7A7A8"/>
                        <circle cx="10" cy="10" r="1.5" fill="#A7A7A8"/>
                        <circle cx="10" cy="15" r="1.5" fill="#A7A7A8"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Manage profiles button */}
        <div className="p-3 border-t border-[#242424]">
          <button className="w-full h-10 bg-[#242424] hover:bg-[#2d2d2d] rounded-lg flex items-center justify-center transition-colors">
            <p className="font-logitech font-bold text-sm text-[#e6e6e6]">
              Manage profiles
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
