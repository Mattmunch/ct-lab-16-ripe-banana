const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = Router()
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer
        .findById(req.params.id)
        .select('-__v')
        .lean(),
      Review.find({ reviewer: req.params.id })
        .populate('film', { title: true })
        .select('-__v -reviewer')
    ])
      .then(([reviewer, reviews]) => {
        reviewer.reviews = reviews;
        res.send(reviewer);

      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Promise.all([
      Reviewer
        .findById(req.params.id),
      Review
        .find({ reviewer: req.params.id })
    ])
      .then(([reviewer, review]) => {
        if(review.length > 0) {
          throw new Error('Reviewer cannot be deleted while reviews still present');
          
        } else Reviewer.findByIdAndDelete(reviewer.id)
          .then(reviewer => res.send(reviewer));
      })
      .catch(next);
      

  });
