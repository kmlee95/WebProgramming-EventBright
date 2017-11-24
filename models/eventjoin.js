const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
},{
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var eventjoin = mongoose.model('eventjoin', schema);

module.exports = eventjoin;