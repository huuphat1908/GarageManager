import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import callAPI from '../../../utils/apiCaller';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/index';
import axios from 'axios';

function ReceivingForm(props) {
    const [cars, setCars] = useState([]);
    const [carBrands, setCarBrands] = useState([]);
    const [selectedCarBrand, setSelectedCarBrand] = useState();
    const [disableCarBrandSelect, setDisableCarBrandSelect] = useState(false);
    const [minReceivingDate, setMinReceivingDate] = useState();

    // Fetch cars list
    useEffect(() => {
        callAPI('GET', '/api/cars')
            .then(res => {
                if (res && res.status === 200) {
                    setCars([...res.data]);
                }
            });
    }, []);


    // Fetch car brands list
    useEffect(() => {
        callAPI('GET', '/api/car-brands')
            .then(res => {
                if (res && res.status === 200) {
                    const brandSelectOtions = res.data.map(carBrand => {
                        return {
                            value: carBrand._id,
                            label: carBrand.name
                        }
                    });
                    setCarBrands(brandSelectOtions);
                    setSelectedCarBrand(brandSelectOtions[0]);
                    props.setLoading(false);
                }
            });
    }, []);

    // set min date for receiving date input
    useEffect(() => {
        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;
        setMinReceivingDate(maxDate);

        document.getElementById('receivingDate').setAttribute('value', maxDate);
    })

    // hanle when receiving date on change
    const handleReceivingDateOnChange = (event) => {
        let target = event.target;
        let value = target.value;

        let toDay = new Date(minReceivingDate);
        let receivingDate = new Date(value);

        if (receivingDate < toDay) {
            window.alert("Ngày tiếp nhận phải lớn hơn hoặc bằng ngày hiện tại");
            document.getElementById('receivingDate').value = minReceivingDate
        }
    }

    // hanlde when car plate on change
    const handleCarOnChange = (event) => {
        const carPlate = document.getElementById('licensePlate');
        const nameInput = document.getElementById('name');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const emailInput = document.getElementById('email');
        const addressInput = document.getElementById('address');
        let target = event.target;
        let value = target.value;

        carPlate.value = value.toUpperCase();

        for (let i = 0; i < cars.length; i++) {
            // If exist car plate in database before
            if (cars[i].licensePlate === value) {
                // Set value and disable customer name input
                nameInput.value = cars[i].carOwner.name;
                nameInput.disabled = true;

                // Set value and disable car brand select
                setSelectedCarBrand({ value: cars[i].carBrand._id, label: cars[i].carBrand.name })
                setDisableCarBrandSelect(true);

                // Set value customer phone
                phoneNumberInput.value = cars[i].carOwner.phoneNumber;

                // Set value customer email
                emailInput.value = cars[i].carOwner.email;

                // Set value customer address
                addressInput.value = cars[i].carOwner.address;

                return
            }
        }
        nameInput.disabled = false;
        nameInput.value = '';
        setDisableCarBrandSelect(false);
        phoneNumberInput.value = '';
        emailInput.value = '';
        addressInput.value = ''
    }

    // Hanlde when car brand select on change
    const handleBrandOnChange = selectedOption => {
        setSelectedCarBrand(selectedOption);
    }


    // Handle when submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        const licensePlate = document.getElementById('licensePlate');
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phoneNumber = document.getElementById('phoneNumber');
        const address = document.getElementById('address');
        const receivingDate = document.getElementById('receivingDate');


        const formData = {
            licensePlate: licensePlate.value,
            name: name.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            address: address.value,
            receivingDate: receivingDate.value,
            carBrand: selectedCarBrand.label
        }

        props.setLoading(true);


        console.log(formData);
        axios({
            method: 'POST',
            url: '/api/receiving-forms',
            data: formData
        })
            .then(res => {
                if (res && res.status === 201) {
                    window.alert("Đã tiếp nhận xe mang biển số " + licensePlate.value);
                    handleReset();

                    callAPI('GET', '/api/cars')
                        .then(res => {
                            if (res && res.status === 200) {
                                setCars([...res.data]);
                            }
                        })
                        .catch(error => {
                            console.log(error.response);
                            if(error.response && error.response.data)
                                alert("Lỗi: " + error.response.data.message);
                            props.setLoading(false);
                        })
                        

                    callAPI('GET', '/api/receiving-forms')
                        .then(res => {
                            if (res && res.status === 200) {
                                props.fetchReceivingList(res.data);
                                props.setLoading(false);
                            }
                        })
                        .catch(error => {
                            console.log(error.response);
                            if(error.response && error.response.data)
                                alert("Lỗi: " + error.response.data.message);
                            props.setLoading(false);
                        })

                }
            })
            .catch(error => {
                if(error.response && error.response.data)
                    alert("Lỗi: " + error.response.data.message);
                props.setLoading(false);
            })

    }

    // Handle when submit form 
    const handleReset = () => {
        const nameInput = document.getElementById('name');

        nameInput.disabled = false;
        setDisableCarBrandSelect(false);
    }

    return (
        <div>
            <form id="receiving-form">
                <div className="row px-0">
                    <div className="col-6">
                        <div className="form-group">
                            <label>Biển số xe</label>
                            <input type="text" name="licensePlate" id="licensePlate" autoFocus placeholder="Ví dụ: 51G-12345" className="form-control" aria-describedby="helpId" onChange={handleCarOnChange} />
                        </div>
                    </div>
                    <div className="col-6 pl-0">
                        <div className="form-group">
                            <label>Hiệu xe</label>
                            <Select
                                id="carBrand"
                                placeholder={"Chọn hiệu xe"}
                                options={carBrands}
                                value={selectedCarBrand}
                                onChange={handleBrandOnChange}
                                isDisabled={disableCarBrandSelect}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                        </div>
                    </div>
                </div>


                <div className="form-group">
                    <label>Tên chủ xe</label>
                    <input type="text" id="name" name="name" placeholder="Ví dụ: Nguyễn Văn A" className="form-control" aria-describedby="helpId" />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="text" id="phoneNumber" placeholder="Ví dụ: 0369002357" name="phoneNumber" className="form-control" aria-describedby="helpId" />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" id="email" name="email" placeholder="Ví dụ: tuanphuongtran.14@gmail.com" className="form-control" aria-describedby="helpId" />
                </div>
                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input type="text" id="address" name="address" placeholder="Ví dụ: Q4, TP.HCM" className="form-control" aria-describedby="helpId" />
                </div>


                <div className="form-group">
                    <label>Ngày tiếp nhận</label>
                    <input type="date" id="receivingDate" name="receivingDate" className="form-control" onBlur={handleReceivingDateOnChange} />
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <button type="submit" className="btn btn-success w-50" onClick={handleSubmit}>Gửi ngay</button>
                    <button type="reset" className="btn btn-danger" onClick={handleReset}><i className="fas fa-redo"></i> &nbsp; Nhập lại</button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        receivingList: state.receivingForm.receivingList
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchReceivingList: (receivingList) => {
            dispatch(actions.updateReceivingList(receivingList));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReceivingForm)