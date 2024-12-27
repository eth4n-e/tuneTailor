import mongoose from 'mongoose';

const Schema = mongoose.Schema

const likedSongsSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    songName: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
    artistName: {
        type: String,
        required: true,
    },
    addedAt: {
        type: String,
        required: true,
    }
})

export default mongoose.model('LikedSongsModel', likedSongsSchema);