const express = require('express')
const Post = require('../../models/Post')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const cloudinary = require("cloudinary").v2;
require('../../config/cloudConfig')
const {CloudUpload} = require("../../config/CloudUpload")
const multer = require('multer')
const {
  check,
  validationResult
} = require('express-validator')
const router = express.Router()

const upload = multer({
  dest: "public",
    filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    }
})


//create a new post
router.post("/", [auth,upload.single('image')], async (req, res)=> {
  let errors=[]
 if (req.body.text.length<=0) errors.push({msg: ' Text is required'})
  if (errors.length>0) {
    return res.status(400).send({
      errors})
  }
  try {
    const user = await User.findById(req.user.id).select('-password')
      var allowedExt=["image/jpg","image/png","image/jpeg"]
    const [profile]= await Profile.find({user: req.user.id})
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: profile.avatar,
      user: req.user.id
    })
     if (req.file){
  if(allowedExt.includes(req.file.mimetype) && req.file.size <= 2000000){
    var result = await CloudUpload(req.file.path)
    newPost.image = result.url
  }
  else{
    errors.push({msg: "Please Upload an image file  under 2 MB only"})
    return res.status(400).send({
      errors})
  }
  }
    const post = await newPost.save()
    res.json(post)
  }
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
   })

//get all posts
router.get("/", auth, async (req, res)=> {
  try {
    const posts = await Post.find().sort({
      date: -1
    })
    res.json(posts)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

//get a single post
router.get("/:id", auth, async (req, res)=> {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        msg: 'Post not found!'
      })
    }
    res.json(post)
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found!'
      })
    }
    res.status(500).send('Server error')
  }
})

//delete a single post
router.delete("/:id", auth, async (req, res)=> {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        msg: 'Post not found!'
      })
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send({
        msg: 'Unauthorized user'
      })
    }
    await post.remove()
    res.json({
      msg: 'Post was removed'
    })
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post not found!'
      })
    }
    res.status(500).send('Server error')
  }
})

//like a post
router.put("/like/:id", auth, async(req, res)=> {
  try {
    const post = await Post.findById(req.params.id)
    if (post.likes.filter(like=>like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({
        msg: 'Post already liked'
      })
    }
    post.likes.unshift({
      user: req.user.id
    })
    await post.save()
    res.json(post.likes)
  }
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})
//unlike a post
router.put("/unlike/:id", auth, async(req, res)=> {
  try {
    const post = await Post.findById(req.params.id)
    if (post.likes.filter(like=>like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({
        msg: 'Post has not yet been liked'
      })
    }
    const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await post.save()
    res.json(post.likes)
  }
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

//comment on a post
router.post("/comment/:id", [auth,upload.single('image')], async (req, res)=> {
 let errors=[]
 if (req.body.text.length<=0) errors.push({msg: ' Text is required'})
  if (errors.length>0) {
    return res.status(400).send({
      errors})
  }
  try {
    const user = await User.findById(req.user.id).select('-password')
    var allowedExt=["image/jpg","image/png","image/jpeg"]
    const post = await Post.findById(req.params.id)
    const [profile]= await Profile.find({user: req.user.id})
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: profile.avatar,
      user: req.user.id
    }
     if (req.file){
  if(allowedExt.includes(req.file.mimetype) && req.file.size <= 2000000){
    var result = await CloudUpload(req.file.path)
    newComment.image = result.url
  }
  else{
    errors.push({msg: "Please Upload an image file  under 2 MB only"})
    return res.status(400).send({
      errors})
  }
  }
    post.comments.unshift(newComment)
    await post.save()
    res.json(post.comments)
  }
  catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

//delete comment
router.delete("/:id/:comment_id", auth, async (req, res)=> {
  try {
    const post = await Post.findById(req.params.id)
    const comment = post.comments.find(comment=>comment.id === req.params.comment_id)
    if (!comment) {
      return res.status(404).json({
        msg: 'Comment not found'
      })
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: 'Unauthorized user'
      })
    }
    const removeIndex = post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id)
    post.comments.splice(removeIndex, 1)
    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: ' not found!'
      })
    }
    res.status(500).send('Server error')
  }
})
module.exports = router