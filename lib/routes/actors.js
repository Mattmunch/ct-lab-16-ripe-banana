const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = Router()
  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ name: true })
      .then(actors => res.send(actors))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor
        .findById(req.params.id)
        .select('-_id -__v'),
      Film
        .find({ 'cast.actor': req.params.id })
        .select('title released')

    ]).then(([actor, films]) => {
      actor.films = films;
      res.send(actor);
    })
      .catch(next);
  });
