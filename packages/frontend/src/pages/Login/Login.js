import React from 'react'
import './Login.css';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios';

function Login(props) {
  let history = useHistory();

  const login = (event) => {
    event.preventDefault();

    let user = {
      name: document.getElementById("username").value,
      password: document.getElementById("password").value
    };

    axios({
      method: 'POST',
      url: '/api/accounts/login',
      data: user,
      headers: {"Access-Control-Allow-Origin": "*"}
    })
      .then(response => {
        axios({
          method: 'POST',
          url: '/api/accounts/role',
          headers: {"Access-Control-Allow-Origin": "*"}
        })
          .then(res => {
            const role = res.data.role;
            sessionStorage.setItem("username", document.getElementById("username").value);
            props.setLogin(role);
            history.push("/quan-ly-xe/tiep-nhan-xe")
          })
          .catch( error => {
            if(error.response && error.response.data) 
              alert("Lỗi: " + error.response.data.message);
          })
      })
      .catch( error => {
        if(error.response && error.response.data) 
          alert("Lỗi: " + error.response.data.message);
      })
  }


  return (
    <div className="login__panel">
      <div className="login__box shadow rounded p-4">
        <h2 className="text-center">Đăng nhập</h2>
        <form>
          <div className="form-group">
            <label>Tên tài khoản</label>
            <input type="text" className="form-control" id="username" aria-describedby="helpId" />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" id="password" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success w-100 my-3" onClick={login}>Đăng nhập</button>
        </form>
        <p className="text-center">Chưa có tài khoản? <Link to="/dang-ki">Đăng kí ngay</Link></p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    authorization: state.authorization
  }
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setLogin: (role) => {
      dispatch(actions.setLogin(role))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);