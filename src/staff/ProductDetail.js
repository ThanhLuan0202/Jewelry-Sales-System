import React, { useState, useEffect } from 'react';
import './ProductDetail.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';

function ProductDetail() {

    const [product, setProduct] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Product/1`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, []);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className='out-product-popup'>
            <div className="row product-detail-popup">
                <div className="col-5">
                    <div className="product-detail-img">
                        {/* <img className="product-detail-picture" src={`./${product.image}`} alt={product.productName} /> */}
                        <img className="product-detail-picture" src="https://ngoctham.com/wp-content/uploads/2023/09/nhan-nu-vang-18k-dvnutvv0100q776-ntj-01-1800x2025.jpg" alt={product.productName} />

                    </div>
                </div>
                <div className="col-7 product-info">
                    <Link to="/staff/giao-dich">
                        <div className="off-popup">
                            <i className="far fa-times-circle btn btn-danger btn-off-popup"></i>
                        </div>
                    </Link>
                    <div className="d-flex align-items-center detail-info">
                        <div className="product-info-detail">
                            <span className="fw-bold">Tên sản phẩm: </span> <span className='product-detail-name'>{product.productName}</span><br />
                            <span className="fw-bold">Mã sản phẩm:</span> <span> {product.productId}</span><br />
                            <span className="fw-bold">Loại vàng:</span> <span> {product.goldTypes.goldName}</span><br />
                            <span className="fw-bold">Trọng lượng vàng:</span> <span> {product.goldWeight}</span><br />
                            <span className="fw-bold">Đá chính:</span> <span>Swarovski</span><br />
                            <span className="fw-bold">Màu đá chính:</span> <span> Trắng</span><br />
                            <span className="fw-bold">Tiền đá:</span> <span> 412.000 VND</span><br />
                            <span className="fw-bold">Tiền công:</span><span> {product.wage} VND</span><br />
                            <span className="fw-bold">Số lượng:</span><span> 2</span><br />
                            <span className="fw-bold">Tổng tiền:</span> <span className='product-detail-name'> 11.680.000 VND</span><br />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
