const imgColor = "/figmaAssets/device-chip-icon.svg";

export default function DeviceCardChipWide({ className }) {
  return (
    <div className={className || ""} data-name="_Device card - chip wide" data-node-id="1:2074">
      <div
        className="bg-status-success-highlight flex gap-04 h-8 items-center overflow-hidden px-04 py-1.5 rounded-04"
        data-name="Status=Medium Battery"
        data-node-id="1:2083"
      >
        <div className="relative shrink-0 w-6 h-6" data-name="BatteryHalf" data-node-id="1:2084">
          <div className="absolute inset-[12.5%_31.25%]" data-name="↳Color" data-node-id="I1:2084;1950:11271">
            <img alt="Battery" className="absolute block max-w-none w-full h-full" src={imgColor} />
          </div>
        </div>
        <div className="flex h-6 items-center relative shrink-0" data-name="Label" data-node-id="1:2085">
          <p className="font-logitech font-bold text-status-success-default text-xs leading-[1.3]">
            50%
          </p>
        </div>
      </div>
    </div>
  );
}
