const usersService = require('../services/users')
const postsService = require('../services/posts')
// const { post } = require('../routes/users');
const { getId } = require('../services/object')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const getUser = async (req, res) => {
    const user = await usersService.getUser(req.userId).lean()

    user.additionalData.following = user.additionalData.following.length
    user.additionalData.followers = await usersService
        .getUsers({ 'additionalData.following': user._id })
        .count()
        .exec()

    user.posts = {
        postsAmount: await postsService
            .getPosts({ author: user._id })
            .count()
            .exec(),
        firstPosts: await usersService.getUserPosts({
            userId: user._id,
            limit: 15,
        }),
    }

    res.json(user).status(200).end()
}

const toggleFollowUser = (req, res) => {
    if (req.curUser.additionalData.following.includes(req.userId)) {
        const newFollowing = req.curUser.additionalData.following
        newFollowing.splice(newFollowing.indexOf(req.userId), 1)
        req.curUser.additionalData.following = newFollowing
        req.curUser.save()

        res.status(200).json({ isFollow: false }).end()
    } else {
        req.curUser.additionalData.following.push(req.userId)
        req.curUser.save()

        res.status(200).json({ isFollow: true }).end()
    }
}

const getUserPosts = async (req, res) => {
    const posts = await usersService.getUserPosts({
        userId: req.userId,
        skip: req.skip,
        limit: req.limit,
    })

    res.status(200).json(posts).end()
}

const getUserFollowing = async (req, res) => {
    const following = await usersService.getUserFollowing(
        req.user.additionalData.following,
        req.skip,
        req.limit
    )
    res.status(200).json(following).end()
}

const getUserFollowers = async (req, res) => {
    const followers = await usersService.getUserFollowers(
        req.userId,
        req.skip,
        req.limit
    )
    res.status(200).json(followers).end()
}

const checkIsFollowing = async (req, res) => {
    const userId = req.params.userId
    const isFollowing = req.curUser.additionalData.following.some(following => following.equals(userId))
    res.status(200).json(isFollowing).end()
}

const getMe = async (req, res) => {
    const me = req.curUser.toObject()
    me.additionalData.following = me.additionalData.following.length
    me.additionalData.followers = await usersService
        .getUsers({ 'additionalData.following': req.curUserId })
        .count()
        .exec()
    me.posts.postsAmount = await postsService
        .getPosts({ author: req.curUserId })
        .count()
        .exec()
    me.posts.firstPosts = await usersService.getUserPosts({
        userId: req.curUserId,
        limit: 15,
    })

    res.json(me).status(200).end()
}

const updateMe = (req, res) => {
    // update user data
    // PUT method
    // /api/me
}

const deleteMe = async (req, res) => {
    const userId = req.curUserId
    const deletedUser = await usersService.deleteUser(userId)
    try {
        return res.json(deletedUser).status(200).end()
    } catch (err) {
        return res.status(500).json('Something went wrong').end()
    }
}

// inside help middleware
const getUserById = async (req, res, next) => {
    const userId = getId(req.params.userId)
    const user = await usersService.getUser(userId)
    req.userId = userId
    if (user) {
        req.user = user
        req.userId = req.user._id
        next()
    } else {
        res.status(404).json({ message: 'User not found' }).end()
    }
}

const getUserByUsername = async (req, res, next) => {
    const username = req.params.username
    const userId = await usersService.getUserIdByUsername(username)
    if (userId) {
        req.userId = userId
        next()
    } else {
        res.status(404).json({ message: 'User not found' }).end()
    }
}

module.exports = {
    getUser,
    getUserPosts,
    toggleFollowUser,
    getMe,
    updateMe,
    deleteMe,
    getUserById,
    getUserFollowing,
    getUserFollowers,
    getUserByUsername,
    checkIsFollowing,
}
