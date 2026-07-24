import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import ProfileSelector from './ProfileSelector';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';

// Icon assets
const imgInfoIcon = "/figmaAssets/info-icon-general.svg";
const imgChevronDown = "/figmaAssets/chevron-down-general.svg";
const imgBattery = "/figmaAssets/battery-general.svg";
const imgHeart = "/figmaAssets/heart-general.svg";
const imgChevronRight = "/figmaAssets/chevron-right-general.svg";

export default function GeneralSettings() {
  const navigate = useNavigate();

  // State
  const [deviceName, setDeviceName] = useState('Ghost Controller');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [savedProfileInfo, setSavedProfileInfo] = useState({ profileName: '', targetSlot: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    return localStorage.getItem('hasUnsavedChanges') === 'true';
  });

  const handleStickCalibration = () => {
    navigate('/sticks');
  };

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

  return (
    <div className="bg-black w-full min-w-[1440px] h-screen flex flex-col">
      {/* Navigation - EXACT COPY from TriggerDeadzone */}
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
              <ChevronRight className="w-4 h-4 text-[#a7a7a8]" />
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
      <div className="flex-1 flex px-8 pb-8 gap-4 pt-4" style={{ overflow: 'visible' }}>
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
                  onClick={() => navigate('/')}
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
              {/* General - Active */}
              <button
                onClick={() => setActiveTab('general')}
                className={`h-10 px-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'general'
                    ? 'bg-[#042f44]'
                    : 'hover:bg-[#242424]'
                }`}
              >
                <span className={`text-sm ${
                  activeTab === 'general'
                    ? 'text-[#00b8fc]'
                    : 'text-[#a7a7a8]'
                }`}>
                  General
                </span>
              </button>

              {/* Stick calibration */}
              <button
                onClick={handleStickCalibration}
                className="h-10 px-2 rounded-lg flex items-center hover:bg-[#242424] transition-colors"
              >
                <span className="text-sm text-[#a7a7a8]">
                  Stick calibration
                </span>
              </button>

              {/* Power saving */}
              <button
                onClick={() => setActiveTab('power')}
                className={`h-10 px-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'power'
                    ? 'bg-[#042f44]'
                    : 'hover:bg-[#242424]'
                }`}
              >
                <span className={`text-sm ${
                  activeTab === 'power'
                    ? 'text-[#00b8fc]'
                    : 'text-[#a7a7a8]'
                }`}>
                  Power saving
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-[#fbfbfb] mb-11">
            General
          </h1>

          {/* Settings Content - EXACT spacing: 32px gap */}
          <div className="flex flex-col gap-8">
            {/* Firmware Version */}
            <div className="flex items-start justify-between w-[245px]">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px]">
                  Firmware Version
                </p>
                <div className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                  <p className="m-0">Name: 1.2.123</p>
                  <p className="m-0">Update available</p>
                </div>
              </div>
              <button className="h-[24px] px-3 py-1.5 text-xs font-bold bg-[#00b8fc] text-[#1a1a1a] rounded-lg hover:bg-[#00a8ec] transition-colors uppercase tracking-[0.36px] leading-[1.16] flex items-center justify-center">
                Update
              </button>
            </div>

            {/* Device Name - 16px gap between input and button */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-[245px]">
                <div className="flex items-center gap-2 h-6">
                  <label className="text-sm font-bold text-[#e6e6e6] leading-[1.3] tracking-[-0.42px]">
                    Device name
                  </label>
                  <img src={imgInfoIcon} alt="" className="w-6 h-6 opacity-40" />
                </div>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="h-10 px-2 bg-transparent border border-[#2e2e2e] rounded-lg text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] focus:outline-none focus:ring-2 focus:ring-[#00b8fc]"
                  placeholder="Ghost Controller"
                />
              </div>
              <button
                disabled
                className="h-[24px] px-3 py-1.5 text-xs font-bold bg-[#1f1f1f] text-[#4d4d4d] rounded-lg cursor-not-allowed uppercase tracking-[0.36px] leading-[1.16] flex items-center justify-center w-fit"
              >
                Save
              </button>
            </div>

            {/* Language Dropdown */}
            <div className="flex flex-col gap-2 w-[245px]">
              <div className="flex items-center gap-2 h-6">
                <label className="text-sm font-bold text-[#e6e6e6] leading-[1.3] tracking-[-0.42px]">
                  Language
                </label>
                <img src={imgInfoIcon} alt="" className="w-6 h-6 opacity-40" />
              </div>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full h-12 px-2 bg-[#242424] rounded-lg flex items-center justify-between hover:bg-[#2d2d2d] transition-colors"
              >
                <span className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                  {selectedLanguage}
                </span>
                <img src={imgChevronDown} alt="" className="w-6 h-6 opacity-40" />
              </button>
            </div>

            {/* Battery Level */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px]">
                Battery level
              </p>
              <div className="flex items-center gap-0">
                <p className="text-sm font-bold text-[#248456] leading-[1.3] tracking-[-0.42px] w-[29px]">90%</p>
                <img src={imgBattery} alt="" className="w-6 h-6" style={{filter: 'brightness(0) saturate(100%) invert(48%) sepia(45%) saturate(462%) hue-rotate(102deg) brightness(91%) contrast(89%)'}} />
              </div>
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                Approximately 72 hours
              </p>
            </div>

            {/* Usage */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px]">
                Usage
              </p>
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px]">
                187 Hours Played
              </p>
              <div className="flex items-center gap-0">
                <img src={imgHeart} alt="" className="w-4 h-4" style={{filter: 'brightness(0) saturate(100%) invert(16%) sepia(98%) saturate(7499%) hue-rotate(334deg) brightness(98%) contrast(114%)'}} />
                <button className="flex items-center gap-1 h-8 p-1 rounded-full hover:bg-[#1a1a1a] transition-colors">
                  <span className="text-sm font-bold text-[#00b8fc] leading-[1.3] tracking-[-0.42px]">
                    Get an extra life
                  </span>
                  <img src={imgChevronRight} alt="" className="w-6 h-6" style={{filter: 'brightness(0) saturate(100%) invert(56%) sepia(98%) saturate(2945%) hue-rotate(175deg) brightness(102%) contrast(101%)'}} />
                </button>
              </div>
            </div>

            {/* Links - 4px gap between buttons */}
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-1 h-8 pl-3 pr-1 py-1 rounded-full hover:bg-[#1a1a1a] transition-colors self-start">
                <span className="text-sm font-bold text-[#00b8fc] leading-[1.3] tracking-[-0.42px]">
                  Relaunch device onboarding
                </span>
                <img src={imgChevronRight} alt="" className="w-6 h-6" style={{filter: 'brightness(0) saturate(100%) invert(56%) sepia(98%) saturate(2945%) hue-rotate(175deg) brightness(102%) contrast(101%)'}} />
              </button>
              <button className="flex items-center gap-1 h-8 pl-3 pr-1 py-1 rounded-full hover:bg-[#1a1a1a] transition-colors self-start">
                <span className="text-sm font-bold text-[#00b8fc] leading-[#1.3] tracking-[-0.42px]">
                  Factory reset
                </span>
                <img src={imgChevronRight} alt="" className="w-6 h-6" style={{filter: 'brightness(0) saturate(100%) invert(56%) sepia(98%) saturate(2945%) hue-rotate(175deg) brightness(102%) contrast(101%)'}} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Button - Bottom Right */}
      <button className="fixed bottom-8 right-8 w-10 h-10 rounded-full border-2 border-[#2e2e2e] flex items-center justify-center hover:bg-[#1a1a1a] transition-colors">
        <div className="w-6 h-6 rounded-full border-2 border-[#666] flex items-center justify-center">
          <span className="text-xs text-[#666]">?</span>
        </div>
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

      <SaveNotification
        show={showSaveNotification}
        profileName={savedProfileInfo.profileName}
        targetSlot={savedProfileInfo.targetSlot}
        onClose={() => setShowSaveNotification(false)}
      />
    </div>
  );
}
