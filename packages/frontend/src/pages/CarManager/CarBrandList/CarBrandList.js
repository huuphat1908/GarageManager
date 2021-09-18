import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './CarBrandList.css';
import axios from 'axios';

export default function CarBrandList() {
    // Loading screen state 
    const [loading, setLoading] = useState(true);
    // Others state
    const [carBrands, setCarBrands] = useState([]);
    const [editedCarBrandId, setEditedCarBrandId] = useState(null);
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
            url: `/api/car-brands/search${query}`
        })
            .then(response => {
                setCarBrands(response.data);

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
        return carBrands.map((carBrand, index) => {
            return (
                <tr>
                    <td>{(index + 1).toString().padStart(3, 0)}</td>
                    <td>{carBrand.name}</td>
                    <td className="text-center">
                        <button className="btn" onClick={event => hanldeClickDeleteButton(event, carBrand)}><i className="fas fa-trash text-danger"></i></button>
                        <button className="btn" onClick={event => handleClickEdit(event, carBrand)}><i className="fas fa-edit text-success"></i></button>
                    </td>
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
    const handleClickEdit = (event, carBrand) => {
        event.preventDefault();
        document.getElementById("name").value = carBrand.name;
        setEditedCarBrandId(carBrand._id);

        document.getElementById("submitBtn").innerText = "Chỉnh sửa";
    }

    // Function for handling click add button
    const handleClickSubmit = event => {
        event.preventDefault();
        const btn = document.getElementById("submitBtn");
        if (btn.innerText === "Thêm mới") {
            const newCarBrand = {
                name: document.getElementById("name").value
            };

            // Turn on loading screen
            setLoading(true);

            // Create new car brand by calling api
            axios({
                method: "POST",
                url: "/api/car-brands",
                data: newCarBrand
            })
                .then(response => {
                    alert("Thêm hiệu xe mới thành công!!!")
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
                name: document.getElementById("name").value
            };

            // Turn on loading screen
            setLoading(true);

            // Create new car brand by calling api
            axios({
                method: "PUT",
                url: `/api/car-brands/${editedCarBrandId}`,
                data: updateContent
            })
                .then(response => {
                    alert("Sửa đổi hiệu xe thành công!!!")
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

            // Set edited car brand id to null
            setEditedCarBrandId(null);
        }

        // Reset form
        document.getElementById("name").value = '';
    }

    // Function for handling click delete button
    const hanldeClickDeleteButton = (event, carBrand) => {
        event.preventDefault()
        if(window.confirm("Bạn có chắc muốn xóa loại hiệu xe này?")) {
            // Turn on loading screen
            setLoading(true);

            // Create new car brand by calling api
            axios({
                method: "Delete",
                url: `/api/car-brands/${carBrand._id}`
            })
                .then(response => {
                    alert(`Xóa hiệu xe ${carBrand.name} thành công!!!`)
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

    if(sessionStorage.getItem('role') !== 'Admin') {
        alert("Bạn không có quyền truy cập đường dẫn này");
        history.push('/');
    }


    return (
        <>
            <div className="container parent">
                {displayLoading()}
                <div className="box">
                    <h4 className="text-center mb-4">Thêm loại hiệu xe mới</h4>
                    <div className="row mx-0">
                        <div className="col-4">
                            <div className="form-group">
                                <label htmlFor="name">Tên hiệu xe</label>
                                <input type="text" className="form-control" name="name" id="name" aria-describedby="helpId" />
                            </div>
                        </div>
                        <div className="col-3">
                            <label className="d-block invisible">Thao tác</label>
                            <button type="submit" id="submitBtn" className="btn btn-success" onClick={handleClickSubmit}>Thêm mới</button>
                        </div>
                    </div>
                    <hr className="hr--custom" />
                    <div className="d-flex align-items-center">
                        <label className="mr-3" htmlFor>Tên hiệu xe:</label>
                        <input type="text" className="form-control search-input mr-5" name="searchInput" id="searchInput" aria-describedby="helpId" placeholder />
                        <button type="submit" className="btn btn-primary" onClick={handleSubmitSearch}>Tìm ngay</button>
                    </div>
                    <div className="list mt-4">
                        <table className="table">
                            <thead className="thead-dark sticky-top" style={{ zIndex: '0.5' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên hiệu xe</th>
                                    <th className="text-center">Thao tác</th>
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
