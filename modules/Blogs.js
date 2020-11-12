const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    hashtag:{
        type: String,
        default: '#'
    },
    blog_content: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default : Date.now
    },
});

module.exports = mongoose.model('blog',BlogSchema);