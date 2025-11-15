const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const app = require('../app'); // Your Express app
const User = require('../models/User');
const mailEvents = require('../utils/mailEvents');

describe('Password Reset Tests', function() {
  
  // Increase timeout for database operations
  this.timeout(10000);

  let testUser;

  before(async function() {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/bookhive-test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  after(async function() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async function() {
    // Clear database before each test
    await User.deleteMany({});
    
    // Stub the individual email methods
    sinon.stub(mailEvents.sendMail, 'welcome').resolves({ messageId: 'test-welcome-id' });
    sinon.stub(mailEvents.sendMail, 'loginAlert').resolves({ messageId: 'test-login-id' });
    sinon.stub(mailEvents.sendMail, 'passwordReset').resolves({ messageId: 'test-reset-id' });

    // Create a test user before each reset test
    testUser = new User({
      username: 'resetuser',
      email: 'reset@example.com',
      dateOfBirth: new Date('2000-01-01')
    });
    await testUser.setPassword('OldPassword@123');
    await testUser.save();
  });

  afterEach(function() {
    sinon.restore();
  });

  it('Test 3.1: Should generate reset code and send email', async function() {
    const response = await request(app)
      .post('/api/update-password/request-password-reset')
      .send({ email: 'reset@example.com' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('ok', true);

    // Verify user has reset code in database
    const updatedUser = await User.findById(testUser._id)
      .select('+resetOtpPlain +resetOtpExpiresAt');
    
    expect(updatedUser.resetOtpPlain).to.exist;
    expect(updatedUser.resetOtpExpiresAt).to.exist;
    expect(updatedUser.resetOtpExpiresAt > new Date()).to.be.true;

    // Verify reset email was sent
    expect(mailEvents.sendMail.passwordReset.calledOnce).to.be.true;
  });

  it('Test 3.2: Should reset password with valid code', async function() {
    // First, request a reset code
    await request(app)
      .post('/api/update-password/request-password-reset')
      .send({ email: 'reset@example.com' });

    // Get the reset code from database
    const userWithCode = await User.findById(testUser._id)
      .select('+resetOtpPlain');
    const resetCode = userWithCode.resetOtpPlain;

    // Now reset the password
    const response = await request(app)
      .post('/api/update-password/reset-password-with-code')
      .send({
        email: 'reset@example.com',
        code: resetCode,
        newPassword: 'NewPassword@456'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('ok', true);
    expect(response.body.message).to.include('Password updated successfully');

    // Verify password was updated
    const updatedUser = await User.findById(testUser._id)
      .select('+passwordHash +resetOtpPlain');
    
    const isNewPasswordValid = await updatedUser.verifyPassword('NewPassword@456');
    expect(isNewPasswordValid).to.be.true;

    // Verify reset code was cleared
    expect(updatedUser.resetOtpPlain).to.be.undefined;
  });

  it('Test 3.3: Should reject password reset with invalid code', async function() {
    const response = await request(app)
      .post('/api/update-password/reset-password-with-code')
      .send({
        email: 'reset@example.com',
        code: 'INVALID_CODE',
        newPassword: 'NewPassword@456'
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Invalid or expired code!');

    // Verify password was NOT updated
    const user = await User.findById(testUser._id).select('+passwordHash');
    const isOldPasswordStillValid = await user.verifyPassword('OldPassword@123');
    expect(isOldPasswordStillValid).to.be.true;
  });
});