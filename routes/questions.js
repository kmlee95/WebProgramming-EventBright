const express = require('express');
const Question = require('../models/question');
const Answer = require('../models/answer'); 
const catchErrors = require('../lib/async-error');
const Eventjoin = require('../models/eventjoin');

const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

/*이미지관련*/
const mimetypes={
  "image/jpeg":"jpg",
  "image/gif":"gif",
  "image/png":"png"
};
const upload= multer({
  dest :'tmp',
  fileFilter:(req, file, cb)=>{
    var ext = mimetypes[file.mimetype];
    if(!ext){
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
})


function validateForm(form, options) {
  var title = form.title || "";
  var content = form.content || "";
  var groupname = form.groupname || "";
  var groupexplan = form.groupexplan || "";
  var start_at = form.start_at || "";
  var end_at = form.end_at || "";
  var participate = form.participate || "";
  var eventType = form.eventType || "";
  var eventTopic = form.eventTopic || "";

  if (!title) {
    return '제목을 입력해주세요!';
  }
  if (!content) {
    return '이벤트 내용을 입력해주세요!';
  }
  if (!groupname) {
    return '조직이름을 입력해주세요!';
  }
  if (!groupexplan) {
    return '조직설명을 입력해주세요!';
  }
  
  if (!start_at) {
    return '시작 날짜를 입력해주세요!';
  }
  if (!end_at) {
    return '종료 날짜를 입력해주세요!';
  }
  if (!participate) {
    return '최대인원을 입력해주세요!';
  }
  return null;
}

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET questions listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}},
      {locate: {'$regex': term, '$options': 'i'}},
    ]};
  }
  const questions = await Question.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('questions/index', {questions: questions, term: term});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('questions/new', {question: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  res.render('questions/edit', {question: question});
}));

router.get('/:id', needAuth,catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate('author');
  const answers = await Answer.find({question: question.id}).populate('author');
  const eventjoins=await Eventjoin.find({question: question.id}).populate('author');
  question.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await question.save();
  res.render('questions/show', {question: question, answers: answers, eventjoins: eventjoins}); // user등록과 똑같이..
}));

router.put('/:id', needAuth,catchErrors(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }
  question.title = req.body.title;
  question.content = req.body.content;
  
  question.locate = req.body.locate,
  
  question.tags = req.body.tags.split(" ").map(e => e.trim());

  question.groupname = req.body.groupname;
  question.groupexplan = req.body.groupexplan;
  question.start_at = req.body.start_at;
  question.end_at = req.body.end_at;
  
  question.eventType = req.body.eventType;
  question.eventTopic = req.body.eventTopic;

  question.ticketcount = req.body.ticketcount;
  question.ticketprice = req.body.ticketprice;

  question.eventDescript = req.body.eventDescript;
  question.participate = req.body.participate;

  await question.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/questions');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Question.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/questions');
}));

router.post('/', needAuth, upload.single('img'), catchErrors(async (req, res, next) => {
  const user = req.user;
  const err = validateForm(req.body);
    if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var question = new Question({
    author: user._id,
    title: req.body.title,
    content: req.body.content,

    locate: req.body.locate,
    
    groupname:req.body.groupname,
    groupexplan:req.body.groupexplan,
    start_at:req.body.start_at,
    end_at:req.body.end_at,
    
    eventType:req.body.eventType,
    eventTopic:req.body.eventTopic,

    ticketcount:req.body.ticketcount,
    ticketprice:req.body.ticketprice,
  
    eventDescript:req.body.eventDescript,
    participate:req.body.participate,
    tags: req.body.tags.split(" ").map(e => e.trim()),
  });

  if(req.file){
    const dest = path.join(__dirname, '../public/images/uploads/');
    console.log("File ->", req.file);
    const filename =req.file.filename + "." + mimetypes[req.file.mimetype];
    await fs.move(req.file.path, dest + filename);
    question.img="/images/uploads/" + filename;
  }

  await question.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/questions');
}));

router.post('/:id/answers', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const question = await Question.findById(req.params.id);

  if (!question) {
    req.flash('danger', 'Not exist question');
    return res.redirect('back');
  }

  var answer = new Answer({
    author: user._id,
    question: question._id,
    content: req.body.content
  });
  await answer.save();
  question.numAnswers++;
  await question.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/questions/${req.params.id}`);
}));

router.post('/:id/eventjoin', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const question = await Question.findById(req.params.id);
  var findjoin = await Eventjoin.findOne({author: req.user._id, question: question._id});

  if(question.participate > question.numParticipate){
    if(findjoin){
      req.flash('danger', '이미 신청된 상태입니다.');
    }else{
      var eventjoin = new Eventjoin({
        author:user._id,
        question: question._id
      });
      await eventjoin.save();

      question.numParticipate++;
      req.flash('success', '참가신청 되었습니다.');
    }
  }else{
    req.flash('danger', '인원 초과입니다.');
  }
  await question.save();
  res.redirect('back');
}));

module.exports = router;
