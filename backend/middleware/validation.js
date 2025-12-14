// Input validation middleware
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

const validateFieldName = (name) => {
  return name && name.trim().length > 0 && name.trim().length <= 100;
};

const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
};

const validateRating = (rating) => {
  const numRating = parseInt(rating);
  return numRating >= 1 && numRating <= 5;
};

const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const validateDate = (date) => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && dateObj > new Date();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFieldName,
  validatePrice,
  validateRating,
  validateTime,
  validateDate
};
