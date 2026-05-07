import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

// Ensure JWT_SECRET exists for the tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_123';

describe('Auth Routes', () => {

  // ==========================================
  // 🧹 Lifecycle Hooks
  // ==========================================

  beforeAll(async () => {
    // ✅ Updated to use MONGODB_URI (not _TEST)
    // ✅ Using 127.0.0.1 and authSource=admin for Windows/Docker compatibility
    const testUri = process.env.MONGODB_URI || 
                    'mongodb://admin:password123@127.0.0.1:27017/creator-platform?authSource=admin';
    
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(testUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB for Testing');
    } catch (err) {
      console.error('❌ Database Connection Error:', err.message);
      process.exit(1);
    }
  }, 20000);

  afterEach(async () => {
    // Clear all users after every test to keep tests isolated
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  // ==========================================
  // ✅ TEST CASES
  // ==========================================

  // 1. Successful Registration
  test('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'register-success@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('register-success@example.com');
  });

  // 2. Step 10: Duplicate Email
  test('should fail to register with an existing email', async () => {
    // Register first user
    await User.create({
      name: 'Existing User',
      email: 'duplicate@example.com',
      password: 'password123'
    });

    // Try to register with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Imposter',
        email: 'duplicate@example.com',
        password: 'newpassword123'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/exists/i);
  });

  // 3. Step 11: Missing Fields
  test('should fail to register with missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Incomplete User'
        // Missing email and password
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  // 4. Step 12: Successful Login
  test('should log in with correct credentials', async () => {
    // First, register a user directly via the API
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login Test User',
        email: 'login-success@example.com',
        password: 'password123'
      });

    // Then try to log in
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login-success@example.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.success).toBe(true);
  });

  // 5. Step 13: Wrong Password
  test('should fail to log in with wrong password', async () => {
    // Register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Password Test User',
        email: 'wrongpass@example.com',
        password: 'correctpassword'
      });

    // Try to log in with incorrect password
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrongpass@example.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

});