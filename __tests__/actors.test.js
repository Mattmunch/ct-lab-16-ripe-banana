require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let actor;
  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Seth Rogen',
      dob: '1991-12-23',
      pob:'LA'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });


  it('has a get all actors route', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([{
          _id: actor.id,
          name: 'Seth Rogen',
          dob: '1991-12-23T00:00:00.000Z',
          pob:'LA',
          __v:0
        }]);
      });
  });
  it('has a get actor by id route', () => {
    return request(app)
      .get(`/api/v1/actors/${actor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actor.id,
          name: 'Seth Rogen',
          dob: '1991-12-23T00:00:00.000Z',
          pob:'LA',
          __v:0
        });
      });
  });
});
