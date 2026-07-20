import { useState, useEffect, useRef } from 'react';

// Image assets
const imgArrowLeft = "/figmaAssets/arrow-left-icon.svg";
const imgArrowRight = "/figmaAssets/arrow-right-icon.svg";

const hotspotData = {
  'Left Shoulder': {
    title: 'Left Shoulder Button',
    description: 'The left shoulder button (L1) provides quick access to secondary actions. Perfect for aiming, blocking, or any frequently used game mechanic.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 3,
  },
  'Right Shoulder': {
    title: 'Right Shoulder Button',
    description: 'The right shoulder button (R1) mirrors the left shoulder functionality, giving you symmetrical control for balanced gameplay.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 3,
  },
  'Right Trigger': {
    title: 'Right Trigger',
    description: "The Ghost Pro controller's trigger settings allow for customizable gaming experience. Adjust the trigger sensitivity and deadzone to suit your playstyle.",
    image: '/figmaAssets/hotspot-image.png',
    tips: 5,
  },
  'Left Bumper': {
    title: 'Left Bumper',
    description: 'Quick access button for tactical actions. Map your most-used commands here for instant response times.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 2,
  },
  'Right Bumper': {
    title: 'Right Bumper',
    description: 'Essential for competitive gaming. Use for weapon switching, abilities, or other critical in-game functions.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 2,
  },
  'D-Pad': {
    title: 'D-Pad',
    description: 'Precision directional control for menu navigation and quick item selection. Each direction can be mapped independently.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Face Buttons': {
    title: 'Face Buttons',
    description: 'The primary action buttons (A, B, X, Y) are your main interaction points. Customize button assignments to match your gaming style.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Menu': {
    title: 'Menu Button',
    description: 'Access in-game menus and pause functionality. Essential for managing settings during gameplay.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 2,
  },
  'Left Stick': {
    title: 'Left Analog Stick',
    description: 'Primary movement control with adjustable sensitivity and deadzone settings. Fine-tune for precise character control.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 5,
  },
  'Right Stick': {
    title: 'Right Analog Stick',
    description: 'Camera and aim control with customizable acceleration curves. Optimize for your preferred aiming style.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 5,
  },
  'View': {
    title: 'View Button',
    description: 'Quick access to scoreboard, map, or other game information displays.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 2,
  },
  'Left Grip': {
    title: 'Left Grip Button',
    description: 'Additional programmable button for advanced control schemes. Perfect for crouching, jumping, or special abilities.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 3,
  },
  'Right Grip': {
    title: 'Right Grip Button',
    description: 'Mirror your left grip functionality or assign unique actions for maximum control versatility.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 3,
  },
  'D Pad Up': {
    title: 'D-Pad Up',
    description: 'Precision directional control for menu navigation and quick item selection. Map to weapons, abilities, or communication commands.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'D Pad Left': {
    title: 'D-Pad Left',
    description: 'Precision directional control for menu navigation and quick item selection. Map to weapons, abilities, or communication commands.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'D Pad Down': {
    title: 'D-Pad Down',
    description: 'Precision directional control for menu navigation and quick item selection. Map to weapons, abilities, or communication commands.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'D Pad Right': {
    title: 'D-Pad Right',
    description: 'Precision directional control for menu navigation and quick item selection. Map to weapons, abilities, or communication commands.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Button Y': {
    title: 'Y Button',
    description: 'Primary action button. Customize button assignments to match your gaming style. Perfect for weapon switching or special abilities.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Button B': {
    title: 'B Button',
    description: 'Primary action button. Customize button assignments to match your gaming style. Perfect for crouching, dodging, or secondary actions.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Button X': {
    title: 'X Button',
    description: 'Primary action button. Customize button assignments to match your gaming style. Perfect for reloading, interacting, or context actions.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
  'Button A': {
    title: 'A Button',
    description: 'Primary action button. Customize button assignments to match your gaming style. Perfect for jumping, confirming selections, or primary interactions.',
    image: '/figmaAssets/hotspot-image.png',
    tips: 4,
  },
};

export default function HotspotDetailCard({ hotspotName, position, onClose }) {
  const [currentTip, setCurrentTip] = useState(1);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!hotspotName || !hotspotData[hotspotName]) return null;

  const data = hotspotData[hotspotName];

  const handlePrevious = () => {
    setCurrentTip(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentTip(prev => Math.min(data.tips, prev + 1));
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div
      ref={cardRef}
      className="col-1 row-1 absolute bg-surface-neutral-default rounded-08 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.4)] p-4 flex flex-col gap-3 w-[340px] z-[100] pointer-events-auto"
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}
    >
      {/* Image */}
      <div className="bg-[#141414] h-[180px] overflow-hidden relative rounded-04">
        <img
          alt={data.title}
          className="absolute inset-0 w-full h-full object-contain"
          src={data.image}
        />
      </div>

      {/* Title */}
      <p className="font-logitech font-bold text-text-neutral-default text-sm tracking-[-0.42px] leading-[1.3]">
        {data.title}
      </p>

      {/* Description */}
      <p className="font-logitech text-text-neutral-muted text-sm tracking-[-0.42px] leading-[1.3]">
        {data.description}
      </p>

      {/* Spacer */}
      <div className="h-1" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Pagination */}
        <div className="flex items-center px-1">
          <p className="font-logitech font-bold text-text-neutral-muted text-xs leading-[1.3]">
            Tip {currentTip} of {data.tips}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="h-6 px-2 rounded-40 hover:bg-surface-neutral-default/30 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default"
          >
            <p className="font-logitech font-bold text-text-neutral-muted text-xs leading-[1.3]">
              Skip
            </p>
          </button>

          {/* Previous button */}
          <button
            onClick={handlePrevious}
            disabled={currentTip === 1}
            className="border-2 border-stroke-neutral-default w-10 h-10 rounded-40 flex items-center justify-center hover:bg-surface-neutral-default/30 active:bg-surface-neutral-default/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="rotate-90 w-[14px] h-4">
                <img alt="Previous" className="w-full h-full" src={imgArrowLeft} />
              </div>
            </div>
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={currentTip === data.tips}
            className="bg-primary-default w-10 h-10 rounded-40 flex items-center justify-center hover:bg-[#00a0e0] active:bg-[#0090d0] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-default disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="-rotate-90 w-[14px] h-4">
                <img alt="Next" className="w-full h-full" src={imgArrowRight} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
