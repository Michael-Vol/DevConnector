import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../Layout/Spinner';
import { getPost } from '../../Actions/post';
import PostItem from '../Posts/PostItem';
import { Link } from 'react-router-dom';

const Post = ({ getPost, post: { post, loading }, match }) => {
	useEffect(() => {
		getPost(match.params.id);
	}, [getPost]);
	return loading || post === null ? (
		<Spinner />
	) : (
		<Fragment>
			<Link to='/posts' className='btn'>
				Back To Posts
			</Link>
			<PostItem post={post} showActions={false}></PostItem>
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
