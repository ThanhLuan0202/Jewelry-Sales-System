import React, { useState, useEffect } from "react";
import './Warranty.css'
import { Link, useParams } from "react-router-dom";
import numeral from 'numeral';
import config from "../config/config";


export default function Warranty() {
    const { orderId } = useParams();
    const [orders, setOrders] = useState([]);
    const [curOrderPage, setCurOrderPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const pageSize = 10;
    const token = localStorage.getItem('token');



    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Orders/get-status-order/paid?pageNumber=${curOrderPage}&pageSize=${pageSize}`,
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
        fetch(`${config.API_ROOT}/api/Orders/get-status-order/paid?pageNumber=1&pageSize=1000`,
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
        try {
            const options = {

                hour: '2-digit', minute: '2-digit', second: '2-digit',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour12: false
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
        } catch (error) {
            // console.error('Error formatting date:', error);
            return 'Invalid date';
        }
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

    return (
        <div className="warraty">
            <div className="container">
                <h1 className="warranty-title-page fw-bold mb-4 ml-20">DANH SÁCH ĐƠN HÀNG CHỜ NHẬN HÀNG</h1>
                <table className="cashier-table text-nowrap ">
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
                        {orders?.map((order, index) => (
                            <tr key={order.orderId}>
                                <td>{(curOrderPage - 1) * pageSize + index + 1}</td>
                                <td>{order.orderCode}</td>
                                <td>{order.customers?.customerName || order.customerName || ""}</td>
                                <td>{order.customers?.phoneNumber || order.phoneNumber || ""}</td>
                                <td>{order.customers?.email || order.email || ""}</td>
                                <td>{order.orderDate}</td>
                                <td>{numeral(order.total).format("0,0")} VND</td>
                                <td>{order.users.fullName}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link to={`/staff/xuat-giay-bao-hanh/${order.orderId}`} className="fas fa-certificate btn btn-success xuat-giay-btn"><span className="ms-2 text-nowrap ">Bảo hành</span></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav aria-label="..." className="d-flex float-end warranty-pationating">
                    {renderPagination()}
                </nav>
            </div>
        </div>
    );
}