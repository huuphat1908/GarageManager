import React, { useEffect, useState } from 'react';
import './ReceivingCar.css';
import ReceivingList from './ReceivingList';
import ReceivingForm from './ReceivingForm';
import callAPI from '../../../utils/apiCaller';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions/index';


function ReceivingCar(props) {
    const [loading, setLoading] = useState(true);

    // Fetch receiving form in day
    useEffect(() => {
        callAPI('GET', '/api/receiving-forms')
            .then(res => {
                if (res && res.status === 200) {
                    props.fetchReceivingList(res.data);
                }
            })
    }, []);


    const callLoading = (value) => {
        setLoading(value);
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
    }

    return (
        <div className="container parent">
            {displayLoading()}
            <div className="box-container">
                <div className="box--col-2">
                    <h5 className="text-center">Tiếp nhận bảo trì xe</h5>
                    <ReceivingForm setLoading={callLoading} />
                </div>
                <div className="box--col-2">
                    <h5 className="text-center">Danh sách xe đã tiếp nhận trong ngày</h5>
                    <ReceivingList/>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReceivingCar);