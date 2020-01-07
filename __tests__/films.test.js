require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let films;
  let actor;
  let studio;
  let reviews;
  let reviewer;
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
      studio: studio.id,
      released: 2020,
      cast: [{
        role: 'poopoo',
        actor: actor._id
      }]
    }]);
    reviewer = await Reviewer.create({
      name: 'Donald Trump',
      company: 'Trump Enterprises'
    });
    reviews = await Review.create([{
      rating: 3,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: films[0]._id
    }]);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
    
  it('has a get all films route', () => {
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([{
          _id: films[0].id,
          title: films[0].title,
          released: films[0].released,
          studio: {
            _id: studio.id,
            name: studio.name
          }
        }]);
      });
  });
  it('has a get film by id route', () => {
    return request(app)
      .get(`/api/v1/films/${films[0]._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: films[0].id,
          title: films[0].title,
          released: films[0].released,
          cast: [{
            _id:films[0].cast[0]._id.toString(),
            role: films[0].cast[0].role, actor: {
              _id: actor.id,
              name: 'Bilbo Baggins',
              dob: '1991-12-12T00:00:00.000Z',
              pob:'Mordor'
            } }],
          studio: {
            _id: studio.id,
            name: studio.name
          },
          reviews: reviews.map(review => ({
            _id: review.id, rating: review.rating, review: review.review, reviewer: {
              _id: reviewer.id,
              name: reviewer.name
            }  })),
        });
      });
  });
});
