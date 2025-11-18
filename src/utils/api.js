const API_BASE =
  (typeof window !== 'undefined' && window.location.origin === 'http://localhost:3003')
    ? 'http://localhost:3005' // Backend API server on port 3005
    : '';

// API endpoints
export const API_ENDPOINTS = {
  TOP_SPENDER_DATA: `${API_BASE}/api/top-spender`,
  VDO_CALL_DATA: `${API_BASE}/api/vdo-call`,
  REGISTERED_USERS: `${API_BASE}/api/registered-users`,
  COMBINED_SEARCH: (searchTerm) => `${API_BASE}/api/combined-search/${searchTerm}`,
  TOP_SPENDER_SEARCH: (searchTerm) => `${API_BASE}/api/top-spender/search/${searchTerm}`,
  VDO_CALL_SEARCH: (searchTerm) => `${API_BASE}/api/vdo-call/search/${searchTerm}`,
  CUSTOMER_SEARCH: (phone) => `${API_BASE}/api/customer/search/${phone}`,
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const fetchTopSpenderData = () => apiRequest(API_ENDPOINTS.TOP_SPENDER_DATA);
export const fetchVDOCallData = () => apiRequest(API_ENDPOINTS.VDO_CALL_DATA);
export const fetchRegisteredUsers = () => apiRequest(API_ENDPOINTS.REGISTERED_USERS);

export const searchCustomers = async (searchTerm) => {
  try {
    return await apiRequest(API_ENDPOINTS.COMBINED_SEARCH(searchTerm));
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};

// Error handling utility
export const handleApiError = (error, defaultMessage = 'เกิดข้อผิดพลาด') => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.data?.error || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่';
  } else {
    // Something happened in setting up the request
    return error.message || defaultMessage;
  }
};