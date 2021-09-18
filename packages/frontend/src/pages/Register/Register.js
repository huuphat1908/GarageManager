import React from 'react'
import './Register.css';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/index'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

function Register(props) {
  let history = useHistory();

  const register = (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    if(passwordInput.value !== confirmPasswordInput.value) {
        alert("Mật khẩu bạn nhập không khớp nhau!!!");
        return;
    }

    if(nameInput.value.length < 7) {
        alert("Tên tài khoản phải có ít nhất 7 kí tự");
        return
    }

    if(passwordInput.value.length < 7) {
        alert("Mật khẩu phải có ít nhất 7 kí tự");
        return
    }

    let user = {
      name: nameInput.value,
      password: passwordInput.value
    };

    axios({
      method: 'POST',
      url: '/api/accounts',
      data: user,
    //   headers: {"Access-Control-Allow-Origin": "*"}
    })
      .then(response => {
        alert("Đăng kí thành công!!! Bạn có thể đăng nhập ngay bây giờ bằng tài khoản này!!!");
        history.push('/');
      })
      .catch( error => {
        if(error.response && error.response.data) 
          alert("Lỗi: " + error.response.data.message);
      })
  }


  return (
    <div className="register__panel">
      <div className="register__box shadow rounded p-4">
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
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input type="password" id="confirmPassword" className="form-control" />
          </div>
          <button type="submit" className="btn btn-success w-100 my-3" onClick={register}>Đăng kí ngay</button>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);