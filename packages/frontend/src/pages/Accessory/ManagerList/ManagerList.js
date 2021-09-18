import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './ManagerList.css';
import axios from 'axios';

export default function ManagerList() {
    // Loading screen state 
    const [loading, setLoading] = useState(true);
    // Others state
    const [accessories, setAccessories] = useState([]);
    const [editedAccessoryId, setEditedAccessoryId] = useState(null);
    // Other variables
    const history = useHistory();

    // Fetch data function
    const fetchData = name => {
        // Turn on loading screen
        setLoading(true);

        let query = '?';
        if (name)
            query += `name=${name}`;

        console.log(query)

        axios({
            method: "GET",
            url: `/api/accessories/search${query}`
        })
            .then(response => {
                setAccessories(response.data);

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
                <div className="container loading" style={{ zIndex: 0 }}>
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
        return accessories.map((accessory, index) => {
            return (
                <tr>
                    <td>{(index + 1).toString().padStart(3, 0)}</td>
                    <td>{accessory.name}</td>
                    <td className="text-center">{accessory.unitPrice.toLocaleString("DE-de")}đ</td>
                    <td className="text-center">{accessory.remaining }</td>
                    { displayMethodOnlyAdmin(accessory) }
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
    const handleClickEdit = (event, accessory) => {
        event.preventDefault();
        document.getElementById("name").value = accessory.name;
        document.getElementById("unitPrice").value = accessory.unitPrice;
        setEditedAccessoryId(accessory._id);

        document.getElementById("submitBtn").innerText = "Chỉnh sửa";
    }

    // Function for handling click add button
    const handleClickSubmit = event => {
        event.preventDefault();
        const nameInput = document.getElementById("name");
        const unitPriceInput = document.getElementById("unitPrice");

        const btn = document.getElementById("submitBtn");
        if (btn.innerText === "Thêm mới") {
            // Check name is empty or not
            if(!nameInput.value) {
                alert("Bạn chưa nhập tên phụ tùng!");
                return;
            }

            // Check unit price is empty or not
            if(!unitPriceInput.value) {
                alert("Bạn chưa nhập đơn giá phụ tùng!")
                return;
            }

            const newAccessory = {
                name: nameInput.value,
                unitPrice: unitPriceInput.value,
                remaining: 0
            };

            // Turn on loading screen
            setLoading(true);

            // Create new accessory by calling api
            axios({
                method: "POST",
                url: "/api/accessories",
                data: newAccessory
            })
                .then(response => {
                    alert("Thêm loại phụ tùng mới thành công!!!")
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
                name: nameInput.value,
                unitPrice: unitPriceInput.value,
            };

            // Turn on loading screen
            setLoading(true);

            // Create new accessory by calling api
            axios({
                method: "PUT",
                url: `/api/accessories/${editedAccessoryId}`,
                data: updateContent
            })
                .then(response => {
                    alert("Sửa đổi phụ tùng thành công!!!")
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

            // Set edited accessory id to null
            setEditedAccessoryId(null);

            // Reset form
            nameInput.value = '';
            unitPriceInput.value = '';
        }
    }

    // Function for handling click delete button
    const hanldeClickDeleteButton = (event, accessory) => {
        event.preventDefault()
        if(window.confirm("Bạn có chắc muốn xóa loại phụ tùng này?")) {
            // Turn on loading screen
            setLoading(true);

            // Create new accessory by calling api
            axios({
                method: "Delete",
                url: `/api/accessories/${accessory._id}`
            })
                .then(response => {
                    alert(`Xóa phụ tùng ${accessory.name} thành công!!!`)
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

    const displayAddOnlyAdmin = () => {
        if(sessionStorage.getItem('role') === 'Admin') {
            return (
                <>
                    <div className="row mx-0">
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="">Tên phụ tùng</label>
                                <input type="text" className="form-control" name="name" id="name" aria-describedby="helpId" />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="unitPrice">Đơn giá</label>
                                <input type="number" className="form-control" name="unitPrice" id="unitPrice" aria-describedby="helpId" />
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

    const displayMethodOnlyAdmin = accessory => {
        if(sessionStorage.getItem('role') === 'Admin') {
            return (
                <td className="text-center">
                    <button className="btn" onClick={event => hanldeClickDeleteButton(event, accessory)}><i className="fas fa-trash text-danger" aria-hidden="true" /></button>
                    <button className="btn" onClick={event => handleClickEdit(event, accessory)}><i className="fas fa-edit text-success"></i></button>
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


    // if(sessionStorage.getItem('role') !== 'Admin') {
    //     alert("Bạn không có quyền truy cập đường dẫn này");
    //     history.push('/');
    // } 

    return (
        <>
            <div className="container parent">
                {displayLoading()}
                <div className="box">
                    <h4 className="text-center mb-4">Danh sách phụ tùng</h4>
                    { displayAddOnlyAdmin() }
                    <div className="d-flex align-items-center">
                        <label className="mr-3" htmlFor>Tên phụ tùng:</label>
                        <input type="text" className="form-control search-input mr-5" name="searchInput" id="searchInput" aria-describedby="helpId" placeholder />
                        <button type="submit" className="btn btn-primary" onClick={handleSubmitSearch}>Tìm ngay</button>
                    </div>
                    <div className="list mt-4">
                        <table className="table">
                            <thead className="thead-dark sticky-top" style={{ zIndex: '0.5' }}>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên phụ tùng</th>
                                    <th className="text-center">Đơn giá</th>
                                    <th className="text-center">Số lượng còn</th>
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
