import React from 'react';
import { APP_CONFIG, CAMPAIGN_DATES } from '@utils/constants';

const Header = () => {
  return (
    <div className="header-gradient text-white p-4 sm:p-6 shadow-lg">
      <div className="max-w-full mx-auto px-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
          {APP_CONFIG.APP_NAME}
        </h1>
        <p className="text-center text-green-100 text-xs sm:text-sm md:text-base mb-1">
          ตรวจสอบสิทธิ์ Top Spender และ VDO Call
        </p>
        <p className="text-center text-yellow-200 text-xs sm:text-xs md:text-sm mb-3 font-medium">
          สิทธิ์ตั้งแต่วันที่ {CAMPAIGN_DATES.RIGHTS_START} ถึง {CAMPAIGN_DATES.RIGHTS_END}
        </p>
      </div>
    </div>
  );
};

export default Header;