import React from 'react';
import { maskName } from '@utils/dataMasking';
import { TAB_TYPES } from '@utils/constants';
import EmailDisplay from './EmailDisplay';
import RankingBadge, { Top44RankingBadge, VDOCallTop10Badge } from './RankingBadge';

const DataTable = ({
  data = [],
  activeTab,
  dynamicHeaderTitle = null,
  loading = false,
  error = null,
  className = '',
  showIndex = true,
  emptyMessage = 'ไม่มีข้อมูล',
  showEmail = false,
  enhancedRanking = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner h-8 w-8 border-4 border-gray-300 border-t-primary-500"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">เกิดข้อผิดพลาด</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const getHeaderText = () => {
    if (dynamicHeaderTitle) return dynamicHeaderTitle;
    if (activeTab === TAB_TYPES.TOP_SPENDER) return 'สิทธิ์ TopSpender';
    if (activeTab === TAB_TYPES.VDO_CALL) return 'สิทธิ์ VDO Call';
    if (activeTab === TAB_TYPES.REGISTERED_USERS) return 'ประเภท';
    return 'สิทธิ์';
  };

  const getRightsCount = (item) => {
    if (activeTab === TAB_TYPES.TOP_SPENDER) {
      return item.สิทธิ_TopSpender || 0;
    }
    if (activeTab === TAB_TYPES.VDO_CALL) {
      return item.สิทธิ_VDO_Call || 0;
    }
    if (activeTab === TAB_TYPES.REGISTERED_USERS) {
      return item.ประเภท || 'ไม่ระบุ';
    }
    return 0;
  };

  const getBadgeColor = (item) => {
    if (activeTab === TAB_TYPES.TOP_SPENDER) return 'badge-yellow';
    if (activeTab === TAB_TYPES.VDO_CALL) return 'badge-blue';
    if (activeTab === TAB_TYPES.REGISTERED_USERS) {
      if (item.ประเภท === 'Top Spender') return 'badge-yellow';
      if (item.ประเภท === 'VDO Call') return 'badge-blue';
      return 'badge-gray';
    }

    if (item.type === TAB_TYPES.TOP_SPENDER) return 'badge-yellow';
    if (item.type === TAB_TYPES.VDO_CALL) return 'badge-blue';

    return 'badge-gray';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showIndex && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                ลำดับ
              </th>
            )}
            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
              ชื่อ-นามสกุล
            </th>
            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
              {getHeaderText()}
            </th>
            {showEmail && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                อีเมล์
              </th>
            )}
            {data.some(item => item.เบอรโทร) && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                เบอร์โทรศัพท์
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              className={`
                hover:bg-gray-50 transition-colors
                ${enhancedRanking && (activeTab === TAB_TYPES.TOP_SPENDER || activeTab === TAB_TYPES.VDO_CALL) ?
                  (item.ลำดับ <= (activeTab === TAB_TYPES.TOP_SPENDER ? 44 : 10) ?
                    'bg-gradient-to-r from-yellow-50 to-transparent' : '') : ''}
              `}
            >
              {showIndex && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-900">
                  {enhancedRanking && (activeTab === TAB_TYPES.TOP_SPENDER || activeTab === TAB_TYPES.VDO_CALL) ? (
                    <>
                      {activeTab === TAB_TYPES.TOP_SPENDER && item.ลำดับ <= 44 && (
                        <Top44RankingBadge rank={item.ลำดับ} />
                      )}
                      {activeTab === TAB_TYPES.VDO_CALL && item.ลำดับ <= 10 && (
                        <VDOCallTop10Badge rank={item.ลำดับ} />
                      )}
                      {((activeTab === TAB_TYPES.TOP_SPENDER && item.ลำดับ > 44) ||
                        (activeTab === TAB_TYPES.VDO_CALL && item.ลำดับ > 10) ||
                        activeTab === TAB_TYPES.REGISTERED_USERS) && (
                        <RankingBadge rank={item.ลำดับ} />
                      )}
                    </>
                  ) : (
                    <RankingBadge rank={item.ลำดับ} size="sm" />
                  )}
                </td>
              )}
              <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                <div className="flex items-center gap-2">
                  <span>{maskName(item.ชื่อ)} {maskName(item.นามสกุล)}</span>
                  {enhancedRanking && (activeTab === TAB_TYPES.TOP_SPENDER || activeTab === TAB_TYPES.VDO_CALL) &&
                   item.ลำดับ <= (activeTab === TAB_TYPES.TOP_SPENDER ? 44 : 10) && (
                    <span className="animate-pulse">✨</span>
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm">
                {activeTab === TAB_TYPES.REGISTERED_USERS ? (
                  <span className={`inline-flex px-2 py-1 rounded-full text-white font-semibold text-xs sm:text-sm ${getBadgeColor(item)}`}>
                    {getRightsCount(item)}
                  </span>
                ) : (
                  <span className={`inline-flex px-2 py-1 rounded-full text-white font-semibold text-xs sm:text-sm ${getBadgeColor(item)}`}>
                    {getRightsCount(item)} สิทธิ์
                  </span>
                )}
              </td>
              {showEmail && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm">
                  <EmailDisplay
                    email={item.อีเมล์}
                    size="sm"
                    showAvatar={true}
                  />
                </td>
              )}
              {data.some(item => item.เบอรโทร) && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-500">
                  {item.เบอรโทร}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > 0 && (
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 text-center">
          แสดง {data.length} รายการ
        </div>
      )}
    </div>
  );
};

export default DataTable;