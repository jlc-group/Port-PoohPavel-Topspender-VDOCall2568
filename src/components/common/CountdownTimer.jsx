import React from 'react';

const CountdownTimer = ({
  days,
  hours,
  minutes,
  seconds,
  targetDateText = '25 พ.ย. 2568 23:59:59',
  className = '',
  showHeader = true,
  compact = false,
}) => {
  const timerDisplay = (
    <div className="countdown-timer">
      <div className="text-center flex-1">
        <p className={`font-bold ${compact ? 'text-lg sm:text-xl text-gray-800' : 'text-lg sm:text-xl md:text-2xl text-gray-800'}`}>
          {days}
        </p>
        <p className="text-xs text-gray-600">วัน</p>
      </div>
      <div className="text-center flex-1">
        <p className={`font-bold ${compact ? 'text-lg sm:text-xl text-gray-800' : 'text-lg sm:text-xl md:text-2xl text-gray-800'}`}>
          {String(hours).padStart(2, '0')}
        </p>
        <p className="text-xs text-gray-600">ชั่วโมง</p>
      </div>
      <div className="text-center flex-1">
        <p className={`font-bold ${compact ? 'text-lg sm:text-xl text-gray-800' : 'text-lg sm:text-xl md:text-2xl text-gray-800'}`}>
          {String(minutes).padStart(2, '0')}
        </p>
        <p className="text-xs text-gray-600">นาที</p>
      </div>
      <div className="text-center flex-1">
        <p className={`font-bold ${compact ? 'text-lg sm:text-xl text-gray-800' : 'text-lg sm:text-xl md:text-2xl text-gray-800'} ${days === 0 && hours === 0 ? 'text-red-500 animate-pulse' : ''}`}>
          {String(seconds).padStart(2, '0')}
        </p>
        <p className="text-xs text-gray-600">วินาที</p>
      </div>
    </div>
  );

  const lastUpdateDisplay = (
    <div className="text-center py-2">
      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">อัปเดตล่าสุด</p>
      <p className="text-xs sm:text-sm text-gray-500">14 พ.ย. 68 23.59 น.</p>
    </div>
  );

  if (compact) {
    return (
      <div className={`text-center py-4 ${className}`}>
        {showHeader && (
          <div className="mb-3">
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800">นับเวลาถอยหลัง</p>
          </div>
        )}
        {timerDisplay}
        <p className="text-xs mt-3 text-gray-500">({targetDateText})</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Countdown Timer */}
      <div className="text-center py-4">
        {showHeader && (
          <div className="mb-4">
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800">นับเวลาถอยหลัง</p>
          </div>
        )}
        {timerDisplay}
        <p className="text-xs mt-4 text-gray-500">({targetDateText})</p>
      </div>

      {/* Last Update */}
      {lastUpdateDisplay}
    </div>
  );
};

export default CountdownTimer;