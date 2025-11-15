const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const app = require('../app'); // Your Express app
const User = require('../models/User');
const mailEvents = require('../utils/mailEvents');

describe('User Login Tests', function() {
  
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

    // Create a test user before each login test
    testUser = new User({
      username: 'logintest',
      email: 'login@example.com',
      dateOfBirth: new Date('2000-01-01')
    });
    await testUser.setPassword('Test@1234');
    await testUser.save();
  });

  afterEach(function() {
    sinon.restore();
  });

  it('Test 2.1: Should successfully login with valid credentials', async function() {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        name_email: 'login@example.com',
        password: 'Test@1234'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'Login successful');
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('userId');
    expect(response.body).to.have.property('username', 'logintest');
    expect(response.body).to.have.property('isMinor');

    // Verify JWT token is valid
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded.id).to.equal(testUser._id.toString());

    // Verify login alert was sent
    expect(mailEvents.sendMail.loginAlert.calledOnce).to.be.true;
  });

  it('Test 2.2: Should reject login with incorrect password', async function() {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        name_email: 'login@example.com',
        password: 'WrongPassword@123'
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Invalid username/email or password!!');
    expect(response.body).to.not.have.property('token');

    // Verify no login alert was sent
    expect(mailEvents.sendMail.loginAlert.called).to.be.false;
  });

  it('Test 2.3: Should reject login for non-existent user', async function() {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        name_email: 'nonexistent@example.com',
        password: 'Test@1234'
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Invalid username/email or password!!');
    expect(response.body).to.not.have.property('token');
  });
});