const { getReviewer, getReviewers, getReview } = require('../lib/helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');
const Review = require('../lib/models/Review');



describe('reviewer routes', () => {

  it('has a get all reviewers route', async() => {
    const reviewers = await getReviewers();
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toEqual(reviewers);
      });
  });
  it('has a get reviewer by id route', async() => {
    const reviewer = await getReviewer();
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id.toString(),
          name: reviewer.name,
          company: reviewer.company,
          reviews: expect.any(Array)
        });
      });
  });

  it('has a delete reviewer by id unless they have reviews', async() => {
    const review = await getReview();
    const reviewer = await getReviewer({ _id: review.reviewer });
    
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'Reviewer cannot be deleted while reviews still present',
          status: 500
        });
      });
  });
  it('has a delete reviewer by id if they dont have reviews', async() => {
    const reviewer = await getReviewer();
    await Review.deleteMany({ reviewer: reviewer._id });
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: reviewer._id,
          company: reviewer.company,
          name: reviewer.name,
        });
      });
  });
});
