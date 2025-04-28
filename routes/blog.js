const express = require('express');
const multer = require('multer');
const router = express.Router();
const Blog = require('../models/Blog');

// to upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// create 
router.post('/add', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file?.filename;

  if (!title || !description || !image) {
    return res.status(400).json({ msg: 'Required' });
  }

  const blog = new Blog({ title, description, image });
  await blog.save();
  res.redirect('/');
});

// all blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

// read single blog
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

// update
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  let updateData = { title, description };

  if (req.file) updateData.image = req.file.filename;

  await Blog.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/');
});

// delete
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted successfully' });
});

module.exports = router;
