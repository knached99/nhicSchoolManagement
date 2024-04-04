import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import CircularProgress from '@mui/material/CircularProgress';

export default function PieChart({ studentsData, parentsData, facultyData }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (studentsData && parentsData && facultyData) {
            const data = {
                labels: ['Students', 'Parents', 'Faculty'],
                datasets: [
                    {
                        data: [studentsData, parentsData, facultyData],
                        backgroundColor: [
                            '#3b82f6',  // Blue
                            '#fbbf24',  // Yellow
                            '#10b981'   // Green
                        ],
                        hoverBackgroundColor: [
                            '#2c6ed5',  // Darker Blue
                            '#dea123',  // Darker Yellow
                            '#0e8a66'   // Darker Green
                        ]
                    }
                ]
            }
            const options = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true
                        }
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
            setLoading(false); // Set loading to false once data is loaded
        }
    }, [studentsData, parentsData, facultyData]);
    return (
        <div className="card flex justify-content-center">
            <h5 className="dark:text-slate-200 text-black text-xl">All Users</h5>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {loading ? <CircularProgress/> : <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />}
            </div>
        </div>
    )
}
