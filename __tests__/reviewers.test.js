require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');



describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  let studio;
  let reviewer;
  let reviewer2;
  let reviews;
  let actor;
  let films;
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
      name: 'Turd Burgular',
      company:'Roto-Rooter'
    });
    reviewer2 = await Reviewer.create({
      name: 'Turd Burgular2',
      company:'Roto-Rooter2'
    });
    reviews = await Review.create([{
      rating: 3,
      reviewer: reviewer._id,
      review: 'This movie was great.',
      film: {
        _id: films[0]._id,
        title: films[0].title
      } 
        
    }]);
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
        }, {
          _id: reviewer2.id,
          name: 'Turd Burgular2',
          company:'Roto-Rooter2',
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
          company: 'Roto-Rooter',
          reviews: [{
            _id: reviews[0].id,
            rating: reviews[0].rating,
            review: reviews[0].review,
            film: {
              _id: films[0].id,
              title: films[0].title
            }
          }]
        });
      });
  });

  it('has a delete reviewer by id unless they have reviews', () => {
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer.id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Reviewer cannot be deleted while reviews still present',
          status: 500
        });
      });
  });
  it('has a delete reviewer by id if they dont have reviews', async() => {
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer2.id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: reviewer2.id,
          company: 'Roto-Rooter2',
          name: 'Turd Burgular2',
        });
      });
  });
});
