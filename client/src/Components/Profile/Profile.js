import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
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

						<div className='profile-grid my-1'>
							<ProfileTop profile={profile} />
							<ProfileAbout profile={profile} />
							<div className='profile-exp bg-white p-2'>
								<h2 className='text-primary'>Experience</h2>
								{profile.experience.length > 0 ? (
									<Fragment>
										{profile.experience.map((experience) => (
											<ProfileExperience key={experience._id} experience={experience} />
										))}
									</Fragment>
								) : (
									<h4>No Experience Credentials</h4>
								)}
							</div>
							<div className='profile-edu bg-white p-2'>
								<h2 className='text-primary'>Education</h2>
								{profile.education.length > 0 ? (
									<Fragment>
										{profile.education.map((education) => (
											<ProfileEducation key={education._id} education={education} />
										))}
									</Fragment>
								) : (
									<h4>No Education Credentials</h4>
								)}
							</div>
							{profile.githubusername && <ProfileGithub username={profile.githubusername} />}
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
