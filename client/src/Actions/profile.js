import { GET_PROFILE, PROFILE_ERROR } from './types';
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
			console.log(formData);
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

export default createProfile;
