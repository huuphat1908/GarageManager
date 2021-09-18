import React from 'react';
import Images from './404.jpg'

export default function NotFound() {
    return (
        <>
            <div className="container">
                <div className="box">
                    <h4 className="text-center">404 Not Found</h4>
                    <p className="text-center">Trang bạn yêu cầu không tồn tại</p>
                    <img className="d-block mx-auto" src={Images} style={{maxWidth: "250px"}} />
                </div>
            </div>
        </>
    )
}
