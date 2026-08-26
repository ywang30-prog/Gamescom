const imgLogoLogitechG = "/figmaAssets/logo-logitech-g.svg";
const imgChevronSmallRight = "/figmaAssets/chevron-small-right.svg";
const imgNotificationOn = "/figmaAssets/notification-on.svg";
const imgProfileAvatar = "/figmaAssets/profile-avatar.png";
const imgArrowRightSmall = "/figmaAssets/arrow-right-small-profile.svg";

/**
 * Profile Header - Global navigation with breadcrumb and profile selector
 * @param {Object} props
 * @param {string[]} props.breadcrumb - Array of breadcrumb items (e.g., ['DEVICES', 'GHOST', 'STICKS'])
 * @param {string} props.activeProfile - Current active profile name
 * @param {boolean} props.isOnboard - Whether current profile is onboard (P1, P2, P3)
 * @param {Function} props.onProfileClick - Handler for profile button click
 */
export default function ProfileHeader({ breadcrumb = ['DEVICES', 'GHOST'], activeProfile = 'Desktop: Default', isOnboard = false, onProfileClick }) {
  return (
    <div className="absolute top-10 left-0 right-0 h-12 bg-black border-b border-[#242424] z-10">
      <div className="h-full w-full flex items-center justify-between px-8">
        {/* Left: Logo + Breadcrumb */}
        <div className="flex gap-4 items-center">
          {/* G Logo */}
          <div className="h-12 w-10 relative flex items-center justify-center">
            <div className="w-8 h-8 flex items-center justify-center p-1 rounded-full">
              <div className="w-6 h-6 relative">
                <img alt="Logitech G" className="w-full h-full" src={imgLogoLogitechG} />
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex gap-2 items-center">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* Breadcrumb item */}
                <div className="flex flex-col items-center pt-3 px-1 rounded h-12">
                  <p className={`font-logitech font-bold text-xs leading-[1.16] text-center tracking-[0.36px] uppercase whitespace-nowrap ${
                    index === breadcrumb.length - 1 ? 'text-primary-default' : 'text-[#a7a7a8]'
                  }`}>
                    {item}
                  </p>
                  {index === breadcrumb.length - 1 && (
                    <div className="bg-primary-default h-px rounded-[1px] w-6 mt-auto" />
                  )}
                </div>

                {/* Chevron separator */}
                {index < breadcrumb.length - 1 && (
                  <div className="flex flex-col items-center h-12 justify-center pb-5 pt-[10px] rounded">
                    <div className="w-6 h-6 relative">
                      <img alt="" className="w-full h-full" src={imgChevronSmallRight} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Profile selector + Notification + Avatar */}
        <div className="flex gap-4 items-center pb-2">
          {/* Profile selector button */}
          <button
            onClick={onProfileClick}
            className="bg-[#1a1a1a] border border-[#242424] rounded-lg px-0 h-10 flex items-center transition-all outline-none hover:bg-[#242424] focus-visible:ring-2 focus-visible:ring-primary-default"
          >
            <div className="flex gap-2 h-full items-center pl-2 pr-0">
              <div className="flex gap-2 h-full items-center py-2">
                {/* G HUB or Onboard icon */}
                <div className="flex gap-1 h-full items-center">
                  <div className="w-6 h-6 relative">
                    <img alt="" className="w-full h-full" src={imgLogoLogitechG} />
                  </div>
                </div>

                {/* Active profile badge */}
                <div className="bg-[rgba(0,184,252,0.14)] flex h-full items-center justify-center px-2 py-0 rounded">
                  <p className="font-logitech font-bold text-sm leading-[1.3] text-primary-default tracking-[-0.42px] whitespace-nowrap overflow-hidden text-ellipsis">
                    {activeProfile}
                  </p>
                </div>
              </div>

              {/* Arrow button */}
              <div className="border-l border-[#242424] h-full flex gap-2 items-center px-2 rounded-br-lg rounded-tr-lg">
                <div className="w-6 h-6 relative">
                  <img alt="" className="w-full h-full" src={imgArrowRightSmall} />
                </div>
              </div>
            </div>
          </button>

          {/* Notification icon */}
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="flex flex-1 flex-row items-center self-stretch">
              <div className="flex flex-1 gap-0 h-full items-center justify-center min-w-0 overflow-clip p-0 rounded-full">
                <div className="flex flex-1 gap-2 h-full items-center justify-center min-w-0 p-0">
                  <div className="w-6 h-6 shrink-0 relative">
                    <img alt="Notifications" className="w-full h-full" src={imgNotificationOn} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile picture */}
          <div className="w-10 h-10 flex items-center justify-center p-1">
            <div className="flex flex-1 h-full items-center justify-center min-w-0 rounded-full">
              <div className="flex-1 h-full min-w-0 relative">
                <img alt="Profile" className="absolute block inset-0 max-w-none w-full h-full rounded-full" src={imgProfileAvatar} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
