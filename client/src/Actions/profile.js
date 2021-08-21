import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILES, GET_REPOS } from './types';
import setAlert from './alert';
import axios from 'axios';
//Get current users profile

export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/profile/me');
		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Create or update a profile

export const createProfile =
	(formData, history, edit = false) =>
	async (dispatch) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const res = await axios.post('/api/profile', formData, config);

			dispatch({
				type: GET_PROFILE,
				payload: res.data,
			});
			dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Updated', 'success'));

			if (!edit) {
				history.push('/dashboard');
			}
		} catch (error) {
			console.log(error);
			const errors = error.response.data.errors;

			if (errors) {
				errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: error.response.statusText, status: error.response.status },
			});
		}
	};

//Add Experience

export const addExperience = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.put('/api/profile/experience', formData, config);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert('Experience Added', 'success'));

		history.push('/dashboard');
	} catch (error) {
		if (error.response) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: error.response.statusText, status: error.response.status },
			});
		}
	}
};
//Add Experience

export const addEducation = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.put('/api/profile/education', formData, config);
		console.log(res.data);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});
		dispatch(setAlert('Education Added', 'success'));

		history.push('/dashboard');
	} catch (error) {
		if (error.response) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: error.response.statusText, status: error.response.status },
			});
		}
	}
};

//Delete Experiene
export const deleteExperience = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`);

		dispatch({
			type: 'UPDATE_PROFILE',
			payload: res.data,
		});

		dispatch(setAlert('Experience Removed', 'success'));
	} catch (error) {
		console.log(error);
		if (error.response) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: error.response.statusText, status: error.response.status },
			});
		}
	}
};
//Delete Education
export const deleteEducation = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`);

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		});

		dispatch(setAlert('Education Removed', 'success'));
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status },
		});
	}
};
//Delete Account
export const deleteAccount = () => async (dispatch) => {
	if (window.confirm('Are you sure? This can not be undone!')) {
		try {
			await axios.delete(`/api/profile/`);

			dispatch({
				type: CLEAR_PROFILE,
			});
			dispatch({
				type: ACCOUNT_DELETED,
			});
			dispatch(setAlert('Your account has been permanently delted'));
		} catch (error) {
			console.log(error);

			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: error.response.statusText, status: error.response.status },
			});
		}
	}
};

//Get all profiles

export const getAllProfiles = () => async (dispatch) => {
	dispatch({ type: CLEAR_PROFILE });
	try {
		const res = await axios.get('/api/profile');

		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};

//Get  profile by ID

export const getProfileByID = (userId) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/profile/user/${userId}`);
		console.log(res.data);
		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};
//Get  Github Repos

export const getGithubRepos = (username) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/github/${username}`);

		dispatch({
			type: GET_REPOS,
			payload: res.data,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: error.response.statusText,
				status: error.response.status,
			},
		});
	}
};
