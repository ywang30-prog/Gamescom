import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ChevronRight as LucideChevronRight } from 'lucide-react';
import ProfileSelector from './ProfileSelector';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';

// Icon Components
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 10.2929C17.6835 9.90237 18.3165 9.90237 18.707 10.2929C19.0975 10.6834 19.0975 11.3166 18.707 11.7071L13.707 16.7071C13.5194 16.8946 13.2651 17 13 17C12.7349 17 12.4806 16.8946 12.293 16.7071L7.29297 11.7071C6.90244 11.3166 6.90244 10.6834 7.29297 10.2929C7.68349 9.90237 8.3165 9.90237 8.70703 10.2929L13 14.5858L17.293 10.2929Z" fill="#A7A7A8"/>
  </svg>
);

export default function StickCalibration() {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('stick-calibration');
  const [selectedStick, setSelectedStick] = useState('Left');
  const [isStickDropdownOpen, setIsStickDropdownOpen] = useState(false);

  // Profile management
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(() => {
    return localStorage.getItem('currentPreset') || 'desktop';
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTargetProfile, setImportTargetProfile] = useState(null);
  const [onboardProfileMapping, setOnboardProfileMapping] = useState(() => {
    const saved = localStorage.getItem('onboardProfileMapping');
    return saved ? JSON.parse(saved) : {
      p1: 'desktop',
      p2: 'desktop',
      p3: 'desktop'
    };
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  });

  const handlePresetClick = () => {
    setIsPresetModalOpen(true);
  };

  const handleProfileChange = (newPreset) => {
    setCurrentPreset(newPreset);
    localStorage.setItem('currentPreset', newPreset);
  };

  const handleOpenImportModal = (targetProfile) => {
    setImportTargetProfile(targetProfile);
    setIsImportModalOpen(true);
  };

  const handleImportProfile = (sourceProfile, targetProfile) => {
    console.log(`Importing from ${sourceProfile} to ${targetProfile}`);

    if (['p1', 'p2', 'p3'].includes(targetProfile)) {
      const newMapping = { ...onboardProfileMapping, [targetProfile]: sourceProfile };
      setOnboardProfileMapping(newMapping);
      localStorage.setItem('onboardProfileMapping', JSON.stringify(newMapping));
    }

    setIsImportModalOpen(false);
    setImportTargetProfile(null);
  };

  const handleSaveSettings = () => {
    console.log('Saving settings...');
  };

  const handleStartCalibration = () => {
    console.log('Starting calibration for:', selectedStick);
    // TODO: Navigate to actual calibration flow
  };

  return (
    <div className="bg-black w-full min-w-[1440px] h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between gap-4 px-8 py-2 border-b border-solid border-[#333]">
        <div className="inline-flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="rounded-full bg-[#242424] w-10 h-10 flex items-center justify-center hover:bg-[#333] transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#a7a7a8]" />
          </button>

          <div className="flex gap-1 items-center h-10">
            <button
              onClick={() => navigate('/')}
              className="flex flex-col gap-[19px] items-center pt-[18px] px-4 cursor-pointer hover:opacity-80 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-primary-default rounded"
            >
              <span className="font-logitech text-[14px] text-[#a7a7a8] tracking-[-0.42px] leading-[1.3]">
                GHOST
              </span>
              <div className="h-px rounded-[1px] shrink-0 w-10" />
            </button>
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4 w-[5px]">
              <LucideChevronRight className="w-4 h-4 text-[#a7a7a8]" />
              <div className="h-px rounded-[1px] shrink-0 w-10" />
            </div>
            <div className="flex flex-col gap-[19px] items-center pt-[18px] px-4">
              <span className="font-logitech font-bold leading-[1.3] text-[#00b6fa] text-sm text-center tracking-[-0.42px] whitespace-nowrap">
                GENERAL SETTINGS
              </span>
              <div className="bg-[#00b6fa] h-px rounded-[1px] shrink-0 w-6" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex px-8 pb-8 gap-[102px] pt-4" style={{ overflow: 'visible' }}>
        {/* Left Sidebar */}
        <div className="w-[420px] flex flex-col gap-2 shrink-0">
          {/* Preset Selector */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl w-full">
            <ProfileSelector
              currentPreset={currentPreset}
              hasUnsavedChanges={hasUnsavedChanges}
              onPresetClick={handlePresetClick}
              onSaveSettings={handleSaveSettings}
            />
          </div>

          {/* General Settings Navigation Panel */}
          <div className="bg-[#1a1a1a] rounded-2xl flex-1 pt-4 px-4">
            {/* Header with back button */}
            <div className="mb-6 pb-4 border-b border-[#2e2e2e]">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/general-settings')}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#2e2e2e] shrink-0 hover:bg-[#2e2e2e] transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M14 7L9 12L14 17" stroke="#e6e6e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div className="flex flex-col flex-1">
                  <h3 className="text-base font-bold text-[#e6e6e6]">General Settings</h3>
                  <p className="text-xs text-[#a7a7a8] mt-0.5">Access global device settings</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-4">
              {/* General */}
              <button
                onClick={() => navigate('/general-settings')}
                className="h-10 px-2 rounded-lg flex items-center hover:bg-[#242424] transition-colors"
              >
                <span className="text-sm text-[#a7a7a8]">
                  General
                </span>
              </button>

              {/* Stick calibration - Active */}
              <button
                onClick={() => setActiveTab('stick-calibration')}
                className="h-10 px-2 rounded-lg flex items-center bg-[#042f44] transition-colors"
              >
                <span className="text-sm text-[#00b8fc]">
                  Stick calibration
                </span>
              </button>

              {/* Power saving */}
              <button
                onClick={() => setActiveTab('power')}
                className="h-10 px-2 rounded-lg flex items-center hover:bg-[#242424] transition-colors"
              >
                <span className="text-sm text-[#a7a7a8]">
                  Power saving
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-[#fbfbfb] mb-11 leading-[28px] tracking-[-0.96px]">
            Stick Calibration
          </h1>

          {/* Settings Content */}
          <div className="flex flex-col gap-8 items-start w-full max-w-[680px]">
            {/* Before you start section */}
            <div className="flex flex-col gap-4 items-start w-[419px]">
              <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px]">
                Before you start
              </p>
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] w-full">
                Recalibrating your controller will overwrite its current stick settings and may change how it feels in games. For best results, connect your controller directly via USB, close other controller or remap apps, and keep the sticks still until you're prompted to move them. Only continue if you're currently experiencing drift or inaccurate movement and want to update your calibration data.
              </p>
            </div>

            {/* Divider */}
            <div className="w-[419px] h-px bg-[#2e2e2e]" />

            {/* Stick selection section */}
            <div className="flex flex-col gap-4 items-start w-[419px]">
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                Select the stick you want to recalibrate.
              </p>

              {/* Dropdown */}
              <div className="w-[245px]">
                <div className="bg-[#242424] flex flex-col items-start rounded-lg shrink-0 w-full">
                  <button
                    onClick={() => setIsStickDropdownOpen(!isStickDropdownOpen)}
                    className="flex h-[48px] items-center justify-between px-2 rounded-lg shrink-0 w-full hover:opacity-90 transition-opacity"
                  >
                    <span className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedStick}
                    </span>
                    <div className="shrink-0 w-6 h-6">
                      <ChevronDownIcon />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartCalibration}
              className="h-8 px-4 text-xs font-bold bg-[#00b8fc] text-[#1a1a1a] rounded-2xl hover:bg-[#00a8ec] transition-colors uppercase tracking-[0.36px] leading-[1.16] flex items-center justify-center"
            >
              START
            </button>
          </div>
        </div>
      </div>

      {/* Help Button - Bottom Right */}
      <button className="fixed bottom-8 right-8 w-10 h-10 rounded-full border-2 border-[#2e2e2e] flex items-center justify-center hover:bg-[#1a1a1a] transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#4d4d4d"/>
          <path d="M12 11C12.5523 11 13 11.4477 13 12V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V12C11 11.4477 11.4477 11 12 11Z" fill="#4d4d4d"/>
          <path d="M13 8.5C13 9.05228 12.5523 9.5 12 9.5C11.4477 9.5 11 9.05228 11 8.5C11 7.94772 11.4477 7.5 12 7.5C12.5523 7.5 13 7.94772 13 8.5Z" fill="#4d4d4d"/>
        </svg>
      </button>

      {/* Modals */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        currentPreset={currentPreset}
        onPresetChange={handleProfileChange}
        onImport={handleOpenImportModal}
        onboardProfileMapping={onboardProfileMapping}
      />

      <ImportProfileModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportTargetProfile(null);
        }}
        targetProfile={importTargetProfile}
        onImport={handleImportProfile}
        currentPreset={currentPreset}
      />
    </div>
  );
}
