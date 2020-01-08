const chance = require('chance').Chance();
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = async({ studios = 10, actors = 50, films = 10, reviewers = 100, reviews = 100 } = {}) => {
  const createdStudios = await Studio.create([...Array(studios)].map(() => ({
    name: chance.company(),
    description: chance.sentence()
  })));

  const createdActors = await Actor.create([...Array(actors)].map((_, i) => ({
    name: `Actor ${i}`,
    dob: chance.date(),
    pob: chance.state(),
  })));

  const createdFilms = await Film.create([...Array(films)].map(() => ({
    title: chance.word(),
    studio: chance.pickone(createdStudios.map(studio => studio._id)),
    released: chance.integer({ min:1900, max: 3000 }),
    cast: [{
      role: chance.word(),
      actor:chance.pickone(createdActors.map(actor => actor._id))
    }]
  })));
  const createdReviewers = await Reviewer.create([...Array(reviewers)].map(() => ({
    name: chance.name(),
    company: chance.company()
  })));
  await Review.create([...Array(reviews)].map(() => ({
    rating: chance.integer({ min: 1, max: 5 }),
    reviewer: chance.pickone(createdReviewers.map(reviewer => reviewer._id)),
    review: chance.sentence(),
    film: chance.pickone(createdFilms.map(film => film._id))
  })));
    
};
