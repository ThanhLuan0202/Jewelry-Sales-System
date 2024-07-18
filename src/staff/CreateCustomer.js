import React, { useState } from 'react';
import './CreateCustomer.css';
import { Link } from 'react-router-dom';

function CreateCustomer() {
    const [showPopup, setShowPopup] = useState(true); // State để quản lý hiển thị popup
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Customer info:', customerInfo);
        setShowPopup(false);
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Thêm thông tin khách hàng</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Tên:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={customerInfo.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="nutbam text-center">
                        <button type="submit" className='btn btn-success'>Lưu</button>

                        <button className="btn btn-danger close-button" >Hủy bỏ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCustomer;
