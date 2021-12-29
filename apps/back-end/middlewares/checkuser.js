const { getUser } = require('../services/users')

async function checkUser(req, res, next) {
    const userId = req.headers['user-id'];
    console.log("userId:", userId);
    
    const user = await getUser(userId);
    req.currentUserId = user._id;
    
    try {
        req.currentUser = user;
        req.currentUserId = user._id;
    } catch (err) {
        // err
    }

    next();
}

async function validateUser(req, res, next) {
    if (req.currentUser) {
        next();
    } else {
        res.status(403).json({message: 'you`re not allawed'}).end();
    }
}

module.exports = {
    checkUser,
    validateUser
}