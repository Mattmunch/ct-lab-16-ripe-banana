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
  let review1;
  let review2;
  let review3;
  let review4;
  let review5;
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
    review3 = await Review.create({
      rating: 3,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
    review2 = await Review.create({
      rating: 4,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
    review5 = await Review.create({
      rating: 1,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
    review4 = await Review.create({
      rating: 2,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
    review1 = await Review.create({
      rating: 5,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: film._id
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });


  it('has a get top 100 reviews route', () => {
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toEqual([{
          _id: review1.id,
          rating: review1.rating,
          review: review1.review,
          film: {
            _id: film.id,
            title: film.title
          }
        }, {
          _id: review2.id,
          rating: review2.rating,
          review: review2.review,
          film: {
            _id: film.id,
            title: film.title
          }
        }, {
          _id: review3.id,
          rating: review3.rating,
          review: review3.review,
          film: {
            _id: film.id,
            title: film.title
          }
        }, {
          _id: review4.id,
          rating: review4.rating,
          review: review4.review,
          film: {
            _id: film.id,
            title: film.title
          }
        }, {
          _id: review5.id,
          rating: review5.rating,
          review: review5.review,
          film: {
            _id: film.id,
            title: film.title
          }
        }]);
      });
  });
});
