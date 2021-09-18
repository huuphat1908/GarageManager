import React, { useEffect, useState } from 'react';
import './Lookup.css';
import callAPI from '../../../utils/apiCaller';
import axios from 'axios';

export default function Lookup() {
  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [cars, setCars] = useState([]);

  // Fetch cars list first time
  useEffect(() => {
    fetchCarsList();
  }, []);

  // Fetch cars list function
  const fetchCarsList = () => {
    // -- Turn on loading screen --
    setLoading(true);
    axios({
      method: 'GET',
      url: '/api/cars'
    })
      .then(res => {
        if (res && res.status === 200) {
          setCars(res.data);

          // -- Turn off loading screen --
          setLoading(false);
        }
      })
      .catch(error => {
        if(error.response && error.response.data)
          alert("Lỗi: " + error.response.data.message);
        // -- Turn off loading screen --
        setLoading(false);
      })
  }

  const handleSubmit = event => {
    event.preventDefault();
    const carInput = document.getElementById('car');
    const customerInput = document.getElementById('customer');
    const phoneNumberInput = document.getElementById('phoneNumber');
    setResultLoading(true);

    callAPI('POST', '/api/cars/search', {
      car: carInput.value,
      customer: customerInput.value,
      phoneNumber: phoneNumberInput.value
    })
      .then(res => {
        if (res && res.status === 200) {
          setCars(res.data);
          setResultLoading(false);
        }
      });
  }

  const resultTable = cars.map((car, index) => {
    let actions = (<button className="btn btn-primary" onClick={event => giveCarBack(event, car._id, car.licensePlate)}>Trả xe</button>);

    if(car.status === false)
      actions = (<button className="btn btn-secondary" disabled>Trả xe</button>);

    return (
      <tr key={ index }>
        <td>{String(index + 1).padStart(3, '0')}</td>
        <td>{car.licensePlate}</td>
        <td>{car.carBrand.name}</td>
        <td>{car.carOwner.name}</td>
        <td>{car.carOwner.phoneNumber}</td>
        <td>{car.debt}</td>
        <td className="text-center">{ actions }</td>
      </tr>
    )
  })

  const displayLoading = () => {
    if (loading) {
      return (
        <div className="container loading"  style={{ zIndex: 1 }}>
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

  const displayResultLoading = () => {
    if (resultLoading) {
      return (
        <tr className="container loading">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </tr>
      )
    }
  };

  const giveCarBack = (event, carId, carPlate) => {
    event.preventDefault();
    // -- Turn on loading screen --
    setLoading(true);

    // -- Give car back --
    axios({
      method: 'PUT',
      url: `/api/cars/${carId}`,
      data: {
        status: false
      },
    })
      .then(response => {
        alert(`Trả xe mang biển số ${carPlate} thành công!!!`);
        
        // -- Fetch new data --
        fetchCarsList()

        // -- Turn off loading screen --
        setLoading(false);
      })
      .catch(error => {
        if(error.response && error.response.data)
          alert("Lỗi: " + error.response.data.message);

        // -- Turn off loading screen --
        setLoading(false);
      })
  }

  return (
    <div className="container parent">
      {displayLoading()}
      <div className="box">
        <h4 className="text-center">Tra cứu xe</h4>
        <p className="text-center mb-4 font-italic">(Điền vào một hoặc một số thông tin bên dưới để tiến hành tra cứu)</p>
        <form>
          <div className="row px-0">
            <div className="col-12 col-lg">
              <div className="form-group">
                <label >Biển số</label>
                <input type="text" id="car" placeholder="Ví dụ: 51G-12345" className="form-control" aria-describedby="helpId" />
              </div>
            </div>
            <div className="col-12 col-lg">
              <div className="form-group">
                <label><span className="text-secondary mr-2"><small>hoặc</small></span>Tên chủ xe</label>
                <input type="text" id="customer" placeholder="Ví dụ: Nguyễn Văn A" className="form-control" aria-describedby="helpId" />
              </div>
            </div>
            <div className="col-12 col-lg">
              <div className="form-group">
                <label><span className="text-secondary mr-2"><small>hoặc</small></span>Số điện thoại</label>
                <input type="text" id="phoneNumber" placeholder="Ví dụ: 0396042356" className="form-control" aria-describedby="helpId" />
              </div>
            </div>
            <div className="col-12 col-lg-2 text-center">
            <label className="invisible d-block">Thao tác</label>
              <button type="submit" className="btn btn-primary w-75" onClick={handleSubmit}>Tìm ngay</button>
            </div>
          </div>
          <div className="result-list my-3">
            <table className="table table--custom">
              <thead className="thead-dark sticky-top" style={{ zIndex: 1 }}>
                <tr>
                  <th>STT</th>
                  <th>Biển số</th>
                  <th>Hiệu xe</th>
                  <th>Chủ xe</th>
                  <th>Số điện thoại</th>
                  <th>Tiền nợ</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="parent" style={{ zIndex: "0" }}>
                {displayResultLoading()}
                {resultTable}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  )
}
