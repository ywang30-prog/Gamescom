import SystemHeader from './SystemHeader';

const imgLogoLogitechG = "/figmaAssets/logo-logitech-g.svg";
const imgChevronSmallRight = "/figmaAssets/chevron-small-right.svg";
const imgNotificationOn = "/figmaAssets/notification-on.svg";
const imgProfileAvatar = "/figmaAssets/profile-avatar.png";
const imgArrowRightSmall = "/figmaAssets/arrow-right-small-profile.svg";
const imgOnboardMemoryEmpty = "/figmaAssets/onboard-memory-empty.svg";

/**
 * Unified Headers Component
 * - System Header: 32px at top-0
 * - 8px gap
 * - Navigation/Profile Header: 48px at top-[40px]
 * Total height: 88px
 *
 * @param {Array} breadcrumb - Array of strings or objects {label, onClick}
 * @param {string} activeProfile - Active profile name
 * @param {boolean} isOnboard - Whether current profile is onboard
 * @param {function} onProfileClick - Handler for profile button click
 */
export default function Headers({ breadcrumb = ['DEVICES', 'GHOST'], activeProfile = 'Desktop: Default', isOnboard, onProfileClick }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      {/* System Header - 32px height at top-0 */}
      <div className="absolute top-0 left-0 right-0 h-8">
        <SystemHeader />
      </div>

      {/* Navigation/Profile Header - 48px height at top-[40px] (32px + 8px gap) */}
      <div className="absolute top-[40px] left-0 right-0 h-[48px] bg-black border-b border-[#242424]">
        <div className="flex h-[48px] items-center justify-between w-full px-8">
          {/* Left: Logo + Breadcrumb */}
          <div className="flex gap-4 items-center shrink-0">
            {/* G Logo - 40px × 48px */}
            <div className="h-[48px] w-10 relative shrink-0">
              <div className="absolute left-1 top-1 w-8 h-8 flex items-center justify-center p-1 rounded-[80px]">
                <div className="w-6 h-6 relative shrink-0">
                  <img alt="Logitech G" className="absolute block max-w-none w-full h-full" src={imgLogoLogitechG} />
                </div>
              </div>
            </div>

            {/* Breadcrumb Items */}
            <div className="flex gap-2 items-center shrink-0">
              {breadcrumb.map((item, index) => {
                const label = typeof item === 'string' ? item : item.label;
                const onClick = typeof item === 'object' ? item.onClick : null;
                const isActive = index === breadcrumb.length - 1;
                const isClickable = onClick && !isActive;

                return (
                  <div key={index} className="flex items-center gap-2">
                    {/* Breadcrumb Tab */}
                    <div
                      className={`flex flex-col h-[48px] items-center justify-between pt-3 px-1 rounded-lg shrink-0 ${
                        isClickable ? 'cursor-pointer hover:bg-[#1a1a1a] transition-colors' : ''
                      }`}
                      onClick={isClickable ? onClick : undefined}
                    >
                      <p className={`font-logitech font-bold text-xs leading-[1.16] text-center tracking-[0.36px] uppercase whitespace-nowrap shrink-0 ${
                        isActive ? 'text-primary-default' : 'text-[#a7a7a8]'
                      }`}>
                        {label}
                      </p>
                      <div className={`h-px rounded-[1px] shrink-0 ${
                        isActive ? 'bg-primary-default w-6' : 'w-10'
                      }`} />
                    </div>

                    {/* Chevron separator */}
                    {index < breadcrumb.length - 1 && (
                      <div className="flex h-[48px] items-center shrink-0">
                        <div className="flex flex-col h-[48px] items-center justify-center pb-5 pt-[10px] rounded-lg shrink-0">
                          <div className="w-6 h-6 relative shrink-0">
                            <img alt="" className="absolute block max-w-none w-full h-full" src={imgChevronSmallRight} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Profile selector + Notification + Avatar */}
          <div className="flex gap-4 items-center justify-end pb-2 shrink-0">
            {/* Profile selector button */}
            <button
              onClick={onProfileClick}
              className="bg-[#1a1a1a] border border-[#242424] flex flex-col items-start px-0 rounded-lg shrink-0 transition-all outline-none hover:bg-[#242424] focus-visible:ring-2 focus-visible:ring-primary-default"
            >
              <div className="flex gap-2 h-10 items-center pl-2 pr-0 rounded-lg shrink-0 w-full">
                <div className="flex gap-2 h-full items-center py-2 shrink-0">
                  {/* Profile icon - chip for onboard, G logo for G HUB */}
                  <div className="flex gap-1 h-full items-center shrink-0">
                    <div className="w-6 h-6 relative shrink-0">
                      <img alt="" className="absolute block max-w-none w-full h-full" src={isOnboard ? imgOnboardMemoryEmpty : imgLogoLogitechG} />
                    </div>
                  </div>

                  {/* Active profile badge */}
                  <div className="bg-[rgba(0,184,252,0.14)] flex h-full items-center justify-center px-2 py-0 rounded shrink-0">
                    <div className="flex flex-col justify-center leading-[0] overflow-hidden shrink-0 whitespace-nowrap text-ellipsis">
                      <p className="font-logitech font-bold text-sm leading-[1.3] text-primary-default tracking-[-0.42px] overflow-hidden text-ellipsis">
                        {activeProfile}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow button */}
                <div className="border-l border-[#242424] flex gap-2 h-full items-center px-2 rounded-br-lg rounded-tr-lg shrink-0">
                  <div className="w-6 h-6 relative shrink-0">
                    <img alt="" className="absolute block max-w-none w-full h-full" src={imgArrowRightSmall} />
                  </div>
                </div>
              </div>
            </button>

            {/* Notification icon */}
            <div className="flex flex-wrap items-center justify-center max-h-10 max-w-10 min-h-10 min-w-10 w-10 h-10 shrink-0">
              <div className="flex flex-1 flex-row items-center self-stretch">
                <div className="flex flex-1 gap-0 h-full items-center justify-center min-w-0 overflow-clip p-0 rounded-full">
                  <div className="flex flex-1 gap-2 h-full items-center justify-center min-w-0 p-0">
                    <div className="w-6 h-6 shrink-0 relative">
                      <img alt="Notifications" className="absolute block max-w-none w-full h-full" src={imgNotificationOn} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile picture */}
            <div className="flex items-center justify-end shrink-0">
              <div className="flex items-center justify-center p-1 w-10 h-10 shrink-0">
                <div className="flex flex-1 h-full items-center justify-center min-w-0 rounded-full">
                  <div className="flex-1 h-full min-w-0 relative">
                    <img alt="Profile" className="absolute block max-w-none w-full h-full rounded-full" src={imgProfileAvatar} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
