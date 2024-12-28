import mongoose from 'mongoose';

const Schema = mongoose.Schema

const likedSongsSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    trackId: {
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
        // type: Date
        type: String,
        required: true,
    }
})

export default mongoose.model('LikedSongs', likedSongsSchema);