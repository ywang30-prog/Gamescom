import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

export default function ActionsModal({ isOpen, onClose, tooltipLabel, currentValue, onSelect, availableActions, onResetCurrent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const gamepadRafRef = useRef(null);
  const lastPressedButtons = useRef(new Set());

  // Gamepad button index to action ID mapping
  const gamepadButtonMap = {
    0: 'buttonA',      // Button A (bottom)
    1: 'buttonB',      // Button B (right)
    2: 'buttonX',      // Button X (left)
    3: 'buttonY',      // Button Y (top)
    4: 'leftBumper',   // Left Bumper
    5: 'rightBumper',  // Right Bumper
    10: 'leftStick',   // Left Stick (press)
    11: 'rightStick',  // Right Stick (press)
    12: 'dPadUp',      // D-Pad Up
    13: 'dPadDown',    // D-Pad Down
    14: 'dPadLeft',    // D-Pad Left
    15: 'dPadRight',   // D-Pad Right
  };

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      lastPressedButtons.current.clear();
    }
  }, [isOpen]);

  // Gamepad polling when modal is open
  useEffect(() => {
    if (!isOpen) {
      if (gamepadRafRef.current) {
        cancelAnimationFrame(gamepadRafRef.current);
        gamepadRafRef.current = null;
      }
      return;
    }

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0]; // Use first connected gamepad

      if (gamepad) {
        gamepad.buttons.forEach((button, index) => {
          const buttonKey = `${index}`;

          // Detect button press (not just held)
          if (button.pressed && !lastPressedButtons.current.has(buttonKey)) {
            lastPressedButtons.current.add(buttonKey);

            // Check if this button maps to an action
            const actionId = gamepadButtonMap[index];
            if (actionId) {
              // Find the action in availableActions
              const action = availableActions.find(a => a.id === actionId);
              if (action) {
                // Apply the remap
                onSelect(action.label);
                onClose();
                return;
              }
            }
          } else if (!button.pressed && lastPressedButtons.current.has(buttonKey)) {
            lastPressedButtons.current.delete(buttonKey);
          }
        });
      }

      gamepadRafRef.current = requestAnimationFrame(pollGamepad);
    };

    gamepadRafRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      if (gamepadRafRef.current) {
        cancelAnimationFrame(gamepadRafRef.current);
        gamepadRafRef.current = null;
      }
    };
  }, [isOpen, availableActions, onSelect, onClose]);

  if (!isOpen) return null;

  // Categorize and filter actions
  const categorizeActions = (actions) => {
    const categories = {
      'STICKS': [],
      'BUMPERS': [],
      'D PADS': [],
      'BUTTONS': []
    };

    actions.forEach(action => {
      if (action.id.includes('Stick')) {
        categories['STICKS'].push(action);
      } else if (action.id.includes('Bumper')) {
        categories['BUMPERS'].push(action);
      } else if (action.id.includes('dPad')) {
        categories['D PADS'].push(action);
      } else if (action.id.includes('button')) {
        categories['BUTTONS'].push(action);
      }
    });

    return categories;
  };

  const filteredActions = availableActions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizedActions = categorizeActions(filteredActions);

  const handleActionClick = (action) => {
    onSelect(action.label);
    onClose();
  };

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #242424;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333333;
        }
      `}</style>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden bg-[#1a1a1a]"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 100px 100px -60px rgba(0, 182, 250, 0.06), inset 0 0 0 1px rgba(0, 0, 0, 0.8), inset 0 0 30px 8px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="font-logitech font-bold text-white text-sm uppercase tracking-[0.36px] leading-[1.16]">
              ACTIONS
            </h2>
            <p className="font-logitech text-[13px] text-[#8e8e8f] mt-2 leading-[1.3]">
              Select an action or press a button on your gamepad
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8e8f] hover:text-white transition-colors p-1 -mr-1 -mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="pl-6 pr-9 pb-4">
          <div className="bg-[#2e2e2e] hover:bg-[#353535] rounded-lg flex items-center px-3 h-10 border border-transparent focus-within:border-[#00b6fa] transition-all">
            <svg className="w-5 h-5 text-[#8e8e8f] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[#8e8e8f] outline-none ml-2 font-logitech tracking-[-0.42px]"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="pl-6 pr-9 pb-1 flex justify-end">
          <button
            onClick={() => {
              onResetCurrent && onResetCurrent();
              onClose();
            }}
            className="text-[#e6e6e6] text-xs font-logitech font-bold tracking-[0.42px] uppercase hover:text-[#00b6fa] transition-colors"
          >
            Reset to default
          </button>
        </div>

        {/* Actions List */}
        <div className="relative h-[396px] overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'transparent transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.scrollbarColor = '#242424 transparent';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.scrollbarColor = 'transparent transparent';
          }}
        >
          {filteredActions.length > 0 ? (
            <div className="space-y-6 w-full px-6 pb-6">
              {Object.entries(categorizedActions).map(([category, actions]) => {
                if (actions.length === 0) return null;
                return (
                  <div key={category} className="w-full">
                    <div className="flex items-center gap-3 mb-[15px] w-full">
                      <h3 className="font-logitech text-xs text-[#666] uppercase tracking-[0.36px] whitespace-nowrap">
                        {category}
                      </h3>
                      <div className="flex-1 h-px bg-[#333]"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {actions.map((action) => {
                        const isSelected = action.label === currentValue;
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            className={`
                              relative min-h-[56px] rounded-lg flex items-center justify-center px-4 py-3
                              font-logitech text-sm tracking-[-0.42px] leading-[1.3]
                              transition-all duration-150
                              ${isSelected
                                ? 'bg-[#042f44] border border-[#00b6fa] text-[#00b6fa]'
                                : 'bg-[#242424] border border-transparent text-[#ccc] hover:bg-[#333] hover:text-white'
                              }
                            `}
                            style={isSelected ? {
                              boxShadow: '0 0 12px rgba(0, 182, 250, 0.25), inset 0 0 16px rgba(0, 182, 250, 0.08)'
                            } : undefined}
                          >
                            <span className={`${isSelected ? 'mr-6' : ''} text-center`}>{action.label}</span>
                            {isSelected && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Check className="w-5 h-5 text-[#00b6fa]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[#8e8e8f] font-logitech text-sm">
              No actions found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
