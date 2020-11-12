const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../modules/User'); 
const Blog = require('../modules/Blogs'); 

//@route Get api/blog
//@desc Get all users blogs
//@access Private
router.get('/',auth, async(req, res) =>{
    try {
        const blog = await Blog.find({user: req.user.id}).sort({date:-1});
    res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route Post api/blog
//@desc Add new blog
//@access Private
router.post('/',[auth, [
    check('title', 'Title is required')
    .not().isEmpty()
]],
async(req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const {title, hashtag, blog_content, comment} = req.body;

    try {
        const newBlog = new Blog({
            title,
            hashtag, 
            blog_content,
            comment,
            user: req.user.id
        });

        const blog = await newBlog.save();

        res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route PUT api/blog/:id
//@desc Update Blog
//@access Private
router.put('/:id', auth,async(req, res) =>{
    const {title, hashtag, blog_content, comment} = req.body;

    //Build contact object
    const blogFields = {};
    if(title) blogFields.title = title;
    if(hashtag) blogFields.hashtag = hashtag;
    if(blog_content) blogFields.blog_content = blog_content;
    if(comment) blogFields.comment = comment;

    try {
        let blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({msg: 'Blog not Found'});
        //Make sure user owns blog
        if(blog.user.toString() !== req.user.id){
            return res.status(401).json({msg:'Not authorized'});
        }
        blog = await Blog.findByIdAndUpdate(req.params.id,
            {$set: blogFields },
            {new: true});

            res.json(blog);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route DELETE api/blog/:id
//@desc Delete Blog
//@access Private
router.delete('/:id',auth, async(req, res) =>{
    try {
        let blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({msg: 'Blog not Found'});
        //Make sure user owns blog
        if(blog.user.toString() !== req.user.id){
            return res.status(401).json({msg:'Not authorized'});
        }
        
        await Blog.findByIdAndRemove(req.params.id);

        res.json({msg:'Blog removed'});
    } catch (err) {
        console.error(er.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;