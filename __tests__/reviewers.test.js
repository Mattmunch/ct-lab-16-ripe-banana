require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let reviewer;
  beforeEach(async() => {
    reviewer = await Reviewer.create({
      name: 'Turd Burgular',
      company:'Roto-Rooter'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('has a get all reviewers route', () => {
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toEqual([{
          _id: reviewer.id,
          name: 'Turd Burgular',
          company:'Roto-Rooter',
          __v:0
        }]);
      });
  });
  it('has a get reviewer by id route', () => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer.id,
          name: 'Turd Burgular',
          company:'Roto-Rooter',
          __v:0
        });
      });
  });
});
