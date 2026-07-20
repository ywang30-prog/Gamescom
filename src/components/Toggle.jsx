import { useState, useEffect } from 'react';

export default function Toggle({ enabled = false, onChange, className = '' }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-[48px] h-[24px] rounded-[29px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-default focus-visible:ring-offset-2 focus-visible:ring-offset-background-950 ${
        isEnabled
          ? 'bg-primary-default border-0'
          : 'bg-[#1a1a1a] border border-stroke-neutral-default'
      } ${className}`}
      role="switch"
      aria-checked={isEnabled}
    >
      <div
        className={`absolute w-[20px] h-[20px] bg-white rounded-full transition-all duration-200 ${
          isEnabled ? 'top-[2px] left-[26px]' : 'top-[1px] left-[1px]'
        }`}
      />
    </button>
  );
}
