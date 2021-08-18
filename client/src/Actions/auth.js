import axios from 'axios';

import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from './types';
import setAuthToken from '../Utils/setAuthToken';
import setAlert from './alert';
//Load User

export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}
	try {
		const res = await axios.get('/api/auth');
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (error) {
		console.error(error, localStorage.token);
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

//Register User

const register =
	({ name, email, password }) =>
	async (dispatch) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ name, email, password });

		try {
			const res = await axios.post('/api/users', body, config);
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data,
			});
		} catch (error) {
			console.log(error);
			const errors = error.response.data.errors;
			errors.forEach((error) => {
				dispatch(setAlert(error.msg, 'danger'));
			});
			dispatch({
				type: REGISTER_FAIL,
			});
		}
	};

export default register;
