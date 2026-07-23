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
      className={`relative w-[48px] h-[24px] rounded-[29px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#00b8fc] shrink-0 ${
        isEnabled ? 'bg-[#00b8fc]' : 'bg-[#1a1a1a]'
      } ${className}`}
      role="switch"
      aria-checked={isEnabled}
      style={{
        border: isEnabled ? 'none' : '0.5px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Toggle knob - smaller with spacing */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-white rounded-full transition-all duration-200 ${
          isEnabled ? 'left-[32px]' : 'left-[4px]'
        }`}
      />
    </button>
  );
}
