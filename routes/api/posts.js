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

module.exports = router;
