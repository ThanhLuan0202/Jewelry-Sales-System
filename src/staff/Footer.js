import React, { useState, useEffect } from "react";
import './Footer.css'
import { Link } from "react-router-dom";
import config from "../config/config";

function Footer() {

    const [info, setInfo] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/StoreInfo`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setInfo(data))
            .catch(error => console.error('Error fetching info:', error));
    }, [token]);

    return (
        <div className="container-fluid footer">
            <div className="row">
                <div className="col-4 logo-img-ft">
                    <img className="logo-footer" src={info.logo} />
                    <p className="slogan-khn">{info.slogan}</p>
                </div>
                <div className="col-4 info-khn">
                    <h4>VỀ CHÚNG TÔI</h4>
                    <span>{info.footer}</span> <br />
                    <span>Địa chỉ: {info.address}</span><br />
                    <span>Email: {info.email}</span><br />
                    <span>Số điện thoại: {info.numberPhone}</span><br />
                    <span>Mã số thuế: {info.taxNumber}</span>
                </div>
                <div className="col-4 info-khn">
                    <h4>CHÍNH SÁCH KHÁCH HÀNG    </h4>
                    <Link to="/staff/chinh-sach-thanh-toan">Chính sách thanh toán</Link><br />
                    <Link to="/staff/chinh-sach-bao-hanh">Chính sách bảo hành</Link> <br />
                    <Link to="/staff/chinh-sach-bao-mat">Chính sách bảo mật</Link><br />
                    <Link to="/staff/chinh-sach-ve-van-de-phap-luat">Chính sách về vấn đề pháp lý</Link><br />
                </div>
            </div>
            <div className="text-center copyright">
                <i className="far fa-copyright"></i>
                {info.footer}
            </div>
        </div>
    );

}

export default Footer