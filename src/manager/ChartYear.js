import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function formatMonth(monthNumber) {
    // Format month number to name (e.g., 1 -> "Tháng 1")
    return `Tháng ${monthNumber}`;
}

const ChartYear = () => {
    const [yearlyData, setYearlyData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://kimnganhoanbeta.azurewebsites.net/api/Dashboard/orders-and-revenue-to-current-month', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setYearlyData(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu', error);
            }
        };

        fetchData();
    }, [token]);

    const data = {
        labels: yearlyData.map(entry => formatMonth(entry.month)),
        datasets: [
            {
                label: 'Tổng doanh thu',
                data: yearlyData.map(entry => entry.totalRevenue),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                yAxisID: 'y1',
            },
            {
                label: 'Tổng số đơn hàng',
                data: yearlyData.map(entry => entry.totalOrders),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                yAxisID: 'y2',
            },
        ],
    };

    const options = {
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Tổng doanh thu'
                }
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Tổng số đơn hàng'
                },
                grid: {
                    drawOnChartArea: false,
                },
            }
        }
    };

    return (
        <div>
            <Line data={data} options={options} />
            <h5 className="text-center mt-3 fw-bold chart-title">Biểu đồ doanh thu cửa hàng theo từng tháng trong năm</h5>
        </div>
    );
};

export default ChartYear;
