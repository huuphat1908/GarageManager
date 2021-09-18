import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ManagerList.css';
import axios from 'axios';

export default function ManagerList() {
    // Loading screen state 
    const [loading, setLoading] = useState(true);
    // Others state
    const [wages, setWages] = useState([]);
    const [editedWageId, setEditedWageId] = useState(null);
    // Other variables
    const history = useHistory();

    // Fetch data function
    const fetchData = name => {
        // Turn on loading screen
        setLoading(true);

        let query = '?';
        if (name)
            query += `name=${name}`;

        axios({
            method: "GET",
            url: `/api/wages/search${query}`
        })
            .then(response => {
                setWages(response.data);

                // Turn off loading screen
                setLoading(false);
            })
            .catch(error => {
                if (error.response && error.response.data)
                    alert("Lỗi: " + error.response.data.message);

                // Turn off loading screen
                setLoading(false);
            });
    }

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

    // Function for displaying rows of result table
    const displayResultTableRows = () => {
        return wages.map((wage, index) => {
            return (
                <tr>
                    <td>{(index + 1).toString().padStart(3, 0)}</td>
                    <td>{wage.name}</td>
                    <td className="text-center">{wage.price.toLocaleString("DE-de")}đ</td>
                    { displayMethodOnlyAdmin() }
                </tr>
            )
        })
    }

    // Function for handling click search button
    const handleSubmitSearch = event => {
        event.preventDefault();
        const searchInput = document.getElementById("searchInput").value;
        // Fetch new data based on name
        fetchData(searchInput);
    }

    // Function for handling click edit trigger button
    const handleClickEdit = (event, wage) => {
        event.preventDefault();
        document.getElementById("name").value = wage.name;
        document.getElementById("price").value = wage.price;
        setEditedWageId(wage._id);

        document.getElementById("submitBtn").innerText = "Chỉnh sửa";
    }

    // Function for handling click add button
    const handleClickSubmit = event => {
        event.preventDefault();
        const btn = document.getElementById("submitBtn");
        if (btn.innerText === "Thêm mới") {
            const newWage = {
                name: document.getElementById("name").value,
                price: document.getElementById("price").value,
                remaining: 0
            };

            // Turn on loading screen
            setLoading(true);

            // Create new wage by calling api
            axios({
                method: "POST",
                url: "/api/wages",
                data: newWage
            })
                .then(response => {
                    alert("Thêm loại tiền công mới thành công!!!")
                    fetchData();

                    // Turn off loading screen
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response && error.response.data)
                        alert("Lỗi: " + error.response.data.message);

                    // Turn off loading screen
                    setLoading(false);
                });
        } else {
            const updateContent = {
                name: document.getElementById("name").value,
                price: document.getElementById("price").value
            };

            // Turn on loading screen
            setLoading(true);

            // Create new wage by calling api
            axios({
                method: "PUT",
                url: `/api/wages/${editedWageId}`,
                data: updateContent
            })
                .then(response => {
                    alert("Sửa đổi tiền công thành công!!!")
                    fetchData();

                    // Turn off loading screen
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response && error.response.data)
                        alert("Lỗi: " + error.response.data.message);

                    // Turn off loading screen
                    setLoading(false);
                });

            // Change edit button to add button
            btn.innerText = "Thêm mới";

            // Set edited wage id to null
            setEditedWageId(null);
        }

        // Reset form
        document.getElementById("name").value = '';
        document.getElementById("price").value = '';
    }

    // Function for handling click delete button
    const hanldeClickDeleteButton = (event, wage) => {
        event.preventDefault()
        if(window.confirm("Bạn có chắc muốn xóa loại tiền công này?")) {
            // Turn on loading screen
            setLoading(true);

            // Create new wage by calling api
            axios({
                method: "Delete",
                url: `/api/wages/${wage._id}`
            })
                .then(response => {
                    alert(`Xóa tiền công ${wage.name} thành công!!!`)
                    fetchData();

                    // Turn off loading screen
                    setLoading(false);
                })
                .catch(error => {
                    if (error.response && error.response.data)
                        alert("Lỗi: " + error.response.data.message);

                    // Turn off loading screen
                    setLoading(false);
                });
        }
    }

    // Fetch data first time
    useEffect(() => {
        fetchData();
    }, []);

    
    // if(sessionStorage.getItem('role') !== 'Admin') {
    //     alert("Bạn không có quyền truy cập đường dẫn này");
    //     history.push('/');
    // } 
    
    const displayAddOnlyAdmin = () => {
        if(sessionStorage.getItem('role') === 'Admin') {
            return (
                <>
                    <div className="row mx-0">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="">Tên tiền công</label>
                                <input type="text" className="form-control" name="name" id="name" aria-describedby="helpId" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="price">Giá</label>
                                <input type="number" className="form-control" name="price" id="price" aria-describedby="helpId" />
                            </div>
                        </div>
                        <div className="col-3">
                            <label className="d-block invisible">Thao tác</label>
                            <button type="submit" id="submitBtn" className="btn btn-success" onClick={handleClickSubmit}>Thêm mới</button>
                        </div>
                    </div>
                    <hr className="hr--custom" />
                </>
            )
        }
    }

    const displayMethodOnlyAdmin = wage => {
        if(sessionStorage.getItem('role') === 'Admin') {
            return (
                <td className="text-center">
                    <button className="btn" onClick={event => hanldeClickDeleteButton(event, wage)}><i className="fas fa-trash text-danger"></i></button>
                    <button className="btn" onClick={event => handleClickEdit(event, wage)}><i className="fas fa-edit text-success"></i></button>
                </td>
            )
        }
    }

    const displayMethodTitleOnlyAdmin = () => {
        if(sessionStorage.getItem('role') === 'Admin') {
            return (
                <th className="text-center">Thao tác</th>
            )
        }
    }


    return (
        <>
            <div className="container parent">
                {displayLoading()}
                <div className="box">
                    <h4 className="text-center mb-4">Danh sách tiền công</h4>
                    { displayAddOnlyAdmin() }
                    <div className="d-flex align-items-center">
                        <label className="mr-3" htmlFor>Tên tiền công:</label>
                        <input type="text" className="form-control search-input mr-5" name="searchInput" id="searchInput" aria-describedby="helpId" placeholder />
                        <button type="submit" className="btn btn-primary" onClick={handleSubmitSearch}>Tìm ngay</button>
                    </div>
                    <div className="list mt-4">
                        <table className="table">
                            <thead className="thead-dark sticky-top" style={{ zIndex: '0.5' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên tiền công</th>
                                    <th className="text-center">Giá</th>
                                    { displayMethodTitleOnlyAdmin() }
                                </tr>
                            </thead>
                            <tbody>
                                {displayResultTableRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
