const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPasswordAfterCode } = require('../controllers/token_auth');

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password-with-code', resetPasswordAfterCode);

module.exports = router;