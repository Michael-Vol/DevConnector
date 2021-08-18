import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../Actions/profile';

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);

	return <div>Dashboard</div>;
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
