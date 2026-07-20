import { useState } from 'react';

/**
 * Button component with Elysium Design System states
 * States: Enabled, Hovered, Pressed, Focused, Disabled
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'solid', // 'solid', 'ghost', 'outline'
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = "relative transition-all duration-150 ease-in-out outline-none";

  const variantStyles = {
    solid: `
      bg-surface-neutral-default
      hover:bg-[#2d2d2d]
      active:bg-[#383838]
      focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50
    `,
    ghost: `
      bg-transparent
      hover:bg-[#1f1f1f]
      active:bg-[#2d2d2d]
      focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:cursor-not-allowed disabled:opacity-50
    `,
    outline: `
      bg-transparent border border-stroke-neutral-default
      hover:bg-[#1f1f1f] hover:border-[#888]
      active:bg-[#2d2d2d] active:border-[#999]
      focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:border-stroke-neutral-disabled disabled:cursor-not-allowed disabled:opacity-50
    `,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
    </button>
  );
}
