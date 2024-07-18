import React from "react";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import Customer from "./Customer";
import Product from "./Product";
import Revenue from "./Revenue";
import Paytype from "./Paytype";
import Warranty from "./Warranty";
import UpdatePriceGold from "./UpdatePriceGold";
import Category from "./Category";
import Stone from "./Stone";
import Gold from "./Gold";
import Report from "./Report";
import Logout from "./Logout";



function Manager() {
  return (
    <div className="row">
      <Sidebar />
      <Logout />
      <Routes>
        <Route path="/report" element={<Report />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/product" element={<Product />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/paytype" element={<Paytype />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/updatePriceGold" element={<UpdatePriceGold />} />
        <Route path="/category" element={<Category />} />
        <Route path="/stone" element={<Stone />} />
        <Route path="/gold" element={<Gold />} />

      </Routes>
    </div>
  );
}

export default Manager;
