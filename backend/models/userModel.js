// use mongoose to organize and manage data / relationships
import mongoose from 'mongoose';

// store schema function
const Schema = mongoose.Schema

// create schema to define data associated with a user
    // potential add-ons:
        // a way to connect users to playlists
const userSchema = new Schema({
    _id: String,
    profilePic: String,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    tokenExpiration: {
        type: Number,
        required: true,
    }, 
})

export default mongoose.model('User', userSchema);