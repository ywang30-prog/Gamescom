import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ChevronRight as LucideChevronRight } from 'lucide-react';
import ProfileSelector from './ProfileSelector';
import PresetModal from './PresetModal';
import ImportProfileModal from './ImportProfileModal';
import SaveNotification from './SaveNotification';

// Icon Components
const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#A7A7A8"/>
    <path d="M12 11C12.5523 11 13 11.4477 13 12V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V12C11 11.4477 11.4477 11 12 11Z" fill="#A7A7A8"/>
    <path d="M13 8.5C13 9.05228 12.5523 9.5 12 9.5C11.4477 9.5 11 9.05228 11 8.5C11 7.94772 11.4477 7.5 12 7.5C12.5523 7.5 13 7.94772 13 8.5Z" fill="#A7A7A8"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.293 10.2929C17.6835 9.90237 18.3165 9.90237 18.707 10.2929C19.0975 10.6834 19.0975 11.3166 18.707 11.7071L13.707 16.7071C13.5194 16.8946 13.2651 17 13 17C12.7349 17 12.4806 16.8946 12.293 16.7071L7.29297 11.7071C6.90244 11.3166 6.90244 10.6834 7.29297 10.2929C7.68349 9.90237 8.3165 9.90237 8.70703 10.2929L13 14.5858L17.293 10.2929Z" fill="#A7A7A8"/>
  </svg>
);

const BatteryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 3H16.5C17.052 3 17.5 3.44772 17.5 4C17.5 4.55228 17.052 5 16.5 5H13.5C12.948 5 12.5 4.55228 12.5 4C12.5 3.44772 12.948 3 13.5 3Z" fill="#248456"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.786 6H18.214C18.924 6 19.5 6.5166 19.5 7.1538V19.8462C19.5 20.4834 18.924 21 18.214 21H11.786C11.076 21 10.5 20.4834 10.5 19.8462V7.1538C10.5 6.5166 11.076 6 11.786 6Z" fill="#248456"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.0108 2.82513C13.7502 2.56354 13.4407 2.35603 13.1001 2.21445C12.7595 2.07287 12.3945 2 12.0258 2C11.6571 2 11.2921 2.07287 10.9515 2.21445C10.6109 2.35603 10.3014 2.56354 10.0408 2.82513L9.49986 3.36777L8.95896 2.82513C8.43249 2.29699 7.71846 2.00027 6.97392 2.00027C6.22939 2.00027 5.51536 2.29699 4.98889 2.82513C4.46243 3.35328 4.16667 4.0696 4.16667 4.81652C4.16667 5.56344 4.46243 6.27976 4.98889 6.80791L9.49986 11.3333L14.0108 6.80791C14.2716 6.54644 14.4784 6.23599 14.6196 5.89431C14.7607 5.55262 14.8333 5.18638 14.8333 4.81652C14.8333 4.44666 14.7607 4.08043 14.6196 3.73874C14.4784 3.39705 14.2716 3.0866 14.0108 2.82513Z" fill="#00B8FC"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.293 7.70696C9.90244 7.31643 9.90244 6.68342 10.293 6.29289C10.6835 5.90237 11.3165 5.90237 11.707 6.29289L15.707 10.2929C16.0975 10.6834 16.0975 11.3166 15.707 11.7071L11.707 15.7071C11.3165 16.0976 10.6835 16.0976 10.293 15.7071C9.90244 15.3166 9.90244 14.6834 10.293 14.2929L13.5858 11L10.293 7.70696Z" fill="#00B8FC"/>
  </svg>
);

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
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Firmware Version - 1507:7717 */}
            <div className="flex flex-wrap gap-y-1 items-start justify-between w-[245px]">
              <div className="flex flex-col gap-2 shrink-0">
                <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                  Firmware Version
                </p>
                <div className="text-sm text-[#a7a7a8] leading-[1.3]">
                  <p className="mb-0 leading-[1.3]">Name: 1.2.123</p>
                  <p className="leading-[1.3]">Update available</p>
                </div>
              </div>
              <button className="h-8 min-w-[96px] px-4 text-xs font-bold bg-[#00b8fc] text-[#1a1a1a] rounded-2xl hover:bg-[#00a8ec] transition-colors uppercase tracking-[0.36px] leading-[1.16] flex items-center justify-center shrink-0">
                UPDATE
              </button>
            </div>

            {/* Device Name - 1507:7722 - 16px gap between field and button */}
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col gap-2 w-[245px]">
                <div className="flex gap-2 h-6 items-center w-full">
                  <label className="text-sm font-bold text-[#e6e6e6] leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0">
                    Device name
                  </label>
                  <div className="shrink-0 w-6 h-6">
                    <InfoIcon />
                  </div>
                </div>
                <div className="h-10 px-2 bg-transparent border border-[#2e2e2e] border-solid rounded-lg flex items-center w-full">
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="bg-transparent text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] focus:outline-none w-full h-[21px] overflow-hidden text-ellipsis"
                    placeholder="Ghost Controller"
                  />
                </div>
              </div>
              <button
                disabled
                className="h-8 w-[78px] text-xs font-bold bg-[#242424] text-[#4d4d4d] rounded-2xl cursor-not-allowed uppercase tracking-[0.36px] leading-[1.16] flex items-center justify-center shrink-0"
              >
                SAVE
              </button>
            </div>

            {/* Language Dropdown - 1507:7725 */}
            <div className="flex flex-col gap-2 items-start rounded-lg w-[245px]">
              <div className="flex gap-2 h-6 items-center w-full">
                <label className="text-sm font-bold text-[#e6e6e6] leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap shrink-0">
                  Language
                </label>
                <div className="shrink-0 w-6 h-6">
                  <InfoIcon />
                </div>
              </div>
              <div className="bg-[#242424] flex flex-col items-start rounded-lg shrink-0 w-full">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex h-[48px] items-center justify-between px-2 rounded-lg shrink-0 w-full hover:opacity-90 transition-opacity"
                >
                  <span className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedLanguage}
                  </span>
                  <div className="shrink-0 w-6 h-6">
                    <ChevronDownIcon />
                  </div>
                </button>
              </div>
            </div>

            {/* Battery Level - 1507:7726 */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                Battery level
              </p>
              <div className="flex items-center shrink-0">
                <p className="text-sm font-bold text-[#248456] leading-[1.3] tracking-[-0.42px] w-[29px] shrink-0">90%</p>
                <div className="w-6 h-6 shrink-0">
                  <BatteryIcon />
                </div>
              </div>
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                Approximately 72 hours
              </p>
            </div>

            {/* Usage - 1507:7732 */}
            <div className="flex flex-col gap-2 items-start w-full">
              <p className="text-sm font-bold text-[#fbfbfb] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                Usage
              </p>
              <p className="text-sm text-[#a7a7a8] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                187 Hours Played
              </p>
              <div className="flex gap-0 items-center shrink-0">
                <div className="shrink-0 w-4 h-4">
                  <HeartIcon />
                </div>
                <button className="flex gap-1 h-8 items-center p-1 rounded-full hover:bg-[#1a1a1a] transition-colors shrink-0">
                  <span className="text-sm font-bold text-[#00b8fc] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                    Get an extra life
                  </span>
                  <div className="shrink-0 w-6 h-6">
                    <ChevronRightIcon />
                  </div>
                </button>
              </div>
            </div>

            {/* Links - 1507:7738 - 4px gap between buttons */}
            <div className="flex flex-col gap-1 items-start w-full">
              <button className="flex gap-1 h-8 items-center pl-3 pr-1 py-1 rounded-full hover:bg-[#1a1a1a] transition-colors shrink-0">
                <span className="text-sm font-bold text-[#00b8fc] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                  Relaunch device onboarding
                </span>
                <div className="shrink-0 w-6 h-6">
                  <ChevronRightIcon />
                </div>
              </button>
              <button className="flex gap-1 h-8 items-center pl-3 pr-1 py-1 rounded-full hover:bg-[#1a1a1a] transition-colors shrink-0">
                <span className="text-sm font-bold text-[#00b8fc] leading-[1.3] tracking-[-0.42px] whitespace-nowrap">
                  Factory reset
                </span>
                <div className="shrink-0 w-6 h-6">
                  <ChevronRightIcon />
                </div>
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
