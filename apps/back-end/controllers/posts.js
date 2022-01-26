const postsService = require('../services/posts')
const usersService = require('../services/users')
const tagsService = require('../services/tags')
const likesService = require('../services/likes')
const commentsService = require('../services/comments')

const createPost = async (req, res) => {
    console.log('posts controller > createPost')
    // create new post
    // POST method
    // /api/posts

    console.log('posts controller > createPost: data:', req.body)

    const newPost = await postsService.createPost({
        ...req.body,
        author: req.curUserId,
        // add tags and users tags
        // add images handler
    })
    console.log('posts controller > createPost: newpost:', newPost)

    res.status(200).json(newPost).end()
}

const getPost = (req, res) => {
    // get post data by :postID param
    // GET method
    // /api/posts/:postId
    // ** include all the post data, like:
    //      comments,
    //      likes,
    //      usernames & images sorces
    //      ....
    const post = {
        ...req.post,
        author: {
            userId: req.post.author,
            userBasicData: usersService
                .getUser(req.post.author)
                .select('userBasicData'),
        },
        tags: req.post.tags.map((tag) => tagsService.getTag(tag)),
        userTags: req.post.userTags.map((user) => {
            return {
                userId: user,
                userBasicData: usersService
                    .getUser(user)
                    .select('userBasicData'),
            }
        }),
        likesAmount: likesService.getLikesAmount(req.post._id), //? new ObjectId(req.post._id)
        commentsAmount: commentsService.getCommentsAmount(req.post._id),
    }

    res.status(200).json(post).end()
}

const deletePost = (req, res) => {
    // delete post by :postId param
    // include comment and likes
    // DELETE method
    // /api/posts/:postId
    if (req.curUserId === req.post.author) {
        const { isLikesDeleteSuccess, deletedLikesCount, nLikes } =
            likesService.deletePost(req.post._id)
        const { isCommentsDeleteSuccess, deletedCommentsCount, nComments } =
            commentsService.deletePost(req.post._id)
        const deletedPost = postsService.deletePost(req.post._id)
        // add images handler
        if (isCommentsDeleteSuccess && isLikesDeleteSuccess) {
            res.status(200).json({ deletedPost, nComments, nLikes }).end()
        }
    } else {
        res.status(403).json({ massage: 'You are not allowed' }).end()
    }
}

const updatePost = async (req, res) => {
    // update post data by :postId param
    // PUT method
    // /api/posts/:postId
    if (req.curUserId === req.post.author) {
        const updateData = {
            ...req.body,
            author: req.post.author,
            createdDate: req.post.createdDate,
            // *** add images handler
        }
        const updatedPost = await postsService.updatePost(
            req.postId,
            updateData
        )
        res.status(200).json(updatedPost).end()
    } else {
        res.status(403).json({ massage: 'You are not allowed' }).end()
    }
}

const toggleLikePost = (req, res) => {
    // add corrent user to post's likes list
    // POST method
    // /api/posts/:postId/like
    if (likesService.checkLike(req.curUserId, req.postId)) {
        likesService.deleteLike(req.curUserId, req.postId)
        res.status(200).json({ liked: true }).end()
    } else {
        likesService.addLike(req.curUserId, req.postId)
        res.status(200).json({ liked: false }).end()
    }
}

const getPostLikes = (req, res) => {
    pass
}

// inside help middleware
const getPostById = async (req, res, next) => {
    const postId = req.params.postId
    const post = postsService.getPost(postId)
    req.postId = postId
    if (post) {
        req.post = post
        req.postId = req.post._id
        next()
    } else {
        res.status(404).json({ message: 'Post not found' }).end()
    }
}

const getPosts = async (req, res) => {
    const query = req.query.text;
    if (query.length <=2) {
        return res.status(404).json({ message: ''}).end()
    }

}

module.exports = {
    createPost,
    getPost,
    deletePost,
    updatePost,
    toggleLikePost,
    getPostLikes,
    getPostById,
}
