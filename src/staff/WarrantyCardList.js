import './WarrantyCardList.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import numeral from 'numeral';
import config from '../config/config';

export default function WarrantyCardList() {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [warrantyList, setWarrantyList] = useState([]);
    const token = localStorage.getItem('token');
    const [exportWarrantyMessage, setExportWarrantyMessage] = useState('');

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrder(response.data);
            console.log('Order data:', response.data);
        } catch (error) {
            console.error('There was an error fetching the order!', error);
        }
    };

    const fetchWarrantyList = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Cart/get-warranty/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Warranty List data:', response.data); // Log the response data
            setWarrantyList(response.data);
        } catch (error) {
            console.error('There was an error fetching the warranty!', error);
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchWarrantyList();
    }, [orderId]);

    useEffect(() => {
        console.log('Warranty List updated:', warrantyList); // Log the updated warranty list
    }, [warrantyList]);

    const formatDateTime = (dateTimeString) => {
        try {
            const options = {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour12: false
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
        } catch (error) {
            // console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const addMonths = (date, months) => {
        let d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    };

    useEffect(() => {
        const exportWarrantyMessage = localStorage.getItem('exportWarrantyMessage');
        if (exportWarrantyMessage) {
            setExportWarrantyMessage(exportWarrantyMessage);
            localStorage.removeItem('exportWarrantyMessage');
        }
        setTimeout(() => {
            setExportWarrantyMessage('');
        }, 3000);
    }, []);

    return (
        <>
            {exportWarrantyMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {exportWarrantyMessage}
                </div>
            )}
            {order && (
                <div className="warrantyCardList">
                    <h3 className="warrantyCardList-title fw-bold">Danh sách phiếu bảo hành cho đơn hàng {order?.orderCode}</h3>
                    <div className="d-flex justify-content-end">
                        <div className="pay-confirm">
                            <Link to="/staff/danh-sach-bao-hanh" className="btn btn-success fas fa-check confirm-btn ms-2">
                                <span className="ms-2">Hoàn thành</span>
                            </Link>
                        </div>
                    </div>
                    <div className="warranty-card-list d-flex">
                        {warrantyList.map((warranty) => {
                            let daChinh = "";
                            let mauDa = "";
                            let sum = 0;

                            warranty.orderDetails.products.stones.forEach((stone) => {
                                if (stone.isPrimary) {
                                    daChinh = stone.name;
                                    mauDa = stone.color;
                                }
                                sum += stone.price;
                            });

                            let endDate = addMonths(order?.orderDate, warranty.orderDetails.products.warrantyPeriod);
                            let formattedEndDate = formatDateTime(endDate);

                            return (
                                <div className="warranty-card phieu-bao-hanh" key={`${warranty.warrantyId}`}>
                                    <h3 className="text-center phieu-bao-hanh-header">PHIẾU BẢO HÀNH TRANG SỨC</h3>
                                    <div className="d-flex justify-content-around phieu-bao-hanh-content">
                                        <div className='row axy'>
                                            <div className=' col bd-r mb-4'>
                                                <h6 className='ma-phieu'>Mã phiếu bảo hành: <p className='fw-bold'>{warranty.warrantyCode}</p></h6>
                                                <h6>Mã đơn hàng: #{order?.orderCode}</h6>
                                                <h6>Ngày mua: {formatDateTime(order?.orderDate)}</h6>
                                                <h6>Ngày kết thúc: {formattedEndDate}</h6>
                                                {(order.customers?.customerName || order.customerName) && (
                                                    <h6>Tên khách hàng: {order?.customers?.customerName || order?.customerName}</h6>
                                                )}

                                                {(order?.customers?.phoneNumber || order?.phoneNumber) && (
                                                    <h6>SĐT khách hàng: {order?.customers?.phoneNumber || order?.phoneNumber}</h6>
                                                )}

                                                {(order?.customers?.email || order?.email) && (
                                                    <h6>Email khách hàng: {order?.customers?.email || order?.email}</h6>
                                                )}

                                            </div>
                                            <div className='col mb-4'>
                                                <h6>Mã sản phẩm: {warranty.orderDetails.products.productCode}</h6>
                                                <h6>Tên sản phẩm: {warranty.orderDetails.products.productName}</h6>
                                                <h6>Loại vàng: {warranty.orderDetails.products.goldTypes.goldName}</h6>
                                                <h6>Trọng lượng vàng: {warranty.orderDetails.products.goldWeight} chỉ</h6>
                                                <h6>Đá chính: {daChinh}</h6>
                                                <h6>Màu đá chính: {mauDa}</h6>
                                                <h6>Tiền đá: {numeral(sum).format("0,0")} VND</h6>
                                                <h6>Tiền công: {numeral(warranty.orderDetails.products.wage).format("0,0")} VND</h6>
                                                <h6>Thành tiền: {numeral(warranty.orderDetails.products.price).format("0,0")} VND</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}
