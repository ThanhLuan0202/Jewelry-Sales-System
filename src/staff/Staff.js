import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import GoldView from './GoldView';
import CreateOrder from './CreateOrder';
import Navbar from './Navbar';
import Footer from './Footer';
import ProductDetail from './ProductDetail';
import StaffHome from './StaffHome';
import Cashier from './Cashier';
import CashierDetail from './CashierDetail';
import Warranty from './Warranty';
import WarrantyDetail from './WarrantyDetail';
import WarrantyCardList from './WarrantyCardList';
import WarrantyPolicy from './WarrantyPolicy';
import PrivatePolicy from './PrivacyPolicy';
import PaymentPolicy from './PaymentPolicy';
import LegalPolicy from './LegalPolicy';
import BarcodeScanner from './BarcodeScanner';

function Staff() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/trang-chu-nv" element={<StaffHome />} />
                        <Route path="/giao-dich" element={<CreateOrder />} />
                        <Route path="/danh-sach-thanh-toan" element={<Cashier />} />
                        <Route path="/thanh-toan-chi-tiet/:orderId" element={<CashierDetail />} />
                        <Route path="/gia-vang" element={<GoldView />} />
                        <Route path="/chi-tiet-san-pham/:productId" element={<ProductDetail />} />
                        <Route path="/danh-sach-bao-hanh" element={<Warranty />} />
                        <Route path="/xuat-giay-bao-hanh/:orderId" element={<WarrantyDetail />} />
                        <Route path="/danh-sach-phieu-bao-hanh/:orderId" element={<WarrantyCardList />} />
                        <Route path="/chinh-sach-bao-hanh" element={<WarrantyPolicy />} />
                        <Route path="/chinh-sach-bao-mat" element={<PrivatePolicy />} />
                        <Route path="/chinh-sach-thanh-toan" element={<PaymentPolicy />} />
                        <Route path="/chinh-sach-ve-van-de-phap-luat" element={<LegalPolicy />} />
                        <Route path="/scan-barcode" element={<BarcodeScanner />} />

                    </Routes>
                    <Footer />
                </>
            } />
        </Routes>
    );
}

export default Staff;
