import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import Spinner from '../Layout/Spinner';
import { getProfileByID } from '../../Actions/profile';

const Profile = ({ getProfileByID, profile: { profile }, auth, match }) => {
	useEffect(() => {
		getProfileByID(match.params.id);
		console.log(profile);
	}, [getProfileByID, match.params.id]);
	return (
		<div>
			<Fragment>
				{profile === null ? (
					<Spinner />
				) : (
					<Fragment>
						<Link to='/profiles' className='btn btn-light'>
							Back to Profiles
						</Link>

						<div class='profile-grid my-1'>
							<ProfileTop profile={profile} />
							<ProfileAbout profile={profile} />
						</div>
					</Fragment>
				)}
			</Fragment>
		</div>
	);
};

Profile.propTypes = {
	profile: PropTypes.object.isRequired,
	getProfileByID: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getProfileByID })(Profile);
