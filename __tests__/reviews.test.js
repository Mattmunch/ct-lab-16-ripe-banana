require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let actor;
  let film;
  let studio;
  let reviewer;
  let review;
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
    film = await Film.create({
      title: 'AirBud',
      studio: studio._id,
      released: 2020,
      cast: [{
        role: 'poopoo',
        actor: actor._id
      }]
    });
    reviewer = await Reviewer.create({
      name: 'Donald Trump',
      company: 'Trump Enterprises'
    });
    review = await Review.create({
      rating: 5,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
    console.log('!!!!!!!!!!!!!!!!!', review);
  });

  afterAll(() => {
    return mongoose.connection.close();
  });


  it('has a get top 100 reviews route', () => {
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toEqual([{
          _id: review.id,
          rating: review.rating,
          review: review.review,
          film: {
            _id: film.id,
            title: film.title
          }


        }]);
      });
  });
});
