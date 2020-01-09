const Review = require('./Review');

describe('Review model', () => {
  it('requires a rating', () => {
    const review = new Review({
      reviewer: 'sdfsdfsdfsdf',
      review: 'sdsdfsdfsdfsdfsdfsdfsdfsdf',
      film:'sdfsdfsdfsdfsdfsdfsdfsd'
    });
    const { errors } = review.validateSync();
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });
  it('requires a reviewer', () => {
    const review = new Review({
      rating: 3,
      review: 'sdsdfsdfsdfsdfsdfsdfsdfsdf',
      film:'sdfsdfsdfsdfsdfsdfsdfsd'
    });
    const { errors } = review.validateSync();
    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });
  it('requires a review', () => {
    const review = new Review({
      rating: 3,
      reviewer: 'sdfsdfsdfsdf',
      film:'sdfsdfsdfsdfsdfsdfsdfsd'
    });
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual('Path `review` is required.');
  });
  it('requires a film', () => {
    const review = new Review({
      rating: 3,
      reviewer: 'sdfsdfsdfsdf',
      review: 'sdsdfsdfsdfsdfsdfsdfsdfsdf',
    });
    const { errors } = review.validateSync();
    expect(errors.film.message).toEqual('Path `film` is required.');
  });
})
;
