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

// Calculate match score for search results
export const calculateMatchScore = (searchTerm, customer) => {
  const normalizedSearch = normalizeThaiText(searchTerm);
  const cleanPhone = searchTerm.replace(/[^0-9]/g, '');
  let score = 0;

  // Phone number matching
  if (cleanPhone && customer.เบอรโทร) {
    const customerPhone = customer.เบอรโทร.replace(/[^0-9]/g, '');
    if (customerPhone === cleanPhone) {
      score += 10; // Exact phone match
    } else if (customerPhone.includes(cleanPhone) && cleanPhone.length >= 4) {
      score += 5; // Partial phone match
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