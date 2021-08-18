const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');
const router = express.Router();

//@route GET api/profile/me
//@desc Get current user's profile
//@access Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar']);
		if (!profile) {
			return res.status(400).json({
				msg: 'There is no profile for this user',
			});
		}

		res.json({ profile });
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

//@route POST api/profile
//@desc Create or Update a User Profile
//@access Private

router.post(
	'/',
	[auth, check('status', 'Status is Required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}

		const profileFields = {};
		profileFields.user = req.user.id;

		const standarFields = ['handle', 'company', 'location', 'bio', 'status', 'githubUsername'];
		const socialFields = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];

		standarFields.forEach((field) => {
			if (req.body[field]) profileFields[field] = req.body[field];
		});
		profileFields.social = {};
		socialFields.forEach((field) => {
			if (req.body[field]) {
				profileFields.social[field] = req.body[field];
			}
		});

		try {
			let profile = await Profile.findOne({
				user: req.user.id,
			});

			if (profile) {
				//Update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{
						$set: profileFields,
					},
					{
						new: true,
					}
				);

				return res.json(profile);
			}
			//Create
			profile = new Profile(profileFields);
			await profile.save();
			return res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send('Server Error');
		}
	}
);

//@route Get api/profile
//@desc Get all profiles
//@access Public

router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server Error');
	}
});

//@route Get api/profile/user/:user_id
//@desc Get profile by user_id
//@access Public

router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({
				msg: 'Profile not found.',
			});
		}

		res.json(profile);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res.status(400).json({
				msg: 'Profile not found',
			});
		}
		res.status(500).send('Server Error');
	}
});

//@route Delete api/profile
//@desc Delete profile,user & posts
//@access Public

router.delete('/', auth, async (req, res) => {
	try {
		//@todo - remove users posts
		//Remove Profile
		await Profile.findOneAndRemove({
			user: req.user.id,
		});

		await User.findOneAndRemove({
			_id: req.user.id,
		});
		res.json({
			msg: 'User deleted',
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Server Error');
	}
});

// @route Put api/profile/education
// @desc Add Profile Education
// @access Private

router.put(
	'/experience',
	[
		auth,
		check('title', 'Title is required').not().isEmpty(),
		check('company', 'Company is required').not().isEmpty(),
		check('from', 'from date is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		const { title, company, location, from, to, current, description } = req.body;
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newExp);
			await profile.save();

			res.json(profile);
		} catch (error) {
			console.error(error);
			res.status(500).send('Server Error');
		}
	}
);

//@route Delete api/profile/experience/:exp_id
//@desc Delete experience from profile
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		});
		const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error);
	}
});

//@route Put api/profile/experience
//@desc Add Profile Experience
//@access Private

router.put(
	'/education',
	[
		auth,
		check('school', 'School is required').not().isEmpty(),
		check('degree', 'Degree is required').not().isEmpty(),
		check('fieldofstudy', 'Field of Study date is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		const { school, degree, fieldofstudy, from, to, current, description } = req.body;
		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.education.unshift(newEdu);
			await profile.save();

			res.json(profile);
		} catch (error) {
			console.error(error);
			res.status(500).send('Server Error');
		}
	}
);

//@route Delete api/profile/education/:edu_id
//@desc Delete education from profile
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		});
		const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error);
	}
});

/**
 * @route GET api/profile/github/:username
 * @desc Get user repos from github
 * @access public
 */

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) {
				console.error(error);
			}

			if (response.statusCode != 200) {
				return res.status(404).json({
					message: 'No Github Profile Found',
				});
			}

			res.json(JSON.parse(body));
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
