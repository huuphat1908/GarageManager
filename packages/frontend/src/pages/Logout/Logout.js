import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'

function Logout(props) {
    const history = useHistory();
    axios({
        method: 'GET',
        url: "/api/accounts/log-out",
    }).then(response => {
        props.logout();
        history.push('/');
    })
    return (
        <>  
        </>
    )
}

const mapStateToProps = (state) => {
    return {
      authorization: state.authorization
    }
  };
  
  const mapDispatchToProps = (dispatch, props) => {
    return {
      logout: () => {
        dispatch(actions.logout())
      }
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Logout);