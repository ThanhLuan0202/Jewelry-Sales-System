import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Users from "./Users";
import Role from "./Role";
import Config from "./Config";
import Logout from "../manager/Logout";

function Admin() {
  return (
    <div className="row">
      <Sidebar />
      <Logout />

      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/role" element={<Role />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </div>
  );
}

export default Admin;