# Testing Plan - Authentication Module Unit Tests

**Project:** BookHive  
**Developer:** Nirajan Banjade  
**Task:** KAN-93  
**Date:** November 24 2025  
**Sprint:** Sprint 3

---

## Overview

This testing plan outlines the comprehensive unit testing strategy for the BookHive Authentication Module. The testing suite consists of **3 test files** with **9 total unit tests** (3 tests per file) that validate critical authentication API endpoints including user registration, login, and password reset functionality.

**Testing Framework:** Mocha + Supertest + Chai + Sinon  
**Backend Technology:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Tokens) + bcrypt password hashing  

---

## Test Suite 1: User Registration
**File:** `backend/TESTS/registration.test.js`  
**Developer:** Nirajan Banjade

### Purpose
Validate user registration functionality including account creation, password hashing, duplicate prevention, and password strength validation. Ensures that new users can successfully register while preventing security vulnerabilities.

### Features/Code Being Tested

#### 1. **API Endpoint:** `POST /api/users/register` (Valid Registration)
**Method/Controller:** `userController.register()`

**What is tested:**
- Creates a new user account with valid credentials
- Hashes password using bcrypt before storage
- Triggers welcome email notification (stubbed)
- Returns success response with user data

**Fields validated:**
- `username` (String, unique)
- `email` (String, unique, valid email format)
- `password` (String, hashed with bcrypt)
- `createdAt` (Date timestamp)

**Return object structure:**
```javascript
{
  message: "User registered successfully",
  user: {
    _id: ObjectId,
    username: String,
    email: String,
    createdAt: Date
  },
  token: String // JWT token
}
```

**Test validation:**
- Response status code: 201 (Created)
- User saved to database with hashed password
- Password is NOT stored in plain text
- Welcome email function called (stubbed with Sinon)
- JWT token returned

---

#### 2. **API Endpoint:** `POST /api/users/register` (Duplicate Prevention)
**Method/Controller:** `userController.register()` - Duplicate validation

**What is tested:**
- Prevents registration with existing email
- Prevents registration with existing username
- Returns appropriate error message
- Does not create duplicate user in database

**Fields validated:**
- Existing user query: `{ email }` or `{ username }`
- Duplicate detection logic
- Error response structure

**Return object structure:**
```javascript
{
  error: "Email already exists" 
  // OR "Username already exists"
}
```

**Test validation:**
- Response status code: 400 (Bad Request)
- No new user created in database
- Appropriate error message returned
- Original user data unchanged

---

#### 3. **API Endpoint:** `POST /api/users/register` (Weak Password Rejection)
**Method/Controller:** `userController.register()` - Password validation

**What is tested:**
- Rejects passwords that don't meet strength requirements
- Validates password length, complexity
- Returns validation error
- Does not create user with weak password

**Fields validated:**
- `password` (minimum length, complexity rules)
- Password validation logic
- Error response

**Return object structure:**
```javascript
{
  error: "Password does not meet requirements",
  requirements: {
    minLength: 8,
    requiresUppercase: true,
    requiresNumber: true,
    requiresSpecialChar: true
  }
}
```

**Test validation:**
- Response status code: 400 (Bad Request)
- No user saved to database
- Clear error message about password requirements
- Password validation rules enforced

---

## Test Suite 2: User Login
**File:** `backend/TESTS/login.test.js`  
**Developer:** Nirajan Banjade

### Purpose
Validate user authentication functionality including credential verification, JWT token generation, and proper error handling for invalid login attempts.

### Features/Code Being Tested

#### 1. **API Endpoint:** `POST /api/users/login` (Valid Login)
**Method/Controller:** `userController.login()`

**What is tested:**
- Authenticates user with correct credentials
- Compares password hash using bcrypt.compare()
- Generates JWT token for authenticated session
- Triggers login alert notification (stubbed)

**Fields validated:**
- `email` or `username` (login identifier)
- `password` (validated against hashed password)
- JWT token generation
- User session data

**Return object structure:**
```javascript
{
  message: "Login successful",
  user: {
    _id: ObjectId,
    username: String,
    email: String
  },
  token: String 
}
```

**Test validation:**
- Response status code: 200 (OK)
- JWT token returned and valid
- User data matches database record
- Login alert function called (stubbed with Sinon)
- Password not included in response

---

#### 2. **API Endpoint:** `POST /api/users/login` (Incorrect Password)
**Method/Controller:** `userController.login()` - Password verification failure

**What is tested:**
- Rejects login with incorrect password
- bcrypt.compare() returns false
- Returns authentication error
- Does not generate JWT token

**Fields validated:**
- Password comparison logic
- Error response structure
- Security: No information about user existence

**Return object structure:**
```javascript
{
  error: "Invalid credentials"
}
```

**Test validation:**
- Response status code: 400 (Bad Request)
- No JWT token returned
- Generic error message (security best practice)
- No sensitive information leaked

---

#### 3. **API Endpoint:** `POST /api/users/login` (Non-existent User)
**Method/Controller:** `userController.login()` - User lookup failure

**What is tested:**
- Handles login attempt for non-existent user
- Returns appropriate error
- Does not reveal whether user exists (security)
- No token generation

**Fields validated:**
- User lookup query
- Error response
- Security measures

**Return object structure:**
```javascript
{
  error: "Invalid credentials"
}
```

**Test validation:**
- Response status code: 404 (Not Found) or 400 (Bad Request)
- No JWT token generated
- Error message does not reveal user existence
- Database query returns null

---

## Test Suite 3: Password Reset
**File:** `backend/TESTS/passwordReset.test.js`  
**Developer:** Nirajan Banjade

### Purpose
Validate password reset functionality including reset code generation, email delivery, code verification, and secure password updates.

### Features/Code Being Tested

#### 1. **API Endpoint:** `POST /api/users/request-password-reset`
**Method/Controller:** `userController.requestPasswordReset()`

**What is tested:**
- Generates unique reset token/code
- Stores reset token with expiration time
- Sends reset email with code (stubbed)
- Associates reset code with user account

**Fields validated:**
- `email` (user lookup)
- `resetToken` (generated unique code)
- `resetTokenExpiry` (timestamp)
- Email sending function

**Return object structure:**
```javascript
{
  message: "Password reset code sent to email"
}
```

**Test validation:**
- Response status code: 200 (OK)
- Reset token stored in database
- Token has expiration timestamp
- Reset email function called (stubbed with Sinon)
- Token is hashed before storage (security)

---

#### 2. **API Endpoint:** `POST /api/users/reset-password` (Valid Reset Code)
**Method/Controller:** `userController.resetPassword()`

**What is tested:**
- Verifies reset code is valid and not expired
- Updates user password with new hash
- Clears reset token after successful reset
- Confirms password change

**Fields validated:**
- `resetToken` (verification)
- `resetTokenExpiry` (not expired)
- `newPassword` (hashed before update)
- Token cleanup after use

**Return object structure:**
```javascript
{
  message: "Password reset successful"
}
```

**Test validation:**
- Response status code: 200 (OK)
- Password updated in database (new hash)
- Reset token removed from user record
- Token expiry validated
- Old password no longer works

---

#### 3. **API Endpoint:** `POST /api/users/reset-password` (Invalid Reset Code)
**Method/Controller:** `userController.resetPassword()` - Invalid/expired token

**What is tested:**
- Rejects invalid reset codes
- Rejects expired reset codes
- Returns error without changing password
- Protects against brute force attacks

**Fields validated:**
- Reset token validation logic
- Token expiry check
- Error response
- Database unchanged

**Return object structure:**
```javascript
{
  error: "Invalid or expired reset code"
}
```

**Test validation:**
- Response status code: 400 (Bad Request)
- Password NOT changed in database
- Reset token remains if still valid
- Clear error message
- Security: Rate limiting considered

---

## Testing Environment Setup

### Prerequisites
```bash
# Install testing dependencies
npm install --save-dev mocha supertest chai sinon

# Ensure environment variables are set
MONGO_URI=<your_mongodb_connection_string>
MONGO_DB_NAME=Bookhive
JWT_SECRET=<your_jwt_secret>
BCRYPT_ROUNDS=10
```

### Test Execution Commands

#### For Running Tests (No Report)
```bash
# Run all authentication tests
npm run test:auth

# Run specific test suite
npx mocha TESTS/registration.test.js --timeout 10000 --exit
npx mocha TESTS/login.test.js --timeout 10000 --exit
npx mocha TESTS/passwordReset.test.js --timeout 10000 --exit
```

#### For Generating Mochawesome Report
```bash
# Generate HTML/JSON report for all authentication tests
npm run report:auth
```

**Note:** The `report:auth` script in `package.json` is configured as:
```json
"report:auth": "cross-env NODE_ENV=test mocha TESTS/registration.test.js TESTS/login.test.js TESTS/passwordReset.test.js --reporter mochawesome --reporter-options reportDir=TESTS/nirajanbanjade-report,reportFilename=auth-report --timeout 10000"
```

This script:
1. Sets `NODE_ENV=test` so emails and side-effects are disabled
2. Runs all three authentication test files at once
3. Uses Mochawesome reporter to generate HTML/JSON reports
4. Saves results in `TESTS/nirajanbanjade-report/` directory
5. Creates report file named `auth-report.html`

---

## Expected Test Coverage

| Test Suite | Test Count | API Endpoints Covered | 
|------------|------------|-----------------------|
| Registration | 3 | 1 endpoint (3 scenarios) |
| Login | 3 | 1 endpoint (3 scenarios) |
| Password Reset | 3 | 2 endpoints (3 scenarios) |
| **TOTAL** | **9** | **4 endpoints** |

---

## Technical Notes

### Mocking and Stubbing with Sinon
Tests use Sinon to stub external services:
- **Email Service:** Stub email sending functions to prevent actual emails
- **Login Alerts:** Stub notification systems
- **Time-based Functions:** Control token expiry for testing

Example stub setup:
```javascript
const sinon = require('sinon');
let emailStub;

before(() => {
  emailStub = sinon.stub(emailService, 'sendWelcomeEmail').resolves();
});

after(() => {
  emailStub.restore();
});
```

### Password Security Testing
- Passwords are hashed using bcrypt with configurable rounds
- Plain text passwords never stored
- Password comparison uses bcrypt.compare()
- Reset tokens are hashed before database storage

### Database Cleanup
Each test suite includes:
- `before()` hook: Creates test database connection
- `beforeEach()` hook: Creates fresh test data
- `afterEach()` hook: Cleans up test data after each test
- `after()` hook: Closes database connection
- Ensures tests are isolated and repeatable


---

## Repository Location
- **Testing Plan:** `backend/TESTS/TESTING_PLAN.md` (this document)
- **Test Files:** `backend/TESTS/`
  - `registration.test.js`
  - `login.test.js`
  - `passwordReset.test.js`
- **Mochawesome Reports:** `backend/TESTS/nirajanbanjade-report/`

---
