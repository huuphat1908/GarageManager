import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ChangePassword() {
    // Loading screen state 
    const [loading, setLoading] = useState(false);


    // Function for displaying loading screen function
    const displayLoading = () => {
        if (loading) {
            return (
                <div className="container loading" style={{ zIndex: 100000 }}>
                    <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="spinner-grow text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
    };


    // Function for handling change password submit
    const changePassword = event => {
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmedPassword = document.getElementById("confirmedPassword").value;

        if(newPassword !== confirmedPassword) {
            alert("Mật khẩu bạn nhập không khớp nhau!!!");
            return
        }

        if(newPassword.length < 7) {
            alert("Mật khẩu phải có ít nhất 7 kí tự!!!");
            return
        }

        // GET user id
        axios({
            method: "GET",
            url: `/api/accounts`
        })
            .then(response => {
                const { userId } = response.data;

                // Change password by calling API
                axios({
                    method: "PUT",
                    url: `/api/accounts/change-password`,
                    data: {
                        id: userId,
                        oldPassword,
                        newPassword
                    }
                })
                    .then(response => {
                        alert("Thay đổi mật khẩu thành công!!!");
                        
                        // Turn off loading screen
                        setLoading(false);
                    })
                    .catch(error => {
                        if (error.response && error.response.data)
                            alert("Lỗi: " + error.response.data.message);
        
                        // Turn off loading screen
                        setLoading(false);
                    });
            })
            .catch(error => {
                if (error.response && error.response.data)
                    alert("Lỗi: " + error.response.data.message);

                // Turn off loading screen
                setLoading(false);
            });
    }


    return (
        <>
            <div className="container parent">
                { displayLoading() }
                <div className="box">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="w-25">
                            <h4 className="mb-4">Thay đổi mật khẩu</h4>
                            <div className="form-group">
                                <label htmlFor>Mật khẩu cũ</label>
                                <input type="password" className="form-control" id="oldPassword" aria-describedby="helpId" placeholder />
                            </div>
                            <div className="form-group">
                                <label htmlFor>Mật khẩu mới</label>
                                <input type="password" className="form-control" id="newPassword" aria-describedby="helpId" placeholder />
                            </div>
                            <div className="form-group">
                                <label htmlFor>Xác nhận mật khẩu mới</label>
                                <input type="password" className="form-control" id="confirmedPassword" aria-describedby="helpId" placeholder />
                            </div>
                            <button type="submit" className="btn btn-success w-100" onClick={changePassword}>Đổi mật khẩu</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
