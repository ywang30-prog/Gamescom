const imgArrowRightSmall = "/figmaAssets/arrow-right-small.svg";

/**
 * ListItem component matching Figma Side Panel design
 * Two-line list item with icon, title, subtitle, and arrow button
 */
export default function ListItem({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
}) {
  return (
    <button
      className="bg-[#242424] w-full h-[56px] flex items-center justify-center p-0 rounded-lg transition-all duration-200 ease-in outline-none hover:bg-[#2d2d2d] active:bg-[#333] focus-visible:ring-2 focus-visible:ring-primary-default disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex flex-1 gap-4 h-full items-center min-w-0 px-2">
        <div className="flex flex-1 gap-3 items-center min-w-0">
          {/* Icon container - 36px circle */}
          <div className="relative rounded-full shrink-0 w-9 h-9 flex items-center justify-center">
            <div className="w-6 h-6">
              <img alt={title} className="w-full h-full" src={icon} />
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-[2px] items-start flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-start w-full">
              <p className="font-logitech font-bold text-sm leading-[1.3] text-[#e6e6e6] tracking-[-0.42px] whitespace-nowrap overflow-hidden text-ellipsis">
                {title}
              </p>
            </div>
            {/* Subtitle */}
            <div className="flex items-start w-full">
              <p className="font-logitech font-normal text-xs leading-[1.3] text-[#a7a7a8] whitespace-nowrap overflow-hidden text-ellipsis">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Arrow icon button - 32px circle with border */}
        <div className="flex items-center justify-center w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] shrink-0">
          <div className="border-2 border-[#2e2e2e] border-solid flex gap-0 items-center justify-center overflow-clip p-0 rounded-full w-8 h-8">
            <div className="flex flex-1 gap-2 h-full items-center justify-center min-w-0 p-0">
              <div className="w-6 h-6 shrink-0">
                <img alt="" className="w-full h-full" src={imgArrowRightSmall} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
