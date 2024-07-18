import "./Sidebar.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

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
  var decodedToken = ""

  var name = "";
  var token = "";
  var role = "";
  try {
    token = localStorage.getItem('token');
    decodedToken = jwtDecode(token);
    name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  } catch (e) {
  }
  return (
    <div>
      <div className="viewport col-2">
        <div className="sidebar col-2">
          <header>
            <div id="sidebar_header_avatar">
              <img
                src={info.avatar}
                width="75px"
              />
            </div>
            <div>
              <b>{name}</b>
            </div>
            <div id="role">
              <a>Quản Trị Viên</a>
            </div>
            <div id="line"></div>
          </header>
          <ul className="nav">

            <li className={`${activeTab === "Người Dùng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Người Dùng")}>
              <Link to="/admin/users">
                <i className="fas fa-user-tie" ></i> <p>Người Dùng</p>
              </Link>
            </li>
            <li className={`${activeTab === "Vai Trò" ? "sidebarActive" : ""}`} onClick={() => handleClick("Vai Trò")}>
              <Link to="/admin/role">
                <i className="fas fa-user-tag"></i> <p>Vai Trò</p>
              </Link>
            </li>
            <li className={`${activeTab === "Cấu hình" ? "sidebarActive" : ""}`} onClick={() => handleClick("Cấu hình")}>
              <Link to="/admin/config">
                <i class="fas fa-cog"></i> <p>Cửa hàng</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
