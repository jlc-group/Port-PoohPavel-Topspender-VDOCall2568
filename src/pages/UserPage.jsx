import { useEffect } from 'react';
import SearchInput from '@components/common/SearchInput';
import TabNavigation from '@components/common/TabNavigation';
import DataTable from '@components/common/DataTable';
import CountdownTimer from '@components/common/CountdownTimer';
import { useDataFetching } from '@hooks/useDataFetching';
import { useSearch } from '@hooks/useSearch';
import { useCountdown } from '@hooks/useCountdown';
import { APP_CONFIG, CAMPAIGN_DATES } from '@utils/constants';

const UserPage = () => {
  const {
    topSpenderData,
    vdoCallData,
    loading: dataLoading,
    error: dataError,
    fetchAllData,
  } = useDataFetching();

  const {
    searchPhone,
    activeTab,
    dynamicHeaderTitle,
    loading: searchLoading,
    error: searchError,
    currentData,
    handleSearch,
    clearSearch,
    setActiveTab,
    setSearchPhone,
  } = useSearch(topSpenderData, vdoCallData);

  const {
    days,
    hours,
    minutes,
    seconds,
  } = useCountdown();

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-full mx-auto p-2 sm:p-4 md:p-6">
        {/* Error Display */}
        {dataError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
            <p className="text-red-700 text-xs sm:text-sm text-center">
              ⚠️ {dataError}
            </p>
          </div>
        )}

        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
            <p className="text-red-700 text-xs sm:text-sm text-center">
              ⚠️ {searchError}
            </p>
          </div>
        )}

        {/* Campaign Image - Full Width */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="/src/assets/images/POOHPAVEL 29 NOV 2025.jpg"
            alt={APP_CONFIG.APP_NAME}
            className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[200px] sm:max-h-[280px] lg:max-h-[350px] xl:max-h-[400px]"
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback to text if image fails to load
            }}
          />
        </div>

      {/* Countdown and Search Section - Two Column Layout (All Screen Sizes) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6">
          {/* Left Column - Countdown Timer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CountdownTimer
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          </div>

          {/* Right Column - Search Section */}
          <div className="sticky-search-container">
            <div className="sticky-search-wrapper">
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 h-full flex flex-col justify-center">
                <SearchInput
                  value={searchPhone}
                  onChange={setSearchPhone}
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                  loading={searchLoading}
                  disabled={dataLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          disabled={dataLoading || searchLoading}
        />

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <DataTable
            data={currentData}
            activeTab={activeTab}
            dynamicHeaderTitle={dynamicHeaderTitle}
            loading={dataLoading || searchLoading}
            error={!dataLoading && !searchLoading ? (dataError || searchError) : null}
            emptyMessage={searchPhone ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูลในขณะนี้'}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>© 2025 {APP_CONFIG.APP_DESCRIPTION}. All rights reserved.</p>
          <p className="mt-1">สิทธิ์ตั้งแต่วันที่ {CAMPAIGN_DATES.RIGHTS_START} ถึง {CAMPAIGN_DATES.RIGHTS_END}</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;