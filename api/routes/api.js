const express = require('express');
const router = express.Router();
const path = require('path');
const Post = require('../models/Post');
const authMiddleware = require('../middlewares/auth');

// routes: 
router.get('/', (req, res) => {
  res.sendFile(path.resolve('./pages/index.html'));
}); 

router.get('/home', (req,res) => {
  res.send("HOME");
});

// see all posts
router.get('/posts', authMiddleware,  async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch(err) {
    res.json({message: err});
  }
})

// create new post
router.post('/posts', (req, res) => {
  console.log(req.body);

  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
  });

  post.save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
}); 

// get specific post
router.get('/posts/:postId', async (req, res) => {
  console.log(req.params.postId);
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch(err) {
    res.json({message: err});
  }
});

// delete post 
router.get('/posts/:postId/delete', async (req, res) => {
  console.log(req.params.postId);
  try {
    const removed = await Post.remove({_id: req.params.postId});
    res.json(removed);
  } catch(err) {
    res.json({message: err});
  }
});

// update post 
router.post('/posts/:postId/update', async (req, res) => {
  console.log(req.params.postId);
  try {
    const updated = await Post.updateOne(
      {_id: req.params.postId}, 
      { $set: {title: req.body.title, description: req.body.description, content: req.body.content} 
    });

    res.json(updated);
  } catch (err) {
    res.json({message: err});
  }
});

// auth 
router.post('/api/login', (req, res) => {
  jwt.sign();
});

module.exports = router;