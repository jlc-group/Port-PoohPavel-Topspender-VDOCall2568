import React, { useState } from 'react';

const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  loading = false,
  disabled = false,
  placeholder = 'กรอกชื่อ นามสกุล หรือเบอร์โทรศัพท์',
  className = '',
  showClearButton = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={`search-inline ${className}`}>
      <div className="flex-1">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          🔍 ค้นหาด้วยชื่อ นามสกุล หรือเบอร์โทรศัพท์
        </label>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`search-input w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus-green text-sm ${
            isFocused ? 'ring-2 ring-primary-500 border-primary-500' : ''
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <button
        onClick={onSearch}
        disabled={disabled || loading || !value.trim()}
        className={`btn-green px-4 py-2 sm:px-6 rounded-lg transition-colors text-xs sm:text-sm ml-2 ${
          disabled || loading || !value.trim() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ค้นหา...
          </span>
        ) : (
          'ค้นหา'
        )}
      </button>

      {showClearButton && value && !loading && (
        <button
          onClick={handleClear}
          disabled={disabled}
          className="btn-gray px-3 py-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm ml-2"
        >
          ล้าง
        </button>
      )}
    </div>
  );
};

export default SearchInput;