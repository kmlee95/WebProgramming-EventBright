const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },//작성자
  
  tags: [String],
  numLikes: {type: Number, default: 0},
  numAnswers: {type: Number, default: 0},
  numReads: {type: Number, default: 0},

  title: {type: String, trim: true, required: true},//이벤트제목
  content: {type: String, trim: true, required: true},//이벤트내용

  groupname: {type: String, trim: true},//조직이름
  groupexplan: {type: String, trim: true},//조직설명
 
  start_at:{type:Date, default:Date.now},
  end_at:{type:Date, default:Date.now},//시작,종료시간

  eventType:{
    //value: 'event-tymenu',
    type: String
    
    //default: 'Signing'
  },//이벤트 종류
  eventTopic:{
    type:String
  }//이벤트 분야


  //pay:{type:Boolean, default:0 },//무료, 유료
  //ticketcount:{type:Number, default:0}
  //ticketprice:{type:Number, default:0},//티켓가격

  //장소
  //이벤트 관련 사진
  //설문
  
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Question = mongoose.model('Question', schema);

module.exports = Question;
