import React, { Fragment } from 'react';
import NavBar from './Components/Layout/Navbar';
import Landing from './Components/Layout/Landing';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './Components/auth/Register';
import Login from './Components/auth/Login';
import Alert from './Components/Layout/Alert';

//Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => (
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
					</Switch>
				</section>
			</Fragment>
		</Router>
	</Provider>
);

export default App;
