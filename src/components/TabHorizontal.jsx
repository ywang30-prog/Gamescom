export default function TabHorizontal({
  className,
  active = true,
  insertLabel = "Placeholder",
  state = "Resting"
}) {
  const isActiveAndResting = active && state === "Resting";
  const isNotActiveAndResting = !active && state === "Resting";

  return (
    <div
      className={className || "flex flex-col gap-[19px] items-center justify-center pt-2.5 px-16 relative rounded-08"}
      id={isNotActiveAndResting ? "node-9_390" : "node-9_375"}
    >
      {isActiveAndResting && (
        <>
          <p className="font-logitech font-bold leading-[1.3] text-primary-default text-sm text-center tracking-[-0.42px] whitespace-nowrap">
            {insertLabel}
          </p>
          <div className="bg-stroke-primary-default h-px rounded-[1px] shrink-0 w-6" />
        </>
      )}
      {isNotActiveAndResting && (
        <>
          <p className="font-logitech font-normal leading-[1.3] text-text-neutral-muted text-sm text-center tracking-[-0.42px] whitespace-nowrap">
            {insertLabel}
          </p>
          <div className="h-px rounded-[1px] shrink-0 w-10" />
        </>
      )}
    </div>
  );
}
