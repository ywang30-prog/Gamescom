import { useState, useEffect } from 'react';

export default function BinaryToggle({
  leftLabel = 'Front',
  rightLabel = 'Back',
  value = 'left',
  onChange,
  className = ''
}) {
  const [activeValue, setActiveValue] = useState(value);

  useEffect(() => {
    setActiveValue(value);
  }, [value]);

  const handleToggle = (newValue) => {
    setActiveValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={`border border-[#2e2e2e] flex gap-1 items-center p-1 rounded-[40px] ${className}`}
      role="group"
    >
      {/* Left Button */}
      <button
        onClick={() => handleToggle('left')}
        className={`flex items-center justify-center h-8 px-4 rounded-[40px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-default ${
          activeValue === 'left'
            ? 'bg-[#042f44] text-primary-default'
            : 'bg-transparent text-[#a7a7a8] hover:text-[#e6e6e6]'
        }`}
      >
        <span className="font-logitech font-bold text-xs tracking-[0.36px] uppercase whitespace-nowrap">
          {leftLabel}
        </span>
      </button>

      {/* Right Button */}
      <button
        onClick={() => handleToggle('right')}
        className={`flex items-center justify-center h-8 px-4 rounded-[40px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary-default ${
          activeValue === 'right'
            ? 'bg-[#042f44] text-primary-default'
            : 'bg-transparent text-[#a7a7a8] hover:text-[#e6e6e6]'
        }`}
      >
        <span className="font-logitech font-bold text-xs tracking-[0.36px] uppercase whitespace-nowrap">
          {rightLabel}
        </span>
      </button>
    </div>
  );
}
