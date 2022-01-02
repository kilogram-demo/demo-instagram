const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const LikeSchema = new mongoose.Schema({
    postId: {type: ObjectId, ref: 'Post', required: true},
    commentId: {type: ObjectId, ref: 'Comment'},
    user: {type: ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now}
});

const LikeModel = mongoose.model('Like', LikeSchema);

module.exports = LikeModel;