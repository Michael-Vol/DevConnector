const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

//@route POST api/users
//@desc Register User
//@access Public
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({
				errors: errors.array(),
			});
		}

		const { name, email, password } = req.body;

		try {
			//See if user exist
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					errors: [{ msg: 'User already exists' }],
				});
			}

			//Get users gravatar
			const avatar = gravatar.url(email, {
				s: 200,
				r: 'pg',
				d: 'mm',
			});

			//Encrypt password
			const salt = await bcrypt.genSalt(10);

			user = new User({
				name,
				email,
				avatar,
				password,
			});
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			//Return json web token
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 3600000,
				},
				(error, token) => {
					if (error) {
						throw error;
					}
					res.json({ token });
				}
			);
		} catch (error) {
			console.error(error);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
