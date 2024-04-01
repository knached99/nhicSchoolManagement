import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function DynamicChart({ facultyData, studentsData, parentsData, type }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);


  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);
  }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
       // const textColor = documentStyle.getPropertyValue('--text-color');
       const textColor = isDarkMode ? '#fff' : 'inherit';
       const textColorSecondary = isDarkMode ? '#fff' : 'inherit';
       const surfaceBorder = isDarkMode ? '#fff' : '#94a3b8';
        // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        // const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Faculty Data',
                    fill: false,
                    borderColor: '#0069D9', // Blue color
                    yAxisID: 'y',
                    tension: 0.4,
                    data: facultyData,
                },
                {
                    label: 'Students Data',
                    fill: false,
                    borderColor: '#28A745', // Green color
                    yAxisID: 'y1',
                    tension: 0.4,
                    data: studentsData,
                },
                {
                    label: 'Parents Data',
                    fill: false,
                    borderColor: '#DC3545', // Red color
                    yAxisID: 'y1',
                    tension: 0.4,
                    data: parentsData,
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [facultyData, studentsData, parentsData]);

    return (
        <div className="card">
            <Chart type={type} data={chartData} options={chartOptions} />
        </div>
    )
}
