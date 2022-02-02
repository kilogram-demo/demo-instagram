const jwt = require('jsonwebtoken')

const { getUser } = require('../services/users')
const { getId } = require('../services/object')
const { getToken, createToken, updateToken } = require('../services/auth')

const TEN_MINUTES = 1000 * 60 * 10
const ONE_DAY = TEN_MINUTES * 6 * 24
const ONE_MONTH = ONE_DAY * 30

// async function checkUser(req, res, next) {
//     const userId = req.headers['user-id']

//     // console.log("checkuser > checkuser > userId:", userId);

//     if (userId === '0') {
//         console.log('checkuser > : admin request')
//         req.curUser = 'admin'
//         next()
//     } else {
//         console.log('checkuser > : another user request')
//         // const user = await getUser(userId);

//         try {
//             const curUserId = getId(userId)
//             console.log(`checkuser > curUserId : ${curUserId}`)
//             const curUser = await getUser(curUserId)
//             // console.log(`checkuser: curUser ${curUser}`);
//             req.curUser = curUser
//             req.curUserId = req.curUser._id
//         } catch (err) {
//             // err
//         }

//         next()
//     }
// }

async function validateUser(req, res, next) {
    const token = req.cookies.token
    // console.log('token',token);
    if (!token) {
        res.status(401).end()
    }

    let payload, createDate

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            throw new Error('Invalid token')
        }
        createDate = new Date(payload.created)
    } catch (err) {
        return res.status(401).end()
    }
    req.curUserId = payload.userId

    if (Date.now() - createDate < TEN_MINUTES) {
        // console.log('checkuser>validateUser>short');
        // console.log('checkuser>validateUser>req.curUserId', req.curUserId);
        req.curUser = await getUser(req.curUserId)
        return next();
    }
    
    // console.log('checkuser>validateUser>long:', payload);

    const dbToken = await getToken(req.curUserId)
    let dbPayload = jwt.verify(dbToken, process.env.JWT_SECRET)
    let dbCreateDate = new Date(dbPayload.created)
    if (Date.now() - dbCreateDate > ONE_DAY) {
        return res.status(401).end()
    }

    const newToken = createToken(req.curUserId)
    updateToken({ userId: req.curUserId, token: newToken })
    res.cookie('token', newToken, {
        exp: Date.now() + ONE_MONTH,
        httpOnly: true,
    })
    next()
}

module.exports = {
    // checkUser,
    validateUser,
}
