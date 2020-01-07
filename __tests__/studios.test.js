require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let studio;
  let films;
  let actor;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Paramount Pictures',
      address: {
        city: 'portland',
        state: 'oregon',
        country: 'USA'
      },
    });
    actor = await Actor.create({
      name: 'Bilbo Baggins',
      dob: '1991-12-12',
      pob:'Mordor'
    });
    films = await Film.create([{
      title: 'AirBud',
      studio: studio._id,
      released: 2020,
      cast: [{
        role: 'poopoo',
        actor: actor._id
      }]
    }]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
    
  it('has a get all studios route', () => {
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual([{
          _id: studio.id,
          name: 'Paramount Pictures'
        }]);
      });
  });
  it('has a get studio by id route', () => {
    return request(app)
      .get(`/api/v1/studios/${studio.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id.toString(),
          name: 'Paramount Pictures',
          address: {
            city: 'portland',
            state: 'oregon',
            country: 'USA',
          },
          films: films.map(film => ({ _id: film._id.toString(), title: film.title, studio: film.studio.toString() })),
          __v:0
        });
      });
  });
    
    
    
    
    
});
