import React from 'react';

const AdminStats = ({
  topSpenderCount = 0,
  vdoCallCount = 0,
  registeredCount = 0,
  totalCount = 0,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6 ${className}`}>
      {/* Top Spender */}
      <div className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm mb-1">Top Spender</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{topSpenderCount}</p>
          <p className="text-xs text-green-100">ท่านที่มีสิทธิ์</p>
        </div>
      </div>

      {/* VDO Call */}
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm mb-1">VDO Call</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{vdoCallCount}</p>
          <p className="text-xs text-blue-100">ท่านที่มีสิทธิ์</p>
        </div>
      </div>

      {/* Registered Users */}
      <div className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm mb-1">Registered</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{registeredCount}</p>
          <p className="text-xs text-purple-100">ผู้ลงทะเบียน</p>
        </div>
      </div>

      {/* Total */}
      <div className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs sm:text-sm mb-1">รวมทั้งหมด</p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold">{totalCount}</p>
          <p className="text-xs text-gray-100">รายการทั้งหมด</p>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;