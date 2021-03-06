import React, { useEffect, useState } from 'react';
import print from 'print-js';
import Select from 'react-select';
import axiosClient from '../../config/axiosClient'

export default function CollectMoney() {
    // Loading screen state
    const [loading, setLoading] = useState(true);
    // Others state
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [carOptions, setCarOptions] = useState([]);
    // Select ref
    let carSelect;

    /* ------ Fetch cars list from API ---- */
    useEffect(() => {
      // -- Turn on loading screen --
      setLoading(true);
  
      // -- Fetch data by axiosClient --
      fetchCarList();
    }, []);

    // Set min date for receiving date input
    useEffect(() => {
        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var minDate = year + '-' + month + '-' + day;

        document.getElementById('collectDate').setAttribute('min', minDate);
        document.getElementById('collectDate').setAttribute('value', minDate);
    })

    // Fetch cars list from API
    const fetchCarList = () => {
      axiosClient({
        method: 'GET',
        url: '/api/cars'
      })
        .then(response => {
          setCars(response.data);

          // -- Create options for cars select element --
          setCarOptions(response.data.map( car => {
            return {
              value: car._id,
              label: car.licensePlate
            }
          }));
          
          // -- Set new value for selected car --
          let length = response.data.length;
          if(selectedCar) {
            for (let i = 0; i < length; i++)
            if(selectedCar._id === response.data[i]._id) {
              setSelectedCar(response.data[i]);
              break;
            }
          }

          // -- Turn off loading screen --
          setLoading(false);
        })
        .catch(error => {
          if(error.response && error.response.data)
            alert("L???i: " + error.response.data.message);
          
          // -- Turn off loading screen --
          setLoading(false);
        })
    }

    // Loading screen displaying
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

    // Handle car select on change
    const handleCarSelectOnChange = selectedOption => {
      let length = cars.length;
      let tmp;

      if(selectedOption) {
        for (let i = 0; i < length; i++)
          if(selectedOption.value === cars[i]._id) {
            setSelectedCar(cars[i]);
            tmp = cars[i]
            break;
          }

          document.getElementById('customerName').value = tmp.carOwner.name;
          document.getElementById('phoneNumber').value = tmp.carOwner.phoneNumber;
          document.getElementById('email').value = tmp.carOwner.email;
      }
    }

    // Display selected car debt
    const displayDebt = () => {
      if(selectedCar) 
        return (<small id="helpId" class="form-text text-muted"><i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp; Xe n??y ??ang n??? { selectedCar.debt.toLocaleString("DE-de")}??</small>)
    }

    // Handle submit form
    const handleSubmitForm = event => {
      event.preventDefault();
      const amount = document.getElementById('amount').value;
      if(amount > selectedCar.debt) {
        alert("S??? ti???n thu kh??ng ???????c v?????t qu?? s??? n???!!!");
      } else {
        // -- Turn on loading screen --
        setLoading(true);

        // -- Create bills --
        let data = {
          carId: selectedCar._id,
          email: document.getElementById('email').value,
          amount
        };
        axiosClient({
          method: 'POST',
          url: '/api/bills',
          data: data
        })
          .then(response => {
            alert("Thu ti???n th??nh c??ng!!! Vui l??ng nh???n phi???u in");

            // -- Fetch new data --
            fetchCarList();

            // -- Turn off loading screen --
            setLoading(false);

            // Print bill
            const printData = [{
              collectDate: document.getElementById('collectDate').value,
              amount: document.getElementById("amount").value,
              debt: selectedCar.debt - document.getElementById("amount").value
            }]

            console.log(printData);
            
            print({
                printable: printData,
                type: 'json',
                properties: [
                  { field: 'collectDate', displayName: 'Ng??y thu ti???n'},
                  { field: 'amount', displayName: 'S??? ti???n thu'},
                  { field: 'debt', displayName: 'N??? c??n l???i'}
                ],
                header: `
                  <h3 class="text-center">Phi???u thu ti???n</h3>
                  <p>Xe: ${ selectedCar.licensePlate }</>
                  <p>Ch??? xe: ${ document.getElementById('customerName').value }</>
                  <p>S??? ??i???n tho???i: ${ document.getElementById('phoneNumber').value }</>
                  <p>Email: ${ document.getElementById('email').value }</>
                `,
                style: '.text-center { text-align: center; }'
            });

            
          })
          .catch(error => {
            if(error.response && error.response.data)
              alert("L???i: " + error.response.data.message);

              // -- Turn off loading screen --
              setLoading(false);
          })
      }
    }

    const handleResetForm = event => {
      carSelect.select.clearValue();
    }


    return (
        <div className="container parent">
        <div className="box">
          <h4 className="text-center mb-4">L???p phi???u thu ti???n</h4>
          <form action method="post">
            <div className="row px-0">
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>Bi???n s???</label>
                  <Select
                    placeholder={"V?? d???: 51G-12345"}
                    options={carOptions}
                    onChange={handleCarSelectOnChange}
                    components={{
                      IndicatorSeparator: () => null
                    }}
                    ref={ref => {
                      carSelect = ref;
                    }}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>Ng??y thu ti???n</label>
                  <input type="date" className="form-control" name="collectDate" id="collectDate" aria-describedby="helpId" />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>S??? ti???n thu</label>
                  <input type="number" className="form-control" name="amount" id="amount" aria-describedby="helpId" defaultValue={0} />
                  { displayDebt() }
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>H??? t??n ch??? xe</label>
                  <input type="text" className="form-control" name="customerName" id="customerName" aria-describedby="helpId" placeholder readOnly />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>??i???n tho???i</label>
                  <input type="text" className="form-control" name="phoneNumber" id="phoneNumber" aria-describedby="helpId" />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label htmlFor>Email</label>
                  <input type="email" className="form-control" name="email" id="email" aria-describedby="helpId" />
                </div>
              </div>
            </div>
            <div className="row px-0 mt-4">
              <div className="col-4">
                <button type="reset" className="btn btn-primary" onClick={handleResetForm}><i className="fas fa-redo mr-2" />L???p phi???u m???i</button>
              </div>
              <div className="col-4">
                <button type="submit" className="btn btn-success w-100" onClick={handleSubmitForm}><i className="fas fa-print mr-2" />In v?? l??u</button>
              </div>
            </div>
          </form>
        </div>
        { displayLoading() }
      </div>
    )
}
