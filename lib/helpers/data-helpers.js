require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const Studio = require('../models/Studio');
const Actor = require('../models/Actor');
const Film = require('../models/Film');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({ studios: 5, actors: 25, films: 100, reviewers: 100, reviews: 100 });
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`]: () => Model.findOne().then(prepare),
    [`get${modelName}s`]: () => Model.find().then(docs => docs.map(prepare))
  };
};

module.exports = {
  ...createGetters(Studio),
  ...createGetters(Film),
  ...createGetters(Actor),
  ...createGetters(Review),
  ...createGetters(Reviewer),
};
