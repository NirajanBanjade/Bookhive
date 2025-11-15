const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const app = require('../app'); // Your Express app
const User = require('../models/User');
const mailEvents = require('../utils/mailEvents');

describe('User Registration Tests', function() {
  
  // Increase timeout for database operations
  this.timeout(10000);

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
  });

  afterEach(function() {
    sinon.restore();
  });

  it('Test 1.1: Should successfully register a new user with valid data', async function() {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test@1234',
      dateOfBirth: '2000-01-01'
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(userData);

    // Assert response
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message', 'User registered successfully!');
    expect(response.body).to.have.property('userId');

    // Verify user exists in database
    const user = await User.findById(response.body.userId);
    expect(user).to.exist;
    expect(user.username).to.equal('testuser');
    expect(user.email).to.equal('test@example.com');

    // Verify welcome email was called
    expect(mailEvents.sendMail.welcome.calledOnce).to.be.true;
    const emailArg = mailEvents.sendMail.welcome.firstCall.args[0];
    expect(emailArg).to.have.property('username', 'testuser');
    expect(emailArg).to.have.property('email', 'test@example.com');
  });

  it('Test 1.2: Should reject registration with duplicate email or username', async function() {
    // Create existing user
    const existingUser = new User({
      username: 'existinguser',
      email: 'existing@example.com',
      dateOfBirth: new Date('2000-01-01')
    });
    await existingUser.setPassword('Test@1234');
    await existingUser.save();

    // Try to register with same email
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'newuser',
        email: 'existing@example.com',
        password: 'Test@1234',
        dateOfBirth: '2000-01-01'
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Username or email already in use!!');
    
    // Verify no welcome email was sent
    expect(mailEvents.sendMail.welcome.called).to.be.false;
  });

  it('Test 1.3: Should reject registration with weak password', async function() {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        dateOfBirth: '2000-01-01'
      });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message', 'Password does not match the criteria.');
    
    // Verify user was not created
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).to.be.null;
  });
});