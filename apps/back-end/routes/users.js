const { Router } = require('express')
const { getLimitParams } = require('../middlewares/limitParams')
const {
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
    checkIsFollowing
} = require('../controllers/users')

const usersRouter = Router()
usersRouter
    .get('/api/users/:userId', getUserById, getUser)
    .get('/api/users/username/:username', getUserByUsername, getUser)
    .put('/api/users/:userId/follow', getUserById, toggleFollowUser)
    .get('/api/users/:userId/posts', getUserById, getLimitParams, getUserPosts)
    .get(
        '/api/users/:userId/following',
        getUserById,
        getLimitParams,
        getUserFollowing
    )
    .get(
        '/api/users/:userId/followers',
        getUserById,
        getLimitParams,
        getUserFollowers
    )
    .get('/api/users/:userId/is-following', checkIsFollowing)
    .get('/api/me', getMe)
    .put('/api/me', updateMe)
    .delete('/api/me', deleteMe)

module.exports = usersRouter

// '/users?page=1&limit=20'
