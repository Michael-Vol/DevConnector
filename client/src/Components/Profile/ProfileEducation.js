import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
const ProfileEducation = ({ education: { school, degree, fieldofstudy, current, to, from, description } }) => {
	return (
		<div>
			<h3 className='text-dark'>{school}</h3>
			<p>
				<Moment format='YYY/MM/DD'>
					{from} - {!to ? 'Now' : <Moment format='YYY/MM/DD'> {to} </Moment>}{' '}
				</Moment>
			</p>
			<p>
				<strong>Degree: </strong> {degree}
			</p>
			<p>
				<strong>Field Of Study: </strong> {fieldofstudy}
			</p>
			<p>
				<strong>Description: </strong> {description}
			</p>
		</div>
	);
};

ProfileEducation.propTypes = {
	education: PropTypes.array.isRequired,
};

export default ProfileEducation;
