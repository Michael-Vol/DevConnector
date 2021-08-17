import React, { Fragment } from 'react';
import NavBar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
const App = () => (
	<Router>
		<Fragment>
			<NavBar />
			<Route exact path='/' component={Landing} />
			<section className='container'>
				<Switch>
					<Route exact path='/register' component={Register} />
					<Route exact path='/login' component={Login} />
				</Switch>
			</section>
		</Fragment>
	</Router>
);

export default App;
