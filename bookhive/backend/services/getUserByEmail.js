const User = require('../models/User');

/**
 * Get user by email with optional field selection
 * @param {string} email 
 * @param {string} selectFields - e.g., '+passwordHash +resetOtpPlain'
 * @returns {Promise<User|null>}
 */
async function getUserByEmail(email, selectFields = '') {
  if (typeof email !== 'string' || !email) {
    return null;
  }
  
  let query = User.findOne({ email });
  
  if (selectFields) {
    query = query.select(selectFields);
  }
  
  return await query;
}

module.exports = { getUserByEmail };