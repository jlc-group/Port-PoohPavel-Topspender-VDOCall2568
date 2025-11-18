import React, { useState, useEffect } from 'react';
import AdminLogin from '@components/admin/AdminLogin';
import AdminStats from '@components/admin/AdminStats';
import SearchInput from '@components/common/SearchInput';
import TabNavigation from '@components/common/TabNavigation';
import AdminTable from '@components/admin/AdminTable';
import { useDataFetching } from '@hooks/useDataFetching';
import { useSearch } from '@hooks/useSearch';
import { useAuthentication } from '@hooks/useAuthentication';
import { TAB_TYPES } from '@utils/constants';

const AdminPage = () => {
  const { isAuthenticated, logout } = useAuthentication();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    topSpenderData,
    vdoCallData,
    registeredUsersData,
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
  } = useSearch(topSpenderData, vdoCallData, registeredUsersData);

  // Check authentication on mount
  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn, fetchAllData]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    clearSearch();
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // If not authenticated, show login screen
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLoginSuccess} />;
  }

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="header-gradient text-white p-4 sm:p-6 shadow-lg">
        <div className="max-w-full mx-auto px-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Admin Dashboard - Lucky Draw Portal
              </h1>
              <p className="text-green-100 text-xs sm:text-sm md:text-base mt-1">
                จัดการข้อมูลสิทธิ์ Top Spender และ VDO Call
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-red px-4 py-2 rounded-lg text-xs sm:text-sm"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

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

        {/* Statistics */}
        <AdminStats
          topSpenderCount={topSpenderData.length}
          vdoCallCount={vdoCallData.length}
          registeredCount={registeredUsersData.length}
          totalCount={allData.total}
        />

        {/* Search Section */}
        <div className="sticky-search-container">
          <div className="sticky-search-wrapper">
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-6">
              <SearchInput
                value={searchPhone}
                onChange={(value) => setSearchPhone(value)}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                loading={searchLoading}
                disabled={dataLoading}
                placeholder="กรอกชื่อ นามสกุล เบอร์โทรศัพท์ หรืออีเมล"
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
          <AdminTable
            data={currentData}
            activeTab={activeTab}
            dynamicHeaderTitle={dynamicHeaderTitle}
            loading={dataLoading || searchLoading}
            error={!dataLoading && !searchLoading ? (dataError || searchError) : null}
            showPhone={true}
            showEmail={true} // Show email on all tabs now
            enhancedRanking={true} // Enable enhanced ranking display
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>Admin Dashboard - Lucky Draw Portal</p>
          <p className="mt-1">© 2025 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;