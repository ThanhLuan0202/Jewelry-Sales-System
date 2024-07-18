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

function formatDateTime(dateTimeString) {
    const options = {
        month: '2-digit', day: '2-digit'
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
}

const ChartToday = () => {
    const [weekRevenue, setWeekRevenue] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://kimnganhoanbeta.azurewebsites.net/api/Dashboard/daily-revenue-last-7-days', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setWeekRevenue(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu', error);
            }
        };

        fetchData();
    }, [token]);

    const data = {
        labels: weekRevenue.map(entry => formatDateTime(entry.date)),
        datasets: [
            {
                label: 'Doanh thu hàng ngày',
                data: weekRevenue.map(entry => entry.dailyRevenue),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                yAxisID: 'y1',
            },
            {
                label: 'Số đơn hàng',
                data: weekRevenue.map(entry => entry.totalOrders),
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
                    text: 'Doanh thu hàng ngày'
                }
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Số đơn hàng'
                },
                grid: {
                    drawOnChartArea: false, // Chỉ hiển thị lưới cho y1
                },
            }
        }
    };

    return (
        <div>
            <Line data={data} options={options} />
            <h5 className="text-center mt-3 fw-bold chart-title">Biểu đồ doanh thu cửa hàng 7 ngày gần nhất</h5>
        </div>
    );
};

export default ChartToday;
