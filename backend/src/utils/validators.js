// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Password validation
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// URL validation for images
const isValidImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return validExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
};

// Date validation
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// Weight validation
const isValidWeight = (weight) => {
  return weight > 0 && weight <= 100; // Max 100kg
};

// Rating validation
const isValidRating = (rating) => {
  return rating >= 1 && rating <= 5;
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length
};

// Validate object fields
const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

// Format price
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

// Calculate distance (mock for now)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidImageUrl,
  isValidDate,
  isValidWeight,
  isValidRating,
  sanitizeInput,
  validateRequiredFields,
  formatPrice,
  calculateDistance
};
