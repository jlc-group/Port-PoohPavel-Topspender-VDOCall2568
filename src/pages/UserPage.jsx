import React, { useEffect } from 'react';
import Header from '@components/user/Header';
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
    allData,
    loading: dataLoading,
    error: dataError,
    fetchAllData,
  } = useDataFetching();

  const {
    searchPhone,
    searchResults,
    activeTab,
    dynamicHeaderTitle,
    loading: searchLoading,
    error: searchError,
    currentData,
    handleSearch,
    clearSearch,
    setActiveTab,
    setError,
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
      {/* Header */}
      <Header />

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

        {/* Campaign Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/src/assets/images/POOHPAVEL 29 NOV 2025.jpg"
            alt={APP_CONFIG.APP_NAME}
            className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              // Fallback to text if image fails to load
            }}
          />
        </div>

        {/* Countdown Timer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <CountdownTimer
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
          />
        </div>

        {/* Search Section */}
        <div className="sticky-search-container">
          <div className="sticky-search-wrapper">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
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