var express = require('express');
var router = express.Router();
const Question = require('../models/question');
const catchErrors = require('../lib/async-error');


router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}},
      {start_at: {'$regex': term, '$options': 'i'}},
      {end_at: {'$regex': term, '$options': 'i'}},
      {eventType: {'$regex': term, '$options': 'i'}},
      {eventTopic: {'$regex': term, '$options': 'i'}},
    ]};
  }
  const questions = await Question.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('index', {questions: questions, term: term});
}));

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index');
});*/
module.exports = router;
