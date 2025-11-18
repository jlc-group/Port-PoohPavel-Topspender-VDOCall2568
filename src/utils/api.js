// API Base URL configuration
const API_BASE = (() => {
  if (typeof window === 'undefined') return '';

  const hostname = window.location.hostname;
  const port = window.location.port;

  // Development environment - use Express backend
  if (hostname === 'localhost' && port === '3003') {
    return 'http://localhost:3005';
  }

  // Production environment on Cloudflare Pages - use relative paths for Functions
  if (hostname.includes('.pages.dev') || hostname.includes('.workers.dev')) {
    return '';
  }

  // Default fallback
  return '';
})();

// API endpoints
export const API_ENDPOINTS = {
  TOP_SPENDER_DATA: `${API_BASE}/api/top-spender/customers`,
  VDO_CALL_DATA: `${API_BASE}/api/vdo-call/customers`,
  REGISTERED_USERS: `${API_BASE}/api/registered-users/customers`,
  COMBINED_SEARCH: (searchTerm) => `${API_BASE}/api/combined-search/${encodeURIComponent(searchTerm)}`,
  TOP_SPENDER_SEARCH: (searchTerm) => `${API_BASE}/api/top-spender/search/${encodeURIComponent(searchTerm)}`,
  VDO_CALL_SEARCH: (searchTerm) => `${API_BASE}/api/vdo-call/search/${encodeURIComponent(searchTerm)}`,
  REGISTERED_USERS_SEARCH: (searchTerm) => `${API_BASE}/api/registered-users/search/${encodeURIComponent(searchTerm)}`,
  CUSTOMER_SEARCH: (phone) => `${API_BASE}/api/customer/search/${encodeURIComponent(phone)}`,
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
      // Handle HTML responses (like 404 pages) that return instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('API endpoint not found - please check deployment configuration');
      }

      // Try to get error message from JSON response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use the original error message
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);

    // Enhanced error messages for common Cloudflare issues
    if (error.message.includes('API endpoint not found')) {
      throw new Error('API functions are not properly deployed. Please check Cloudflare Functions configuration.');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection and try again.');
    }

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