import React, { useState, useEffect } from "react";
import axios from "axios";
import './Report.css';
import config from "../config/config";
import MyLineChart from "./ChartToday";
import numeral from "numeral";
import ChartToday from "./ChartToday";
import ChartMonth from "./ChartMonth";
import ChartYear from "./ChartYear";

export default function Report() {
    const token = localStorage.getItem('token');
    const [stock, setStock] = useState({});
    const [report, setReport] = useState({
        dailyRevenue: 0,
        totalDailyOrder: 0,
        totalWeekOrder: 0,
        monthlyRevenue: 0,
        monthlyRevenue: 0,
        totalMonthOrder: 0,
        yearlyRevenue: 0,
        totalYearOrder: 0
    });
    const [option, setOption] = useState('today');
    const [message, setMessage] = useState('');

    const handReportRequest = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/RevenueReport/send-report/${option}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                switch (option) {
                    case "today":
                        setMessage("Đã gửi báo cáo doanh thu hôm nay đến chủ cửa hàng");
                        break;
                    case "this-week":
                        setMessage("Đã gửi báo cáo doanh thu tuần này đến chủ cửa hàng");
                        break;
                    case "this-month":
                        setMessage("Đã gửi báo cáo doanh thu tháng này đến chủ cửa hàng");
                        break;
                    case "this-year":
                        setMessage("Đã gửi báo cáo doanh thu năm nay đến chủ cửa hàng");
                        break;
                }
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                console.log("Sent report");
            }
        } catch (error) {
            console.error('There was an error when sending report to owner', error);
        }
    };

    const fetchReport1 = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Dashboard/stock-summary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setStock(response.data);
            }
        } catch (error) {
            console.error('There was an error when fetching stock summary', error);
        }
    };

    const fetchReport2 = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Dashboard/revenue-summary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReport(response.data);
            }
        } catch (error) {
            console.error('There was an error when fetching revenue summary', error);
        }
    };

    useEffect(() => {
        fetchReport1();
        fetchReport2();
    }, []);

    return (
        <div className="report-container">
            {message && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3 z-index-cao">
                    {message}
                </div>
            )}
            <div className="title title-report">
                <p>Báo Cáo Cửa Hàng</p>
            </div>

            <div className="send-report-btn d-flex">
                <h6 className="me-2 mt-2">Gửi báo cáo của:</h6>
                <input className="ms-2" type="radio" checked={option === 'today'} name="option" id="today" value="today" onClick={() => setOption('today')} />
                <label className="ms-2 mt-2" htmlFor="today">Hôm nay</label>
                <input className="ms-2" type="radio" name="option" id="this-week" value="this-week" onClick={() => setOption('this-week')} />
                <label className="ms-2 mt-2" htmlFor="this-week">Tuần này</label>
                <input className="ms-2" type="radio" name="option" id="this-month" value="this-month" onClick={() => setOption('this-month')} />
                <label className="ms-2 mt-2" htmlFor="this-month">Tháng này</label>
                <input className="ms-2" type="radio" name="option" id="this-year" value="this-year" onClick={() => setOption('this-year')} />
                <label className="ms-2 mt-2" htmlFor="this-year">Năm nay</label>
                <button className="btn btn-success ms-4 send-btn" onClick={handReportRequest}>Gửi báo cáo cho chủ cửa hàng</button>
            </div>

            <div className="items-report d-flex justify-content-between">
                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Số lượng sản phẩm còn lại:</h6>
                        <h6>{stock.totalStockQuantity}</h6>
                    </div>
                </div>

                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Tổng giá trị sản phẩm còn lại:</h6>
                        <h6>{numeral(stock.totalStockValue).format('0,0')} VND</h6>
                    </div>
                </div>

                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Số lượng sản phẩm hết hàng:</h6>
                        <h6>{stock.outOfStockProductCount}</h6>
                    </div>
                </div>

                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Số lượng đơn hàng:</h6>
                        <h6>{option === 'today' ? report.totalDailyOrder :
                            option === 'this-week' ? report.totalWeekOrder : // Assuming the same API data is used for 'this-week'
                                option === 'this-month' ? report.totalMonthOrder :
                                    report.totalYearOrder}</h6>
                    </div>
                </div>

                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Doanh thu:</h6>
                        <h6>{option === 'today' ? numeral(report.dailyRevenue).format('0,0') :
                            option === 'this-week' ? numeral(report.weeklyRevenue).format('0,0') : // Assuming the same API data is used for 'this-week'
                                option === 'this-month' ? numeral(report.monthlyRevenue).format('0,0') :
                                    numeral(report.yearlyRevenue).format('0,0')} VND</h6>
                    </div>
                </div>

                <div className="report-item d-flex">
                    <div className="report-item-symbol">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="report-content">
                        <h6>Doanh thu trung bình:</h6>
                        <h6>{option === 'today' ? numeral(report.dailyRevenue / report.totalDailyOrder || 0).format('0,0') :
                            option === 'this-week' ? numeral(report.dailyRevenue / report.totalDailyOrder || 0).format('0,0') : // Assuming the same API data is used for 'this-week'
                                option === 'this-month' ? numeral(report.monthlyRevenue / report.totalMonthOrder || 0).format('0,0') :
                                    numeral(report.yearlyRevenue / report.totalYearOrder || 0).format('0,0')} VND</h6>
                    </div>
                </div>
            </div>

            <div className="chart">
                {option === "today" && <ChartToday />}
                {option === "this-week" && <ChartToday />}
                {option === "this-month" && <ChartMonth />}
                {option === "this-year" && <ChartYear />}
            </div>
        </div>
    );
}
