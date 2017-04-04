import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';

import UserCard from './Community/UserCard';


class Community extends React.Component {
  render() {
    const { screen } = this.props;
    const CommunityWrapper = screen.isMobile ?
    styled.div`
    padding: 0 12vw 5vh 12vw;
    .fa-free-code-camp {
      margin-right: 5px;
    }
    ` :
    styled.div`
    padding: 0 3vw 5vh 3vw;
    .fa-free-code-camp {
      margin-right: 5px;
    }
    `;
    return (
      <CommunityWrapper>
        <div
          className={`ui ${screen.isMobile ?
            'stackable' : screen.isTablet ?
            'three' :
            'five'} cards`}>
          {this.props.users.map(user => {
            return (
              <UserCard history={this.props.history} key={user._id} user={user} />
            );
          })}
        </div>
      </CommunityWrapper>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    users: state.community
  }
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps)(Community));
