import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import print from 'print-js';
import './MonthlyInventoryReport.css';

export default function MonthlyInventoryReport() {
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

        // -- Get today --
        // const today = new Date();
        // const month = today.getMonth() + 1;
        // const year = today.getFullYear();
        // console.log(month, year)
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
            url: '/api/inventory-reports',
            data: {
                month,
                year,
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
        if (report) {
            const rows = report.reportDetails.map((reportDetail, index) => {
                return (
                    <tr>
                        <td>{(index + 1).toString().padStart(3, 0)}</td>
                        <td>{reportDetail.accessory.name}</td>
                        <td className="text-center">{reportDetail.openingStock}</td>
                        <td className="text-center">{reportDetail.arising }</td>
                        <td className="text-center">{ reportDetail.endingStock }</td>
                    </tr>
                )
            });
            return (
                <>
                    <hr className="hr--custom" />
                    <h5 className="text-center my-4">
                        Báo cáo tồn tháng { (new Date(report.reportDate)).getMonth() + 1 }
                    </h5>
                    <div className="list">
                        <table className="table">
                            <thead className="thead-dark sticky-top" style={{ zIndex: '0' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã phụ tùng</th>
                                    <th className="text-center">Tồn đầu</th>
                                    <th className="text-center">Phát sinh</th>
                                    <th className="text-center">Tồn cuối</th>
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
        const printData = report.reportDetails.map((detail, index) => {
            return {
                number: (index + 1).toString().padStart(3, 0),
                accessory_name: detail.accessory.name,
                openingStock: detail.openingStock,
                arising: detail.arising,
                endingStock: detail.endingStock
            }
        });
        const reportDate = new Date(report.reportDate);
        print({
            printable: printData,
            type: 'json',
            properties: [
              { field: 'number', displayName: 'STT'},
              { field: 'accessory_name', displayName: 'Tên phụ tùng'},
              { field: 'openingStock', displayName: 'Tồn đầu'},
              { field: 'arising', displayName: 'Phát sinh'},
              { field: 'endingStock', displayName: 'Tồn cuối'}
            ],
            header: `
              <h3 class="text-center">Báo cáo tồn kho tháng ${ reportDate.getMonth() + 1 } năm ${ reportDate.getFullYear() }</h3>
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
                    <h4 className="text-center mb-4">Lập báo cáo tồn tháng</h4>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <label className="mr-3" htmlFor>Tháng:</label>
                        <input type="text" className="form-control month-input mr-5" name="month" id="month" aria-describedby="helpId" placeholder />
                        <label className="mr-3" htmlFor>Năm:</label>
                        <input type="text" className="form-control year-input mr-5" name="year" id="year" aria-describedby="helpId" placeholder />
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Lập báo cáo ngay</button>
                    </div>
                    {displayReport()}
                </div>
                {displayLoading()}
            </div>
        </>
    )
}
