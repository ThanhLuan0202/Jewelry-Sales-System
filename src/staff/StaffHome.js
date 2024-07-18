import React, { useState, useEffect } from "react";
import './StaffHome.css';
import { Link } from "react-router-dom";
import numeral from 'numeral';
import config from "../config/config";
import { jwtDecode } from "jwt-decode";

import Integer from "@zxing/library/esm/core/util/Integer";

export default function StaffHome() {
    const [orders, setOrders] = useState([]);
    const [curOrderPage, setCurOrderPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const pageSize = 10;
    const [createOrderMessage, setCreateOrderMessage] = useState('');
    const token = localStorage.getItem('token');
    const [level, setLevel] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setLevel(parseInt(decodedToken.Level, 10));
        }
    }, []);

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Orders/get-status-order/wait?pageNumber=${curOrderPage}&pageSize=${pageSize}&isAscending=false&sortBy=date`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(order => ({
                    ...order,
                    orderDate: formatDateTime(order.orderDate)
                }));
                setOrders(formattedData);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, [curOrderPage]);

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Orders/get-status-order/wait?pageNumber=1&pageSize=1000`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                setTotalOrders(data.length);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
    };

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

    useEffect(() => {
        const message = localStorage.getItem('createOrderMessage');
        if (message) {
            setCreateOrderMessage(message);
            localStorage.removeItem('createOrderMessage');

            setTimeout(() => {
                setCreateOrderMessage('');
            }, 3000);
        }
    }, []);


    return (
        <div className="staffHome">
            {createOrderMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {createOrderMessage}
                </div>
            )}
            <div className="container">
                <h1 className="staffHome-orders fw-bold">DANH SÁCH ĐƠN HÀNG</h1>
                {[1, 3, 5, 7].includes(5) &&
                    <div className="d-flex justify-content-end align-items-end">
                        <Link to="/staff/giao-dich" className="fas fa-cart-plus btn btn-primary btn-create-new-order">
                            <span className="ms-2">Tạo mới đơn hàng</span>
                        </Link>
                    </div>
                }
                <table className="staff-orders-table table-striped">
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
                                <td>{order.orderDate}</td>
                                <td>{numeral(order.total).format("0,0")} VND</td>
                                <td>{order.users?.fullName}</td>
                                <td style={{ textAlign: 'left' }} >
                                    <i className="fas fa-hourglass text-primary ms-2"></i>
                                    <p className="ms-2" style={{ display: 'inline' }}>{order.status}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav aria-label="..." className="d-flex float-end staffhome-pagination">
                    {renderPagination()}
                </nav>
            </div>
        </div>
    );
}
