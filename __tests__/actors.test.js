require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let actor;
  let films;
  let studio;
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
      name: 'Seth Rogen',
      dob: '1991-12-23',
      pob: 'LA'
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


  it('has a get all actors route', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([{
          _id: actor.id,
          name: 'Seth Rogen'
        }]);
      });
  });
  it('has a get actor by id route', () => {
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Seth Rogen',
          dob: '1991-12-23T00:00:00.000Z',
          pob:'LA',
          films: films.map(film => ({ _id: film.id, title: film.title, released: film.released }))
        }); 
      });
  });
});
