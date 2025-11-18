// Application constants
export const APP_CONFIG = {
  APP_NAME: 'JULA\'S HERB ACNE LAB SERIES "ONE DAY TRIP WITH POOHPAVEL" 29 NOV 2025',
  APP_DESCRIPTION: 'ระบบตรวจสอบสิทธิ์ Top Spender และ VDO Call',
  CAMPAIGN_DATE: '29 พฤศจิกายน 2025',
  CAMPAIGN_IMAGE: '/src/assets/images/POOHPAVEL 29 NOV 2025.jpg',
};

// Campaign dates
export const CAMPAIGN_DATES = {
  RIGHTS_START: '12 พฤศจิกายน 2568 เวลา 18.00.00 น.',
  RIGHTS_END: '25 พฤศจิกายน 2568 เวลา 23.59.59 น.',
  LAST_UPDATE: '14 พฤศจิกายน 68 23.59 น.',
};

// Countdown target date
export const COUNTDOWN_TARGET = new Date('November 25, 2025 23:59:59');

// Admin credentials
export const ADMIN_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'poohpavel2568',
};

// Tab types
export const TAB_TYPES = {
  TOP_SPENDER: 'top-spender',
  VDO_CALL: 'vdo-call',
};

// Search types
export const SEARCH_TYPES = {
  NAME: 'name',
  PHONE: 'phone',
  EMAIL: 'email',
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่',
  NO_RESULTS: 'ไม่พบข้อมูล',
  INVALID_INPUT: 'กรุณากรอกข้อมูลให้ถูกต้อง',
  SEARCH_ERROR: 'เกิดข้อผิดพลาดในการค้นหา',
  AUTH_ERROR: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SEARCH_SUCCESS: 'ค้นหาสำเร็จ',
  DATA_LOADED: 'โหลดข้อมูลสำเร็จ',
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
};

// Responsive breakpoints (Tailwind style)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
};

// Local storage keys
export const STORAGE_KEYS = {
  ADMIN_TOKEN: 'admin_token',
  LAST_SEARCH: 'last_search',
  USER_PREFERENCES: 'user_preferences',
};