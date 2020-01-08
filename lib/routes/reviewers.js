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
  });
