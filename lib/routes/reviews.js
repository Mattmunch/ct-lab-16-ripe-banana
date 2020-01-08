const { Router } = require('express');
const Review = require('../models/Review');


module.exports = Router()
  .get('/', (req, res, next) => {
    Review
      .find()
      .sort({ rating: -1 })
      .limit(100)
      .select({ reviewer: false })
      .populate('film', { _id: true, title: true })
      .then(reviews => res.send(reviews))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Review
      .findByIdAndDelete(req.params.id)
      .then(review => res.send(review))
      .catch(next);
    
  })
;
