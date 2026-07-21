import { useState, useEffect, useRef } from 'react';

// Polling states, highest tier first. `hz` is the nominal rate shown while the
// controller is resting in that tier. Tweak colors / ranges / rates here.
const POLLING_STATES = {
  EXCELLENT: { label: 'Excellent', tier: '~8K', color: '#29CC6A', range: '7000-8000', hz: 7800 },
  STABLE:    { label: 'Stable',    tier: '~5K', color: '#0099FF', range: '4000-6000', hz: 5200 },
  REDUCED:   { label: 'Reduced',   tier: '~3K', color: '#FFD66C', range: '2000-4000', hz: 3000 },
  LIMITED:   { label: 'Limited',   tier: '~1K', color: '#E54438', range: '500-2000',  hz: 1000 },
};

// Order the tiers step down through as the controller goes idle.
const TIERS = [POLLING_STATES.EXCELLENT, POLLING_STATES.STABLE, POLLING_STATES.REDUCED, POLLING_STATES.LIMITED];

// --- Behaviour tuning (stepped decay) ---------------------------------------
// Any input snaps to full rate (Excellent). With no input it holds for HOLD_MS,
// then steps down one tier every STEP_MS: Excellent -> Stable -> Reduced -> Limited.
const DEADZONE = 0.08;    // ignore stick drift / noise below this
const HOLD_MS = 4000;     // stay at full rate this long after the last input
const STEP_MS = 3000;     // then drop one tier every this many ms
const UPDATE_MS = 100;    // how often the tier / dot refresh (keeps them responsive)
const READOUT_MS = 1000;  // how often the CURRENT Hz number resamples (calm, once-a-second)
const JITTER_HZ = 120;    // +/- wobble on the sampled rate
// ---------------------------------------------------------------------------

export default function DeviceStatusWidget() {
  const [isHovered, setIsHovered] = useState(false);
  const [pollingState, setPollingState] = useState(POLLING_STATES.LIMITED);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [simulatedHz, setSimulatedHz] = useState(POLLING_STATES.LIMITED.hz);
  const [dotOpacity, setDotOpacity] = useState(1);

  const rafRef = useRef(null);
  const lastInputRef = useRef(0);      // performance.now() of last real input
  const lastUpdateRef = useRef(0);     // last tier/dot refresh
  const lastReadoutRef = useRef(0);    // last CURRENT-Hz resample
  const tierRef = useRef(null);        // tier at the last resample

  useEffect(() => {
    const poll = () => {
      const now = performance.now();

      // Read the first connected gamepad and reduce it to one activity value (0-1).
      let activity = 0;
      try {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
          const gp = pads[i];
          if (!gp || !gp.connected) continue;

          // Sticks: largest absolute axis deflection past the deadzone.
          let stick = 0;
          for (let a = 0; a < gp.axes.length; a++) {
            const v = Math.abs(gp.axes[a] || 0);
            if (v > DEADZONE) stick = Math.max(stick, v);
          }

          // Buttons + triggers: analog value if present, else pressed = 1.
          let btn = 0;
          for (let b = 0; b < gp.buttons.length; b++) {
            const button = gp.buttons[b];
            const v = typeof button === 'object' ? (button.value || (button.pressed ? 1 : 0)) : button;
            btn = Math.max(btn, v);
          }

          activity = Math.max(activity, stick, btn);
          break;
        }
      } catch (err) {
        console.error('Gamepad error:', err);
      }

      // Any input snaps back to the top tier; otherwise step down over time.
      if (activity > 0.05) lastInputRef.current = now;
      const idle = now - lastInputRef.current;
      const step = idle < HOLD_MS ? 0 : 1 + Math.floor((idle - HOLD_MS) / STEP_MS);
      const tier = TIERS[Math.min(step, TIERS.length - 1)];

      // Tier + dot stay responsive (setState with the same tier object is a no-op).
      if (now - lastUpdateRef.current >= UPDATE_MS) {
        lastUpdateRef.current = now;
        setPollingState(tier);
        setDotOpacity(0.5 + 0.5 * (0.5 + 0.5 * Math.sin(now / 400))); // gentle breathing
      }

      // The CURRENT Hz number resamples calmly (~1s), or immediately on a tier change.
      if (tier !== tierRef.current || now - lastReadoutRef.current >= READOUT_MS) {
        lastReadoutRef.current = now;
        tierRef.current = tier;
        const jitter = (Math.random() - 0.5) * 2 * JITTER_HZ;
        const hz = Math.min(8000, Math.max(500, Math.round(tier.hz + jitter)));
        setSimulatedHz(hz);
        setTimestamp(Date.now());
      }

      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const getTimeSinceUpdate = () => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return 'Just Now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  const percentage = Math.min(100, Math.round((simulatedHz / 8000) * 100));

  return (
    <div className="flex items-start justify-end w-full shrink-0" style={{ height: '48px' }}>
      {/* Hover target area - matches collapsed widget size */}
      <div
        className="relative z-10"
        style={{ width: '219px', height: '48px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Clipping container - animates height */}
        <div
          style={{
            width: '219px',
            height: isHovered ? '237px' : '48px',
            overflow: 'hidden',
            borderRadius: '16px',
            transform: 'translateZ(0)',
            transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* SVG stays full size, container clips it */}
          <svg
            width="219"
            height="237"
            viewBox="0 0 219 237"
            fill="none"
            style={{ display: 'block', cursor: 'default', userSelect: 'none' }}
          >
          {/* Outer container - always full size, clipping handles collapse */}
          <path d="M16 0.5H203C211.56 0.500002 218.5 7.43959 218.5 16V221C218.5 229.56 211.56 236.5 203 236.5H16C7.43959 236.5 0.5 229.56 0.5 221V16C0.5 7.43959 7.43959 0.5 16 0.5Z" fill="#1A1A1A"/>
          <path d="M16 0.5H203C211.56 0.500002 218.5 7.43959 218.5 16V221C218.5 229.56 211.56 236.5 203 236.5H16C7.43959 236.5 0.5 229.56 0.5 221V16C0.5 7.43959 7.43959 0.5 16 0.5Z" stroke="#242424"/>

          <g clipPath="url(#clip0)">
            {/* Left section background */}
            <path d="M8 12C8 9.79086 9.79086 8 12 8H118C120.209 8 122 9.79086 122 12V36C122 38.2091 120.209 40 118 40H12C9.79086 40 8 38.2091 8 36V12Z" fill="#242424"/>

            {/* Pulsing dot */}
            <circle cx="20" cy="24" r="4" fill={pollingState.color} opacity={dotOpacity}/>

            {/* "Excellent ~8K" text - adjusted x position to move away from right edge */}
            <text x="32" y="27" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="12" fontWeight="700">
              {pollingState.label} {pollingState.tier}
            </text>
          </g>

          <g clipPath="url(#clip1)">
            {/* Right section background */}
            <path d="M132 12C132 9.79086 133.791 8 136 8H207C209.209 8 211 9.79086 211 12V36C211 38.2091 209.209 40 207 40H136C133.791 40 132 38.2091 132 36V12Z" fill="#242424"/>

            {/* Battery icon - exact from SVG */}
            <path fillRule="evenodd" clipRule="evenodd" d="M161 22.5L161 25.5C161 26.052 160.552 26.5 160 26.5C159.448 26.5 159 26.052 159 25.5L159 22.5C159 21.948 159.448 21.5 160 21.5C160.552 21.5 161 21.948 161 22.5ZM158 27.214L158 20.786C158 20.076 157.483 19.5 156.846 19.5L144.154 19.5C143.517 19.5 143 20.076 143 20.786L143 27.214C143 27.924 143.517 28.5 144.154 28.5L156.846 28.5C157.483 28.5 158 27.924 158 27.214Z" fill="#30A46C"/>

            {/* "100%" text */}
            <text x="168" y="27" fill="#30A46C" fontFamily="Brown Logitech Pan, sans-serif" fontSize="12" fontWeight="700">
              100%
            </text>
          </g>

          {/* Expanded content - always visible, clipping handles reveal */}
          <g>
              {/* Divider */}
              <path d="M12 50H207" stroke="#242424"/>

              {/* Labels and values */}
              <text x="14" y="74" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="9" letterSpacing="0.05em">RANGE</text>
              <text x="14" y="94" fill="#E6E6E6" fontFamily="Brown Logitech Pan, sans-serif" fontSize="14" fontWeight="700">{pollingState.range} Hz</text>

              <text x="123" y="74" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="9" letterSpacing="0.05em">STATUS</text>
              <text x="123" y="94" fill="#E6E6E6" fontFamily="Brown Logitech Pan, sans-serif" fontSize="14" fontWeight="700">{pollingState.label}</text>


              <text x="14" y="129" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="9" letterSpacing="0.05em">CURRENT</text>
              <text x="14" y="149" fill="#E6E6E6" fontFamily="Brown Logitech Pan, sans-serif" fontSize="14" fontWeight="700">{simulatedHz} Hz</text>

              <text x="123" y="129" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="9" letterSpacing="0.05em">UPDATED</text>
              <text x="123" y="149" fill="#E6E6E6" fontFamily="Brown Logitech Pan, sans-serif" fontSize="14" fontWeight="700">{getTimeSinceUpdate()}</text>

              {/* Divider */}
              <path d="M12 174H207" stroke="#242424"/>

              {/* 8K Achievement */}
              <text x="14" y="194" fill="#A7A7A8" fontFamily="Brown Logitech Pan, sans-serif" fontSize="9" letterSpacing="0.05em">8K ACHIEVEMENT</text>
              <text x="187" y="194" fill="#E6E6E6" fontFamily="Brown Logitech Pan, sans-serif" fontSize="11" textAnchor="end">{percentage}%</text>

              {/* Progress bar */}
              <rect x="12" y="211" width="195" height="4" rx="2" fill="#4D4D4D"/>
              <rect x="12" y="211" width={195 * (percentage / 100)} height="4" rx="2" fill={pollingState.color}/>
          </g>

          <defs>
            <clipPath id="clip0">
              <path d="M8 16C8 11.5817 11.5817 8 16 8H114C118.418 8 122 11.5817 122 16V32C122 36.4183 118.418 40 114 40H16C11.5817 40 8 36.4183 8 32V16Z" fill="white"/>
            </clipPath>
            <clipPath id="clip1">
              <path d="M132 16C132 11.5817 135.582 8 140 8H203C207.418 8 211 11.5817 211 16V32C211 36.4183 207.418 40 203 40H140C135.582 40 132 36.4183 132 32V16Z" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        </div>
      </div>
    </div>
  );
}
