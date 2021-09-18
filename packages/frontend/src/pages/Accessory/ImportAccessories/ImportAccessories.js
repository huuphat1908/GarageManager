import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';

export default function ImportAccessory() {
    // Loading screen state 
    const [loading, setLoading] = useState(true);
    //  Others state
    const [accessoryOptions, setAccessoryOptions] = useState([]);
    //  Select ref
    let accessorySelect;


    // Fetch accessory data first time
    useEffect(() => {
        // Turn on loading screen
        setLoading(true);

        axios({
            method: 'GET',
            url: '/api/accessories',
        })
            .then(response => {
                setAccessoryOptions(response.data.map(accessory => {
                    return {
                        value: accessory._id,
                        label: accessory.name
                    }
                }));

                // Turn off loading screen
                setLoading(false);
            })
            .catch(error => {
                if(error.response && error.response.data)
                    alert(error.response.data.message);

                // Turn off loading screen
                setLoading(false);
            })
    }, []);

    
    const handleSubmit = event => {
        event.preventDefault();
        const amountInput = document.getElementById("amount");

        // Check inputs is enough or not
        if(accessorySelect.select.getValue().length < 1 || !amountInput.value) {
            alert("Bạn chưa nhập đủ thông tin!!!");
            return;
        }

        const accessoryId = accessorySelect.select.getValue()[0].value;
        const accessoryName = accessorySelect.select.getValue()[0].label;

        // Turn on loading screen
        setLoading(true);

        // Import accessory
        const data = {
            accessoryId: accessoryId,
            amount: amountInput.value
        }

        axios({
            method: 'POST',
            url: '/api/accessory-import-forms',
            data
        })
            .then(response => {
                alert(`Nhập ${amountInput.value} ${accessoryName} thành công!!!`);

                // Turn off loading screen
                setLoading(false);
            })
            .catch(error => {
                if(error.response && error.response.data)
                    alert(error.response.data.message);

                // Turn off loading screen
                setLoading(false);
            })
    }


    const displayLoading = () => {
        if (loading) {
          return (
            <div className="container loading" style={{zIndex: 100000}}>
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


    return (
        <>
            <div className="container parent">
                { displayLoading() }
                <div className="box">
                    <div className="row">
                        <div className="col">
                            <div className="form-group">
                                <label>Tên phụ tùng mới</label>
                                <Select
                                    options={accessoryOptions}
                                    components={{
                                        IndicatorSeparator: () => null
                                    }}
                                    ref={ref => {
                                        accessorySelect = ref;
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="amount">Số lượng</label>
                                <input type="number" className="form-control" id="amount" name="amount" aria-describedby="helpId" defaultValue={1} min={1} />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label className="invisible d-block">Số lượng</label>
                                <button type="submit"className="btn btn-primary w-100" onClick={handleSubmit}>Nhập</button>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 form-text text-muted"><i className="fa fa-info-circle" aria-hidden="true" />&nbsp; Để nhập loại phụ tùng mới, bạn vui lòng thêm phụ tùng đó vào danh sách của garage <Link to="/quan-ly-phu-tung/danh-sach-phu-tung">tại đây</Link></p>
                </div>
            </div>
        </>
    )
}
