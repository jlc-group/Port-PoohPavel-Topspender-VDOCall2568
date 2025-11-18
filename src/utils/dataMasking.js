// Data masking functions for privacy protection
export const maskName = (name) => {
  if (!name || name.length <= 2) return name || '';
  const visibleLength = Math.min(4, Math.ceil(name.length / 3));
  return name.substring(0, visibleLength) + '*'.repeat(Math.max(0, name.length - visibleLength));
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 ? username.substring(0, 2) + '***' : username;
  return `${maskedUsername}@${domain}`;
};

export const maskPhone = (phone) => {
  if (!phone) return '-';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length < 4) return phone;
  const last2 = digits.slice(-2);
  return `xxx-xxxxx${last2}`;
};

// Thai text normalization for better search
export const normalizeThaiText = (text) => {
  if (!text) return '';
  return text.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[่้๊๋]/g, '') // Remove Thai tone marks
    .replace(/[ัิ]/g, '')   // Remove Thai vowels
    .trim();
};

// Client-side Thai text normalization (alias for normalizeThaiText)
export const normalizeThaiTextClient = normalizeThaiText;

// Phone number normalization for flexible search
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/[^0-9]/g, '');

  // Remove leading zero for comparison (e.g., "0623130923" becomes "623130923")
  const withoutLeadingZero = digits.replace(/^0+/, '');

  return {
    original: digits,
    normalized: withoutLeadingZero,
    withLeadingZero: digits.startsWith('0') ? digits : `0${digits}`
  };
};

// Check if two phone numbers match (flexible matching)
export const phonesMatch = (searchPhone, customerPhone) => {
  if (!searchPhone || !customerPhone) return false;

  const search = normalizePhoneNumber(searchPhone);
  const customer = normalizePhoneNumber(customerPhone);

  // Exact match
  if (search.original === customer.original) return true;

  // Match with/without leading zero
  if (search.normalized === customer.normalized) return true;
  if (search.original === customer.normalized) return true;
  if (search.normalized === customer.original) return true;

  // Partial match (at least 4 digits)
  if (search.original.length >= 4) {
    if (customer.original.includes(search.original)) return true;
    if (customer.normalized.includes(search.original)) return true;
  }

  if (search.normalized.length >= 4) {
    if (customer.original.includes(search.normalized)) return true;
    if (customer.normalized.includes(search.normalized)) return true;
  }

  return false;
};

// Calculate match score for search results
export const calculateMatchScore = (searchTerm, customer) => {
  const normalizedSearch = normalizeThaiText(searchTerm);
  let score = 0;

  // Phone number matching with flexible matching
  if (customer.เบอรโทร) {
    if (phonesMatch(searchTerm, customer.เบอรโทร)) {
      const search = normalizePhoneNumber(searchTerm);
      const customer = normalizePhoneNumber(customer.เบอรโทร);

      if (search.original === customer.original || search.normalized === customer.normalized) {
        score += 15; // Exact or normalized exact match
      } else if (search.original.length >= 4 || search.normalized.length >= 4) {
        score += 8; // Partial match
      }
    }
  }

  // Name matching
  const firstName = normalizeThaiText(customer.ชื่อ);
  const lastName = normalizeThaiText(customer.นามสกุล);
  const fullName = normalizeThaiText(`${customer.ชื่อ} ${customer.นามสกุล}`);

  if (fullName === normalizedSearch) {
    score += 15; // Exact full name match
  } else if (firstName === normalizedSearch) {
    score += 12; // Exact first name match
  } else if (lastName === normalizedSearch) {
    score += 12; // Exact last name match
  } else if (firstName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 8; // Partial first name match
  } else if (lastName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 8; // Partial last name match
  } else if (fullName.includes(normalizedSearch) && normalizedSearch.length >= 2) {
    score += 6; // Partial full name match
  }

  return score;
};

// Format date for display
export const formatThaiDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};