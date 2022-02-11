import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/index';
import callAPI from '../../../utils/apiCaller';

function ReceivingList(props) {
    const [receivingForms, setReceivingForms] = useState([]);
    const [maxNumberOfReceivedCarInDay, setMaxNumberOfReceivedCarInDay] = useState(0);

    useEffect(() => {
        setReceivingForms(props.receivingList);
    })
    
    
    // Fetch max number of received car in day
    useEffect(() => {
        callAPI('GET', '/api/parameters')
            .then(response => {
                setMaxNumberOfReceivedCarInDay(response.data[0].maxNumberOfReceivedCarInDay);
            })
            .catch(error => {
                if(error.response && error.response.data)
                    alert("Lỗi: " + error.response.data.message);
            })
    }, []);

    
    const handleRefresh = event => {
        event.preventDefault();

        callAPI('GET', '/api/receiving-forms')
            .then(res => {
                if (res && res.status === 200) {
                    props.fetchReceivingList(res.data);
                }
            })
    };
   
    const receivingList = receivingForms.filter(receivingForm => {
        const today = new Date();
        const receivingDate = new Date(receivingForm.receivingDate);

        if(today.getDate() !== receivingDate.getDate())
            return false;
        
        if(today.getMonth() !== receivingDate.getMonth())
            return false;

        if(today.getFullYear() !== receivingDate.getFullYear())
            return false;
        
        return true;
    })


    const receivingListComponents = receivingList.map((receivingForm, index) => {
    
        return (
            <tr key={index}>
                <td>{ String(index + 1).padStart(2, '0') }</td>
                <td>{ receivingForm.car.licensePlate }</td>
                <td>{ receivingForm.car.carOwner.phoneNumber }</td>
            </tr>
        )
    }).reverse();


    let processingStatus = Math.round((receivingList.length * 100)/maxNumberOfReceivedCarInDay);


    return (
        <>
            <div className="receiving-list mt-4 mb-2">
                <table className="table table--custom">
                    <thead className="sticky-top bg-dark text-white" style={{zIndex: "0"}}>
                        <tr className="border">
                            <th>STT</th>
                            <th>Biển số xe</th>
                            <th>Số điện thoại</th>
                        </tr>
                    </thead>
                    <tbody className="border-bottom">
                        { receivingListComponents }
                    </tbody>
                </table>
            </div>
            <div className="text-center mt-3">
                <button type="submit" className="btn btn-primary" onClick={handleRefresh}><i className="fas fa-sync mr-2"></i> Làm mới</button>
            </div>
                    <p className="text-center my-3">Garage chỉ tiếp nhận { maxNumberOfReceivedCarInDay } xe mỗi ngày</p>
                    <div className="receiving-status">
                        <div className="processing" style={{width: `${processingStatus}%`}} />
                    </div>
                    <p className="text-center">Đã tiếp nhận {receivingList.length}/{ maxNumberOfReceivedCarInDay } xe</p>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceivingList);