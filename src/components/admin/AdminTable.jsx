import React from 'react';
import { TAB_TYPES } from '@utils/constants';

const AdminTable = ({
  data = [],
  activeTab,
  loading = false,
  error = null,
  showPhone = true,
  showEmail = true,
  className = ''
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
          <p className="mt-1 text-sm text-gray-500">ไม่มีข้อมูลในขณะนี้</p>
        </div>
      </div>
    );
  }

  const getRightsCount = (item) => {
    if (activeTab === TAB_TYPES.TOP_SPENDER) {
      return item.สิทธิ_TopSpender || 0;
    }
    if (activeTab === TAB_TYPES.VDO_CALL) {
      return item.สิทธิ_VDO_Call || 0;
    }
    // If item has type property (from combined search), use that
    if (item.type === TAB_TYPES.TOP_SPENDER) {
      return item.สิทธิ_TopSpender || 0;
    }
    if (item.type === TAB_TYPES.VDO_CALL) {
      return item.สิทธิ_VDO_Call || 0;
    }
    return 0;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('th-TH');
    } catch {
      return dateString || '-';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
              ลำดับ
            </th>
            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
              ชื่อ-นามสกุล
            </th>
            {activeTab === TAB_TYPES.TOP_SPENDER && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                สิทธิ์ TopSpender
              </th>
            )}
            {activeTab === TAB_TYPES.VDO_CALL && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                สิทธิ์ VDO Call
              </th>
            )}
            {showPhone && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                เบอร์โทรศัพท์
              </th>
            )}
            {showEmail && (
              <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
                อีเมล
              </th>
            )}
            <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">
              วันที่ลงทะเบียน
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-900">
                {item.ลำดับ || index + 1}
              </td>
              <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-900 font-medium">
                {item.ชื่อ} {item.นามสกุล}
              </td>
              {activeTab === TAB_TYPES.TOP_SPENDER && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm">
                  <span className="inline-flex px-2 py-1 rounded-full text-white font-semibold text-xs sm:text-sm badge-yellow">
                    {getRightsCount(item)} สิทธิ์
                  </span>
                </td>
              )}
              {activeTab === TAB_TYPES.VDO_CALL && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm">
                  <span className="inline-flex px-2 py-1 rounded-full text-white font-semibold text-xs sm:text-sm badge-blue">
                    {getRightsCount(item)} สิทธิ์
                  </span>
                </td>
              )}
              {showPhone && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-500">
                  {item.เบอรโทร || '-'}
                </td>
              )}
              {showEmail && (
                <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-500">
                  {item.อีเมล || '-'}
                </td>
              )}
              <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-500">
                {formatDate(item.วันที่)}
              </td>
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

export default AdminTable;