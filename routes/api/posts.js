const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
//@route Post api/posts/
//@desc Create a post
//@access Private
router.post('/', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		const user = await User.findById(req.user.id).select('-password');

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});

		const post = await newPost.save();
		res.json(post);
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

/**
 * @name GET api/posts
 * @desc Get all posts
 * @access private
 */

router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({
			date: '-1',
		});

		res.json(posts);
	} catch (error) {
		console.error(error.name);
		res.status(500).send('Server Error');
	}
});

/**
 * @name GET api/posts/{post_id}
 * @desc Get post by ID
 * @access private
 */

router.get('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id).sort({
			date: '-1',
		});
		if (!post) {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}

		res.json(post);
	} catch (error) {
		console.error(error.name);
		if (error.name === 'CastError') {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}
		res.status(500).send('Server Error');
	}
});

/**
 * @name DELETE api/posts/{post_id}
 * @desc Delete post by ID
 * @access private
 */

router.delete('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if (!post) {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}

		//Check if user has created the post
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({
				message: 'User not authorized.',
			});
		}
		await post.remove();
		res.json({
			message: 'Post removed',
		});
	} catch (error) {
		console.error(error.name);
		if (error.name === 'CastError') {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}
		res.status(500).send('Server Error');
	}
});

/**
 * @name PUT /posts/like/:id
 * @desc Like a posts
 * @access Private
 */

router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//Check if post has already been liked

		if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({
				message: 'Post already liked',
			});
		}
		post.likes.unshift({
			user: req.user.id,
		});

		await post.save();

		res.json({ likes: post.likes });
	} catch (error) {
		console.error(error.name);
		if (error.name === 'CastError') {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}
		res.status(500).send('Server Error');
	}
});

/**
 * @name PUT /posts/unlike/:id
 * @desc Like a posts
 * @access Private
 */

router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		//Check if post has already been liked

		if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
			return res.status(400).json({
				message: 'Post has not yet been liked',
			});
		}

		//Get remove index
		const removeIndex = post.likes.map((like) => like.user.toString().indexOf(req.user.id));

		post.likes.splice(removeIndex, 1);
		await post.save();

		res.json({ likes: post.likes });
	} catch (error) {
		console.error(error);
		if (error.name === 'CastError') {
			return res.status(404).json({
				message: 'Post not found.',
			});
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
