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
  content: {type: String, trim: true, required: true},//이벤트위치

  groupname: {type: String, trim: true},//조직이름
  groupexplan: {type: String, trim: true},//조직설명
 
  start_at:{type:Date, default:Date.now},
  end_at:{type:Date, default:Date.now},//시작,종료시간

  eventType:{type: String},//이벤트 종류
  eventTopic:{type:String},//이벤트 분야
  
  eventDescript:{type:String, trim:true, default:0},//이벤트설명
    
  img:{type:String}, //이벤트 이미지
  participate:{type:Number, default:100}, //참여인원
  numParticipate:{type:Number, default:0}, // 현재 참여자수

  
  ticketcount:{type:Number, default:0},
  ticketprice:{type:Number, default:0}//티켓가격

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
