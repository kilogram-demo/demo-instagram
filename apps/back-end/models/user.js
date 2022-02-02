const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

const UserSchema = new mongoose.Schema(
    {
        userBasicData: {
            username: { type: String, required: true, unique: true},
            profileImageSrc: String,
        },
        additionalData: {
            name: {
                firstName: String,
                lastName: String,
            },
            email: {
                type: String,
                required: true,
                unique: true
                // validate: emailRegex.test
            },
            phone: String,
            website: String,
            bio: String,
            gender: String,
            followers: [{ type: ObjectId, ref: 'User' }],
            following: [{ type: ObjectId, ref: 'User' }],
            created: { type: Date, default: Date.now },
        },
        posts: {
            myPosts: [{ type: ObjectId, ref: 'Post' }],
            taggedPosts: [{ type: ObjectId, ref: 'Post' }],
            savedPosts: [{ type: ObjectId, ref: 'Post' }],
        },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
)

// UserSchema.virtual('followingCount').get(function() {
//     return this.additionalData.following.length
// });

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
