import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import print from 'print-js';
import './MonthlySalesReport.css';

export default function MonthlySalesReport() {
    // Loading screen state
    const [loading, setLoading] = useState(false);
    // Other state
    const [report, setReport] = useState(null);
    // Other variable
    const history = useHistory();

    const handleSubmit = event => {
        event.preventDefault();
        // -- Turn on loading screen --
        setLoading(true);
        
        const month = document.getElementById("month").value;
        const year = document.getElementById("year").value;

        if(!month) {
            alert("Bạn chưa nhập tháng!!!");
            // -- Turn off loading screen --
            setLoading(false);
            return;
        }

        if(!year) {
            alert("Bạn chưa nhập năm!!!");
            // -- Turn off loading screen --
            setLoading(false);
            return;
        }

        if(Number(month) < 1 || Number(month) > 12) {
            alert("Tháng nhập vào không hợp lệ!!!");
            // -- Turn off loading screen --
            setLoading(false);
            return;
        }

        if(Number(year) < 0) {
            alert("Năm nhập vào không hợp lệ!!!");
            // -- Turn off loading screen --
            setLoading(false);
            return;
        }

        // -- Create report --
        axios({
            method: 'POST',
            url: '/api/sales',
            data: {
                month: month,
                year: year
            }
        })
            .then(response => {
                setReport(response.data);

                // -- Turn off loading screen --
                setLoading(false);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    if(error.response.status === 400)
                        alert(error.response.data.message);
                    else
                        alert("Lỗi: " + error.response.data.message);
                }
                
                // -- Turn off loading screen --
                setLoading(false);
            })
    }

    const displayLoading = () => {
        if (loading) {
          return (
            <div className="container loading">
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

    const displayReport = () => {
        if(report) {
            const rows = report.saleDetails.map((saleDetail, index) => {
                return (
                    <tr>
                        <td>{ (index + 1).toString().padStart(2, 0) }</td>
                        <td>{ saleDetail.carBrand.name }</td>
                        <td className="text-center">{ saleDetail.numberOfRepairs }</td>
                        <td className="text-center">{ saleDetail.totalSale.toLocaleString("DE-de") }</td>
                        <td className="text-center">{ (saleDetail.ratio * 100).toFixed(2) }%</td>
                    </tr>
                )
            });
            return (
                <>
                    <hr className="hr--custom" />
                    <h5 className="text-center mt-4">
                        Báo cáo doanh thu tháng { (new Date(report.reportDate)).getMonth() + 1 }
                    </h5>
                    <p className="text-center mt-3">Doanh thu: <strong>{ report.totalSale.toLocaleString("DE-de") }đ</strong></p>
                    <div className="list">
                        <table className="table">
                            <thead className="thead-dark sticky-top" style={{ zIndex: '0' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Hiệu xe</th>
                                    <th className="text-center">Số lượt sửa</th>
                                    <th className="text-center">Thành tiền</th>
                                    <th className="text-center">Tỷ lệ</th>
                                </tr>
                            </thead>
                            <tbody>
                                { rows }
                            </tbody>
                        </table>
                    </div>
                    <div className="text-right mt-5">
                        <button className="btn btn-success" onClick={handlePrintReport}>In báo cáo doanh thu</button>
                    </div>
                </>
            )
        }
    }


    const handlePrintReport = event => {
        event.preventDefault();
        const printData = report.saleDetails.map((detail, index) => {
            return {
                number: (index + 1).toString().padStart(3, 0),
                carBrand_name: detail.carBrand.name,
                numberOfRepairs: detail.numberOfRepairs,
                totalSale: detail.totalSale.toLocaleString("DE-de"),
                ratio: (detail.ratio * 100).toFixed(2) + '%'
            }
        });
        const reportDate = new Date(report.reportDate);
        print({
            printable: printData,
            type: 'json',
            properties: [
              { field: 'number', displayName: 'STT'},
              { field: 'carBrand_name', displayName: 'Hiệu xe'},
              { field: 'numberOfRepairs', displayName: 'Số lượng sửa'},
              { field: 'totalSale', displayName: 'Thành tiền'},
              { field: 'ratio', displayName: 'Tỷ lệ'}
            ],
            header: `
              <h3 class="text-center">Báo cáo doanh thu tháng ${ reportDate.getMonth() + 1 } năm ${ reportDate.getFullYear() }</h3>
            `,
            style: '.text-center { text-align: center; }'
        });
    }

    
    if(sessionStorage.getItem('role') !== 'Admin') {
        alert("Bạn không có quyền truy cập đường dẫn này");
        history.push('/');
    } 

    return (
        <>
            <div className="container parent">
                <div className="box">
                    <h4 className="text-center mb-4">Lập báo cáo doanh thu tháng</h4>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <label className="mr-3" htmlFor>Tháng:</label>
                        <input type="text" className="form-control month-input mr-5" name="month" id="month" aria-describedby="helpId" placeholder />
                        <label className="mr-3" htmlFor>Năm:</label>
                        <input type="text" className="form-control year-input mr-5" name="year" id="year" aria-describedby="helpId" placeholder />
                        <button type="submit" className="btn btn-primary" onClick={ handleSubmit }>Lập báo cáo doanh thu</button>
                    </div>
                    { displayReport() }
                </div>
                { displayLoading() }
            </div>
        </>
    )
}
