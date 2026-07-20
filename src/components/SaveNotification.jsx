import { useEffect } from 'react';

// Image assets
const imgCheckmark = "/figmaAssets/checkmark-large.svg";
const imgClose = "/figmaAssets/close-small.svg";

export default function SaveNotification({ profileName, targetSlot, onClose }) {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!profileName || !targetSlot) return null;

  const slotNames = {
    p1: 'P1: Desktop: Default',
    p2: 'P2 Ghost',
    p3: 'P3 Ghost',
  };

  const displaySlot = slotNames[targetSlot] || targetSlot;

  // Different message for saving settings vs importing profiles
  const isSaveAction = targetSlot === 'saved';

  return (
    <div className="fixed bottom-8 right-8 z-[200] animate-slide-up">
      <div className="bg-surface-neutral-default border border-[#2e2e2e] rounded-08 shadow-[10px_10px_20px_0px_rgba(0,0,0,0.4)] px-4 py-4 flex gap-8 items-center min-w-[400px]">
        {/* Checkmark Icon */}
        <div className="relative rounded-40 shrink-0 w-12 h-12 flex items-center justify-center">
          <div className="w-6 h-6">
            <div className="absolute inset-[16.67%_12.5%]">
              <img alt="Success" className="absolute block max-w-none w-full h-full" src={imgCheckmark} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex-1 font-logitech text-text-neutral-muted text-sm tracking-[-0.42px] leading-[1.3]">
          {isSaveAction ? (
            <p>
              Your settings have been saved to <span className="font-bold">{profileName}</span>.
            </p>
          ) : (
            <p>
              Your <span className="font-bold">{profileName}</span> profile has been saved to the device{' '}
              <span className="font-bold">{displaySlot}.</span>
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="overflow-hidden relative rounded-40 shrink-0 w-8 h-8 hover:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
        >
          <div className="absolute left-1 w-6 h-6 top-1">
            <div className="absolute inset-[33.33%]">
              <img alt="Close" className="absolute block max-w-none w-full h-full" src={imgClose} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
