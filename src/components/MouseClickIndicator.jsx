export default function MouseClickIndicator({ isActive = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 h-[200px] w-5 items-center relative ${className}`}>
      {/* OFF label at top */}
      <div className={`font-logitech text-xs leading-[1.3] ${
        !isActive ? 'font-bold text-[#e6e6e6]' : 'text-[#a7a7a8]'
      }`}>
        Off
      </div>

      {/* Vertical bar container */}
      <div className="flex-1 flex items-center min-h-px overflow-clip relative w-5">
        {/* Background rail - full height gray bar */}
        <div className="bg-[#2e2e2e] h-full w-5 rounded-[99px]" />

        {/* The single bar that changes color and size - no rotation */}
        <div
          className={`absolute top-0 left-0 w-5 rounded-[99px] transition-all duration-200 ${
            isActive ? 'bg-[#00b8fc]' : ''
          }`}
          style={{
            height: isActive ? '136px' : '20px'
          }}
        >
          {/* White thumb positioned at the bottom of this bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white shadow-[1px_1px_10px_rgba(0,0,0,0.4)]" />
          </div>
        </div>
      </div>

      {/* ON label at bottom */}
      <div className={`font-logitech text-xs leading-[1.3] ${
        isActive ? 'font-bold text-[#e6e6e6]' : 'text-[#a7a7a8]'
      }`}>
        On
      </div>
    </div>
  );
}
