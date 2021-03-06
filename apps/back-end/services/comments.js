const CommentModel = require('../models/comment')
const likesService = require('../services/likes')

function createCommentsInstance(postId) {
    const newComment = new CommentModel({postId: postId})
    return newComment.save()
}

function getPostComments(postId, limit = 2, skip = 0) {
    return CommentModel.find({ postId: postId }).skip(skip).limit(limit)
}

function getComment(commentId) {
    return CommentModel.findById(commentId)
}

function getComments(query = {}) {
    return CommentModel.find({ query })
}

async function getCommentsAmount(postId) {
    const postComments = await CommentModel.findOne({ postId: postId }).lean()

    if (postComments) {
        return postComments.comments.length
    } else {
        return 0
    }
}

async function deleteComment(query = {}) {
    await CommentModel.find(query)
        .select('_id')
        .exec()
        .then((res) => {
            res.map((commentId) => {
                likesService.deleteLikes({commentId: commentId})
                CommentModel.findByIdAndDelete(commentId)                
            })
        })
}

module.exports = {
    createCommentsInstance,
    getPostComments,
    getComment,
    getCommentsAmount,
    deleteComment,
    getComments,
}
