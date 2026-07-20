const imgActions = "/figmaAssets/actions-icon.svg";

export default function SystemNavigation({ className }) {
  return (
    <div className={className || ""} data-name="System navigation" data-node-id="1:211">
      <div className="h-8 relative w-[800px]" data-name="System=Windows" data-node-id="1:217">
        <div className="absolute flex h-2.5 items-center justify-center right-[11px] top-[11px] w-[50px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <div className="h-2.5 relative w-[50px]" data-name="Actions" data-node-id="1:218">
              <img alt="Window actions" className="absolute block max-w-none w-full h-full" src={imgActions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
