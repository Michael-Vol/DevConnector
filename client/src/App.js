import React, { Fragment, useEffect } from 'react';
import NavBar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import Alert from './Components/Layout/Alert';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateProfile from './Components/Profile-Form/CreateProfile';
import EditProfile from './Components/Profile-Form/EditProfile';
import PrivateRoute from './Components/Routing/PrivateRoute';
import AddExperience from './Components/Profile-Form/AddExperience';
import AddEducation from './Components/Profile-Form/AddEducation';
import Profiles from './Components/Profiles/Profiles';
import { loadUser } from './Actions/auth';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './Utils/setAuthToken';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}
const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<NavBar />
					<Route exact path='/' component={Landing} />
					<section className='container'>
						<Alert />
						<Switch>
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/profiles' component={Profiles} />
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
							<PrivateRoute exact path='/create-profile' component={CreateProfile} />
							<PrivateRoute exact path='/edit-profile' component={EditProfile} />
							<PrivateRoute exact path='/add-experience' component={AddExperience} />
							<PrivateRoute exact path='/add-education' component={AddEducation} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
