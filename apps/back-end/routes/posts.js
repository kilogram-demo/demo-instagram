const { Router } = require('express');

const postsRouter = Router();
postsRouter.post('/api/posts/:postId', createPost);
postsRouter.get('/api/posts/:postId', getPost);
postsRouter.delete('/api/posts/:postId', deletePost);
postsRouter.put('/api/posts/:postId', updatePost);
postsRouter.post('/api/posts/:postId/like', toggleLikePost);


module.exports = postsRouter;