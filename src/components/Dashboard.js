import React from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveUser } from '../actions/loginActions';

import Profile from './Profile';
import Community from './Community';
import Account from './Account';

function checkSession() {
  return axios.get('/api/user').then(response => {
    return response.data;
  }).catch(err => console.log(err));
}

class Dashboard extends React.Component {
  componentDidMount() {
    checkSession().then(user => {
      if (user !== '') {
        this.props.saveUser(user);
      } else {
        this.props.history.push('/');
      }
    });
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <Route exact path={`${this.props.match.url}/`} component={Profile}/>
        <Route exact path={`${this.props.match.url}/community`} component={Community}/>
        <Route exact path={`${this.props.match.url}/account`} component={Account}/>
      </div>
    );
  }
};

export default connect(null, { saveUser })(Dashboard);
