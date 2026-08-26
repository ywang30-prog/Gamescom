const imgWindowControls = "/figmaAssets/window-controls.svg";

/**
 * System Header - Window controls (non-functional)
 * Fixed at the top of the application
 */
export default function SystemHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-black border-b border-[#242424] z-10">
      <div className="h-full w-full relative">
        <div className="absolute right-[11px] top-[11px] flex items-center justify-center h-[10px] w-[50px]">
          <div className="flex-none -scale-y-100 rotate-180">
            <div className="h-[10px] w-[50px] relative">
              <img alt="Window controls" className="absolute block max-w-none w-full h-full" src={imgWindowControls} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
