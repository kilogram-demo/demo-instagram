const UserModel = require('../models/user')
const postsService = require('../services/posts')
const commentsService = require('../services/comments')
const likesService = require('../services/likes')
const authService = require('../services/auth')

function createUser(data) {
    const newUser = new UserModel(data)
    return newUser.save()
}

function getUser(userId) {
    return UserModel.findById(userId)
}

function getUserIdByUsername(username) {
    return UserModel.findOne({ 'userBasicData.username': username }).select(
        '_id'
    )
}

function getUsers(query = {}) {
    return UserModel.find(query)
}

async function getUserPosts({ userId, skip = 0, limit = 10 }) {
    const MAX_POSTS = 20
    limit = Math.min(limit, MAX_POSTS)

    const posts = await postsService
        .getPosts({ author: userId })
        .skip(skip)
        .limit(limit)
        .populate('author', 'userBasicData')
        .populate('tags')
        .populate('userTags', 'userBasicData')
        .lean()
        .then((posts) => {
            return Promise.all(
                posts.map(async (post) => {
                    ;(post.likesAmount = await likesService.getLikesAmount(
                        post._id
                    )),
                        (post.commentsAmount =
                            await commentsService.getCommentsAmount(post._id))
                    return post
                })
            )
        })

  

    return posts
}

async function getUserFollowers(userId, skip = 0, limit = 10) {
    const followers = await getUsers({ 'additionalData.following': userId })
        .select('userBasicData')
        .select('additionalData.name')
        .skip(skip)
        .limit(limit)
        .lean()
   
    return followers
}

async function getUserFollowing(following, skip = 0, limit = 10) {
   
    return await getUsers({ _id: following })
        .select('userBasicData')
        .select('additionalData.name')
        .skip(skip)
        .limit(limit)
        .lean()
}

function deleteUser(userId) {
    deleteUserPosts(userId)
    deleteUserComments(userId)
    deleteUserLikes(userId)
    deleteUserAuth(userId)
    return UserModel.findByIdAndDelete(userId)
}

async function deleteUserPosts(userId) {
    postsService.deletePost({ author: userId })
}

async function deleteUserComments(userId) {
    commentsService.deleteComment({ userId: userId })
}

async function deleteUserLikes(userId) {
    likesService.deleteLikes({ userId: userId })
}

async function deleteUserAuth(userId) {
    return await authService.deleteAuth({ userId: userId })
}

function updateUser(userId, data) {
    return UserModel.findByIdAndUpdate(userId, data)
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    getUserPosts,
    getUserFollowers,
    getUserFollowing,
    getUserIdByUsername,
}
