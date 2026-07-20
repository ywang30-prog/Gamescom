import { useEffect, useRef } from 'react';

export default function OverflowMenu({ isOpen, onClose, position, onItemClick }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    'Profile Details',
    'Import G HUB Profile',
    'Save as G HUB Profile',
    'Share',
    'Rename',
    'Reset',
  ];

  return (
    <div
      ref={menuRef}
      className="fixed bg-surface-neutral-default rounded-04 shadow-[10px_10px_20px_0px_rgba(0,0,0,0.4)] p-04 flex flex-col gap-04 z-[60] min-w-[160px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            onItemClick(item);
            onClose();
          }}
          className="flex items-center px-2 py-2 rounded-04 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default text-left"
        >
          <p className="font-logitech text-text-neutral-muted text-xs leading-[1.3] whitespace-nowrap">
            {item}
          </p>
        </button>
      ))}
    </div>
  );
}
