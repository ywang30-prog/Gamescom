import { useState, useEffect, useRef } from 'react';

export default function StickCalibrationModal({ isOpen, onClose }) {
  const [progress, setProgress] = useState(0);
  const [angle, setAngle] = useState(0);
  const [stickMagnitude, setStickMagnitude] = useState(0);
  const [isMovingWrongWay, setIsMovingWrongWay] = useState(false);

  const rotationsRef = useRef(0);
  const lastAngleRef = useRef(0);
  const gamepadRafRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (gamepad) {
        const x = gamepad.axes[0];
        const y = gamepad.axes[1];

        const magnitude = Math.sqrt(x * x + y * y);
        setStickMagnitude(magnitude);

        if (magnitude > 0.3) {
          let currentAngle = Math.atan2(y, x);

          // Only track clockwise progress when moving
          let lastAngle = lastAngleRef.current;
          let angleDiff = currentAngle - lastAngle;

          if (angleDiff > Math.PI) {
            angleDiff -= 2 * Math.PI;
          } else if (angleDiff < -Math.PI) {
            angleDiff += 2 * Math.PI;
          }

          // Check direction - clockwise (positive) or counter-clockwise (negative)
          if (angleDiff > 0 && angleDiff < 0.5) {
            // Clockwise motion - increase progress
            rotationsRef.current += angleDiff / (2 * Math.PI);
            const newProgress = Math.min(100, (rotationsRef.current / 4) * 100);
            setProgress(newProgress);
            setIsMovingWrongWay(false);
          } else if (angleDiff < 0 && angleDiff > -0.5) {
            // Counter-clockwise motion - show warning
            setIsMovingWrongWay(true);
          }

          lastAngleRef.current = currentAngle;
          setAngle(currentAngle);
        }
      }

      gamepadRafRef.current = requestAnimationFrame(pollGamepad);
    };

    gamepadRafRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      if (gamepadRafRef.current) {
        cancelAnimationFrame(gamepadRafRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setAngle(0);
      setStickMagnitude(0);
      setIsMovingWrongWay(false);
      rotationsRef.current = 0;
      lastAngleRef.current = 0;
    }
  }, [isOpen]);

  // Get description text based on state
  const getDescriptionText = () => {
    if (isComplete) {
      return 'Calibration completed!';
    }
    if (isMovingWrongWay && stickMagnitude > 0.3) {
      return 'Follow the direction of the animated circle';
    }
    if (progress >= 70) {
      return 'Keep going, we are almost there!';
    }
    return 'Move the left stick slowly to follow the animated circle.';
  };

  const handleFinish = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const isComplete = progress >= 100;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0, 0, 0, 0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div className="bg-[#1a1a1a] rounded-2xl p-8 w-[456px]" style={{ boxShadow: '20px 20px 40px 0px rgba(0,0,0,0.4)' }}>
        {/* Title */}
        <h2 className="font-logitech font-bold text-[#e6e6e6] text-2xl tracking-[-0.96px] leading-[28px] mb-8">
          Left Stick Calibration
        </h2>

        {/* Description */}
        <p className="font-logitech text-[#a7a7a8] text-base tracking-[-0.48px] leading-[1.28] mb-8">
          {getDescriptionText()}
        </p>

        {/* Visualization Container */}
        <div className="flex flex-col items-center justify-center py-4 mb-8">
          <div className="flex flex-col gap-8 items-center w-[260px]">
            {/* Circular Visualization - 138x138 */}
            <div className="relative" style={{ width: '138px', height: '138px' }}>
              <svg width="138" height="138" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                <defs>
                  <filter id="filter0_di" x="0" y="0" width="137.977" height="137.977" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="59.0862"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0666667 0 0 0 0 0.588235 0 0 0 0 1 0 0 0 0.6 0"/>
                    <feBlend mode="normal" in2="shape" result="effect2_innerShadow"/>
                  </filter>
                  <filter id="filter1_i" x="57.85" y="53.8501" width="22.3" height="22.2998" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset/>
                    <feGaussianBlur stdDeviation="3.30883"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.0666667 0 0 0 0 0.588235 0 0 0 0 1 0 0 0 0.6 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
                  </filter>
                  <linearGradient id="paint0_linear" x1="113.5" y1="29.5" x2="113.5" y2="108.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00B6FA" stopOpacity="0"/>
                    <stop offset="1" stopColor="#00B8FC"/>
                  </linearGradient>
                </defs>

                {/* Outer circle with glow */}
                <g filter="url(#filter0_di)">
                  <circle cx="68.9883" cy="64.9883" r="64.9883" fill="#101113" fillOpacity="0.01" shapeRendering="crispEdges"/>
                  <circle cx="68.9883" cy="64.9883" r="63.9883" stroke="#00B6FA" strokeWidth="2" shapeRendering="crispEdges"/>
                </g>

                {/* Center circle with inner glow */}
                <g filter="url(#filter1_i)">
                  <circle cx="69" cy="65" r="11" fill="#101113" fillOpacity="0.9"/>
                </g>
                <circle cx="69" cy="65" r="11" stroke="#00B8FC" strokeWidth="0.3"/>

                {/* Animated gradient arc - hide when complete */}
                {!isComplete && (
                  <g className="arc-animation">
                    <path
                      d="M118.036 107.625C125.353 99.2065 130.381 89.0466 132.636 78.1227C134.89 67.1988 134.295 55.8786 130.907 45.2514C127.52 34.6241 121.454 25.0476 113.294 17.4434C105.133 9.8392 95.1534 4.46325 84.3139 1.83289L83.0879 6.88533C93.0602 9.30526 102.242 14.2511 109.749 21.247C117.257 28.2429 122.837 37.0533 125.954 46.8303C129.07 56.6074 129.618 67.022 127.544 77.072C125.47 87.122 120.844 96.469 114.112 104.214L118.036 107.625Z"
                      fill="url(#paint0_linear)"
                    >
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 69 65"
                        to="360 69 65"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Blue dot leader with faint glow */}
                    <g>
                      <circle cx="115" cy="107" r="6" fill="#00B8FC" opacity="0.3">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 69 65"
                          to="360 69 65"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle cx="115" cy="107" r="3" fill="#00B8FC">
                        <animateTransform
                          attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 69 65"
                          to="360 69 65"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  </g>
                )}

                {/* Crosshair lines - thin */}
                <path d="M69 2L69.0002 54" stroke="#00B8FC" strokeWidth="0.3" strokeLinecap="round"/>
                <path d="M69.0001 76L69.0002 128.5" stroke="#00B8FC" strokeWidth="0.3" strokeLinecap="round"/>
                <path d="M58 65L5 65" stroke="#00B8FC" strokeWidth="0.3" strokeLinecap="round"/>
                <path d="M133 65L80 65" stroke="#00B8FC" strokeWidth="0.3" strokeLinecap="round"/>

                {/* Completion ripple effect - show when complete */}
                {isComplete && (
                  <g>
                    {/* White center dot */}
                    <circle cx="69" cy="65" r="4" fill="#FBFBFB" />

                    {/* Blue ripple circles - continuously animated outward at half speed */}
                    <circle cx="69" cy="65" r="11" fill="none" stroke="#00B8FC" strokeWidth="0.3">
                      <animate attributeName="r" from="11" to="30" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="69" cy="65" r="11" fill="none" stroke="#00B8FC" strokeWidth="0.3">
                      <animate attributeName="r" from="11" to="30" dur="4s" begin="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="4s" begin="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* Thick blue line with white dot - show when stick is pushed and not complete */}
                {!isComplete && stickMagnitude > 0.3 && (() => {
                  // Calculate endpoint - extend to inner edge of circle (radius ~53-54px to touch the stroke)
                  const centerX = 69;
                  const centerY = 65;
                  const maxRadius = 54;
                  const radius = Math.min(stickMagnitude, 1) * maxRadius;
                  const endX = centerX + radius * Math.cos(angle);
                  const endY = centerY + radius * Math.sin(angle);

                  return (
                    <g style={{ transition: 'opacity 0.2s ease-out' }}>
                      <line x1={centerX} y1={centerY} x2={endX} y2={endY} stroke="#2CCBFF" strokeWidth="4" strokeLinecap="round"/>
                      <circle cx={endX} cy={endY} r="4" fill="#FBFBFB"/>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Progress indicator */}
            <div className="flex flex-col gap-2 w-full">
              <div className="font-logitech font-bold text-[#e6e6e6] text-sm tracking-[-0.42px] leading-[1.3] text-center">
                Calibrating
              </div>

              {/* Progress bar */}
              <div className="flex gap-1 items-center w-full">
                <div className="flex-1 py-1.5">
                  <div className="h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-[#00b6fa] rounded-full"
                      style={{
                        width: `${Math.min(Math.max(progress, 0), 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="h-4 flex items-center justify-center pl-1 min-w-[48px]">
                  <span className="font-logitech font-bold text-[#a7a7a8] text-xs leading-[1.3]">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#2e2e2e] rounded-2xl mb-8" />

        {/* Action buttons */}
        <div className="flex gap-6 justify-end">
          <button
            onClick={handleCancel}
            disabled={isComplete}
            className={`h-8 px-4 rounded-full border-2 font-logitech font-bold text-xs tracking-[0.275px] uppercase leading-[1.16] transition-colors ${
              isComplete
                ? 'border-[#2e2e2e] text-[#4d4d4d] cursor-not-allowed'
                : 'border-[#4d4d4d] text-[#e6e6e6] hover:border-[#666]'
            }`}
          >
            CANCEL
          </button>
          <button
            onClick={handleFinish}
            disabled={!isComplete}
            className={`h-8 px-4 rounded-full font-logitech font-bold text-xs tracking-[0.275px] uppercase leading-[1.16] transition-colors ${
              isComplete
                ? 'bg-[#00b6fa] text-[#1a1a1a] hover:bg-[#00a0e0]'
                : 'bg-[#242424] text-[#666] cursor-not-allowed'
            }`}
          >
            FINISH
          </button>
        </div>
      </div>

    </div>
  );
}
