export default function Hotspot({ className, state = "Default" }) {
  return (
    <div
      className={className || "aspect-square backdrop-blur-[4px] bg-[rgba(43,48,59,0.2)] border border-stroke-neutral-default overflow-hidden relative rounded-40"}
      data-node-id="136:2215"
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute bg-surface-neutral-black left-1/2 rounded-40 w-2 h-2 top-1/2"
        data-name="Dot"
        data-node-id="136:2216"
      />
    </div>
  );
}
