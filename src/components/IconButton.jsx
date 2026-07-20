import { useState } from 'react';

/**
 * IconButton component with Elysium Design System states
 * States: Enabled, Hovered, Pressed, Focused, Disabled
 */
export default function IconButton({
  icon,
  alt = '',
  onClick,
  disabled = false,
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'solid',
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const baseStyles = `
    relative overflow-hidden rounded-40 shrink-0
    transition-all duration-150 ease-in-out outline-none
    flex items-center justify-center
  `;

  const variantStyles = {
    solid: `
      bg-surface-neutral-default
      hover:bg-[#2d2d2d] hover:scale-105
      active:bg-[#383838] active:scale-95
      focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50
    `,
    ghost: `
      bg-transparent
      hover:bg-[#1f1f1f] hover:scale-105
      active:bg-[#2d2d2d] active:scale-95
      focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-black
      disabled:cursor-not-allowed disabled:opacity-50
    `,
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {typeof icon === 'string' ? (
        <img src={icon} alt={alt} className={`${iconSizes[size]} object-contain`} />
      ) : (
        <div className={iconSizes[size]}>{icon}</div>
      )}
    </button>
  );
}
