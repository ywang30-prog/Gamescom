import { useState } from 'react';

/**
 * ListItem component with Elysium Design System states
 * States: Enabled, Hovered, Pressed, Focused, Disabled
 */
export default function ListItem({
  icon,
  title,
  subtitle,
  iconRotation = 0,
  onClick,
  disabled = false,
  chevron = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const imgVector1 = "/figmaAssets/chevron-icon.svg";

  return (
    <button
      className={`
        w-full bg-surface-neutral-default flex items-center justify-between p-08 rounded-08
        transition-all duration-200 ease-in outline-none
        hover:bg-[#2d2d2d]
        active:bg-[#383838] active:scale-[0.99]
        focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
        disabled:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-12 items-center relative shrink-0">
        <div className="bg-background-950 relative rounded-40 shrink-0 w-10 h-10 flex items-center justify-center">
          <div
            className="overflow-hidden w-6 h-6 transition-transform duration-200 ease-in"
            style={{ transform: `rotate(${iconRotation}deg) scale(${isHovered ? '1.15' : '1'})` }}
          >
            <div className="absolute inset-[8.33%_12.5%]">
              <img alt={title} className="absolute block max-w-none w-full h-full" src={icon} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[6px] items-start relative shrink-0">
          <p className="font-logitech font-bold leading-[1.3] text-text-neutral-default text-sm tracking-[-0.42px] whitespace-nowrap">
            {title}
          </p>
          <p className="font-logitech font-normal leading-[1.3] text-text-neutral-muted text-xs whitespace-nowrap">
            {subtitle}
          </p>
        </div>
      </div>
      {chevron && (
        <div className="h-14 relative shrink-0 w-6">
          <div className="absolute left-0 overflow-hidden w-6 h-6 top-16">
            <div className="absolute inset-[29.17%_37.5%]">
              <img
                alt="Chevron right"
                className="absolute block max-w-none w-full h-full transition-transform duration-200 ease-in group-hover:translate-x-0.5"
                src={imgVector1}
              />
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
