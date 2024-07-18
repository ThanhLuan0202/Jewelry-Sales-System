import React, { useEffect, useState } from "react";
import "./Sidebar.css";

import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";
function Sidebar() {

  const [activeTab, setActiveTab] = useState("Báo Cáo Cửa Hàng");
  const [info, setInfo] = useState({});

  const fetchInfo = () => {
    fetch("https://kimnganhoanbeta.azurewebsites.net/api/StoreInfo", {
    })
      .then(response => response.json())
      .then(data => {
        setInfo(data);
      })
      .catch(error => console.error("Error fetching store info:", error));
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleClick = (label) => {
    setActiveTab(label);
    console.log(label);
  };

  const sidebars = []

  var decodedToken = ""

  var name = "";
  var token = "";
  var role = "";

  try {
    token = localStorage.getItem('token');
    decodedToken = jwtDecode(token);
    name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    role = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  } catch (e) {
  }

  return (
    <div>
      <div className="viewport col-2">
        <div className="sidebar col-2">
          <header>
            <div id="sidebar_header_avatar">
              <img src={info.avatar} width="75px" />
            </div>
            <div>
              <b> {name}</b>
            </div>
            <div id="role">
              <a>Quản Lý</a>
            </div>
            <div id="line"></div>
          </header>
          <ul className="nav">
            <li className={`${activeTab === "Báo Cáo Cửa Hàng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Báo Cáo Cửa Hàng")}>

              <Link to="/manager/report">
                <i className="fas fa-store"></i><p>Báo Cáo Cửa Hàng</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Đơn Hàng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Đơn Hàng")}>
              <Link to="/manager/revenue">
                <i className="fas fa-dollar-sign"></i><p>Đơn Hàng</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Thanh Toán" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Thanh Toán")}>
              <Link to="/manager/paytype">
                <i className="fas fa-file-invoice-dollar"></i><p>Giao Dịch</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Sản Phẩm" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Sản Phẩm")}>
              <Link to="/manager/product">
                <i class="fas fa-shopping-bag"></i><p>Sản Phẩm</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Phiếu Bảo Hành" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Phiếu Bảo Hành")}>
              <Link to="/manager/warranty">
                <i className="fas fa-user-shield"></i><p>Phiếu Bảo Hành</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Khách Hàng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Khách Hàng")}>
              <Link to="/manager/customer">
                <i className="fas fa-users"></i><p>Khách Hàng</p>
              </Link>
            </li>
            {/* <li>
              <Link to="/manager/updatePriceGold">
                <i className="fas fa-wrench"></i> Cập Nhật Giá Vàng ****
              </Link>
            </li> */}
            <li className={`${activeTab === "Quản Lý Danh Mục" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Danh Mục")}>
              <Link to="/manager/category">
                <i class="fas fa-bars"></i><p>Danh Mục</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Đá" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Đá")}>
              <Link to="/manager/stone">
                <i className="far fa-gem"></i><p>Đá</p>
              </Link>
            </li>
            <li className={`${activeTab === "Quản Lý Loại Vàng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Quản Lý Loại Vàng")}>
              <Link to="/manager/gold">
                <i className="fas fa-coins"></i><p>Loại Vàng</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
