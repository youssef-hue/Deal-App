const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../index'); // Adjust the path to your app entry point
const User = require('../models/user.model');
const Property = require('../models/property.model');
const Ad = require('../models/ad.model');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const {jwtencrement} = require('../util/jwt.js')
const bcrypt = require('bcrypt');

// Helper function to generate a token


describe('Admin Stats Endpoint', () => {
  let mongoServer;
  let request;
  let adminToken;
  let chai;
  let agent
  let admin
  let client
  before(async () => {
    chai = await import('chai');
    const { expect } = chai;

    mongoServer = await MongoMemoryServer.create();
    mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    request = supertest(app);

    // Seed database with test data
     admin = await User.create({
      name: 'Admin User',
      phone: '01234227895',
      password: await bcrypt.hash("password", 10), // Hash this password in a real case
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    adminToken = jwtencrement(admin._id);

     agent = await User.create({
      name: 'Agent User',
      phone: '09822243215',
      password: await bcrypt.hash("password", 10), // Hash this password in a real case
      role: 'AGENT',
      status: 'ACTIVE',
    });

     client = await User.create({
      name: 'Client User',
      phone: '01122234455',
      password: await bcrypt.hash("password", 10), // Hash this password in a real case
      role: 'CLIENT',
      status: 'ACTIVE',
    });

    await Ad.create({
      area: 'Area 1',
      price: 1000,
      city: 'City 1',
      district: 'District 1',
      description: 'Description 1',
      propertyType: 'HOUSE',
      user: agent._id,
    });

    await Property.create({
      area: 'Area 2',
      price: 2000,
      city: 'City 2',
      district: 'District 2',
      description: 'Description 2',
      propertyType: 'VILLA',
      user: client._id,
    });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should retrieve admin stats successfully', async () => {
    const { expect } = chai;
    const res = await request
      .get(`/user/adminUserStats`)
      .set('Authorization', adminToken)
      .expect(200);
    console.log("🚀 ~ it ~ res:", res)

    expect(res.body).to.have.property('data');
    expect(res.body.data).to.be.an('array');
    
    res.body.data.forEach((user) => {
      expect(user).to.have.property('name');
      expect(user).to.have.property('role');
      expect(user).to.have.property('adsCount');
      expect(user).to.have.property('totalAdsAmount');
      expect(user).to.have.property('requestsCount');
      expect(user).to.have.property('totalRequestsAmount');
    });

    expect(res.body).to.have.property('page');
    expect(res.body).to.have.property('limit');
    expect(res.body).to.have.property('total');
    expect(res.body).to.have.property('hasNextPage');
    expect(res.body).to.have.property('hasPreviousPage');
  });

  it('should return 401 for non-admin users', async () => {
    const { expect } = chai;
    const client = await User.findOne({ role: 'CLIENT' });
    const clientToken = jwtencrement(client);

    await request
      .get(`/user/adminUserStats`)
      .set('Authorization', clientToken)
      .expect(401);
  });
});