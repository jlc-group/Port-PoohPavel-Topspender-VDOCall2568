import React from 'react';
import { TAB_TYPES } from '@utils/constants';

const TabNavigation = ({
  activeTab,
  onTabChange,
  disabled = false,
  className = '',
}) => {
  const tabs = [
    {
      id: TAB_TYPES.TOP_SPENDER,
      label: '🎁 Top Spender',
      icon: '🎁',
    },
    {
      id: TAB_TYPES.VDO_CALL,
      label: '📹 VDO Call',
      icon: '📹',
    },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !disabled && onTabChange(tab.id)}
            disabled={disabled}
            className={`flex-1 px-2 sm:px-4 py-3 sm:py-4 font-semibold transition-colors text-xs sm:text-sm md:text-base ${
              activeTab === tab.id
                ? 'tab-active'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="hidden sm:inline">{tab.icon} {tab.label}</span>
            <span className="sm:hidden">{tab.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;