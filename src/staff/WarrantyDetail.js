import React, { useEffect, useState } from "react";
import axios from 'axios';
import './WarrantyDetail.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import numeral from "numeral";
import config from '../config/config';

export default function WarrantyDetail() {
    const { orderId } = useParams();
    const [orderDetails, setorderDetails] = useState([]);
    const [order, setOrder] = useState({});
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [numOfProducts, setNumOfProducts] = useState(0);

    const fetchOrder = () => {
        axios.get(`${config.API_ROOT}/api/Orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order!', error);
            });
    }

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/get-number-of-order-quantity/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setNumOfProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching num of products!', error);
            });
    }, []);

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/GetOrderDetails/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setorderDetails(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order details!', error);
            });
    }, []);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const numberToWords = (num) => {
        const units = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
        const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        const scales = ["", "nghìn", "triệu", "tỷ"];

        if (num === 0) return "Không đồng";

        let words = [];

        for (let i = 0; num > 0; i++) {
            let chunk = num % 1000;

            if (chunk) {
                let chunkStr = '';

                if (chunk >= 100) {
                    chunkStr += units[Math.floor(chunk / 100)] + ' trăm ';
                    chunk %= 100;
                }

                if (chunk >= 20) {
                    chunkStr += tens[Math.floor(chunk / 10)] + ' ';
                    chunk %= 10;

                    if (chunk === 1) {
                        chunkStr += 'mốt ';
                    } else if (chunk === 5) {
                        chunkStr += 'lăm ';
                    } else if (chunk > 0) {
                        chunkStr += units[chunk] + ' ';
                    }
                } else if (chunk >= 10) {
                    chunkStr += teens[chunk - 10] + ' ';
                } else if (chunk > 0) {
                    chunkStr += units[chunk] + ' ';
                }

                chunkStr = chunkStr.trim();
                words.push(chunkStr + ' ' + scales[i]);
            }

            num = Math.floor(num / 1000);
        }

        let result = words.reverse().join(' ').trim() + ' đồng.';
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    const formatDateTime = (dateTimeString) => {
        try {
            const options = {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
        } catch (error) {
            // console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const hanldeExportWarranty = async () => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/Cart/addWarranty`, {
                orderId: orderId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            if (response.status === 200) {
                localStorage.setItem("exportWarrantyMessage", "Đã xuất phiếu bảo hành thành công")
                navigate(`/staff/danh-sach-phieu-bao-hanh/${orderId}`)
            }
        } catch (error) {
            console.error('There was an error exporting warranty!', error);
        }
    }

    return (
        <div className="cash-detail">
            <h1 className="cash-detail-title-page">Thông tin chi tiết đơn hàng {order.orderCode}</h1>
            <div className="d-flex justify-content-end">
                <div className="pay-confirm">
                    <Link to="/staff/danh-sach-bao-hanh" className="btn btn-danger fas fa-times confirm-btn"><span className="ms-2">Hủy bỏ</span></Link>
                    <button className="btn btn-success fas fa-check confirm-btn ms-2" onClick={hanldeExportWarranty}><span className="ms-2">Xuất phiếu bảo hành</span></button>
                </div>
            </div>
            <div className="row">
                <div className="order-customer-info col-4">
                    <h6>Tên khách hàng: {order.customers?.customerName || order.customerName}</h6>
                    <h6>SĐT khách hàng: {order.customers?.phoneNumber || order.phoneNumber}</h6>
                    <h6>Email khách hàng: {order.customers?.email || order.email}</h6>
                </div>
                <div className="col-4">
                    <h6>Thời gian tạo đơn hàng: {formatDateTime(order?.orderDate)}</h6>
                    <div className="info-sumarize">
                        <h6>Tổng số lượng sản phẩm: {numOfProducts} sản phẩm</h6>
                        <h6>Tổng cộng: {numeral(order.total).format("0,0")} VND</h6>
                        <h6>Bằng chữ: {numberToWords(order.total)}</h6>
                    </div>
                </div>
            </div>
            <div className="order-detail-info">
                <h6 className="cash-detail-title fw-bold">Danh sách chi tiết đơn hàng:</h6>
                <div className="order-detail-table d-flex justify-content-center align-items-center ml-23">
                    <table className="staff-orders-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã sản phẩm</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Loại vàng</th>
                                <th>Trọng lượng vàng</th>
                                <th>Tiền đá</th>
                                <th>Tiền công</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((detail, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{detail.product.productCode}</td>
                                    <td>
                                        <div>
                                            <img className="pay-detail-img" src="https://ngoctham.com/wp-content/uploads/2023/02/nhan-nu-vang-18k-dvnutvv0000q506-ntj-01-1800x2025.jpg" />
                                        </div>
                                    </td>
                                    <td>{detail.product.productName}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.product.goldTypes.goldName}</td>
                                    <td>{detail.product.goldWeight} chỉ</td>
                                    <td>{numeral(250000).format("0,0")} VND</td>
                                    <td>{numeral(detail.product.wage).format("0,0")} VND</td>
                                    <td>{numeral(detail.price).format("0,0")} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
