import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMyProfile } from '../../actions/profile';

const Dashboard = ({ getMyProfile, auth, profile }) => {
  useEffect(() => {
    getMyProfile();
  }, []);
  return <div>Dashboard</div>;
};

Dashboard.propTypes = {
  getMyProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getMyProfile })(Dashboard);
