import React, { useState, useEffect } from "react";
import './StaffHome.css';
import './Cashier.css';
import { Link } from "react-router-dom";
import numeral from 'numeral';
import config from '../config/config';

export default function Cashier() {
    const [orders, setOrders] = useState([]);
    const [curOrderPage, setCurOrderPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const pageSize = 10;
    const [paymentSuccess, setPaymentSuccess] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Orders/get-status-order/wait?pageNumber=${curOrderPage}&pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                setOrders(data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, [curOrderPage]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${config.API_ROOT}/api/Orders/GetWaitingOrders?pageNumber=1&pageSize=1000`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                );
                const data = await response.json();
                setTotalOrders(data.length);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [curOrderPage]);

    const handlePageChange = (newPage) => {
        setCurOrderPage(newPage);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalOrders / pageSize);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === curOrderPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }

        return (
            // totalPages > 1 &&
            <ul className="pagination staffhome-panationing">
                <li className={`page-item ${curOrderPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curOrderPage - 1)}>Previous</button>
                </li>
                {pages}
                <li className={`page-item ${curOrderPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curOrderPage + 1)}>Next</button>
                </li>
            </ul>
        );
    };


    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
    };

    useEffect(() => {
        const paymentSuccess = localStorage.getItem('paymentSuccess');
        if (paymentSuccess) {
            setPaymentSuccess(paymentSuccess);
            localStorage.removeItem('paymentSuccess');
        }
        setTimeout(() => {
            setPaymentSuccess('');
        }, 3000);
    }, []);

    return (
        <div className="staffHome cashier-page">
            {paymentSuccess && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {paymentSuccess}

                </div>

            )}
            <div className="container">
                <h1 className="staffHome-orders ml-20 fw-bold mb-4">DANH SÁCH ĐƠN HÀNG CHỜ THANH TOÁN</h1>
                <table className="text-nowrap cashier-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Tên khách hàng</th>
                            <th>SĐT khách hàng</th>
                            <th className="mw-230px">Email khách hàng</th>
                            <th>Thời gian</th>
                            <th>Tổng tiền</th>
                            <th>Người tạo</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.orderId}>
                                <td>{(curOrderPage - 1) * pageSize + index + 1}</td>
                                <td>{order.orderCode}</td>
                                <td>{order.customers?.customerName || order.customerName || ""}</td>
                                <td>{order.customers?.phoneNumber || order.phoneNumber || ""}</td>
                                <td>{order.customers?.email || order.email || ""}</td>
                                <td>{formatDateTime(order.orderDate)}</td>
                                <td>{numeral(order.total).format("0,0")} VND</td>
                                <td>{order.users.fullName}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link className="fas fa-cash-register btn btn-primary btn-go-cash"
                                        to={`/staff/thanh-toan-chi-tiet/${order.orderId}`}>
                                        <span className="ms-2 cash-info-btn">Thanh toán</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <nav aria-label="..." className="cashier-pagination">
                    {renderPagination()}
                </nav>
            </div>
        </div>
    );
}
