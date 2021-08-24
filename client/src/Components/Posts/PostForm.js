import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addPost } from '../../Actions/post';
import { connect } from 'react-redux';

const PostForm = ({ addPost }) => {
	const [text, setText] = useState('');
	return (
		<div class='post-form'>
			<div class='bg-primary p'>
				<h3>Leave A Comment</h3>
			</div>
			<form class='form my-1'>
				<textarea
					name='text'
					value={text}
					onChange={(e) => setText(e.target.value)}
					onSubmit={(e) => {
						e.preventDefault();
						addPost({ text });
						setText('');
					}}
					cols='30'
					rows='5'
					placeholder='Comment on this post'
					required></textarea>
				<input type='submit' class='btn btn-dark my-1' value='Submit' />
			</form>
		</div>
	);
};

PostForm.propTypes = {
	addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
