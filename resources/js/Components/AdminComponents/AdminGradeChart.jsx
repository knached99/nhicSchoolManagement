import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import Paper from '@mui/material/Paper';
import { date } from 'yup';

export default function AdminGradeChart({studentID, firstName, lastName}) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
    }, []);
      
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(`/getGradesForStudent/${studentID}`);
                const { grades } = await response.json();
    
                // Process grades to format data for chart
                const labels = grades.map(grade => {
                    // Assuming 'created_at' holds the date in ISO format (e.g., "2024-04-01T20:20:34.000000Z")
                    const date = new Date(grade.created_at);
                    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`; // Format date using native API
                });
                const data = grades.map(grade => grade.grade); // Assuming 'grade' holds the grade value
    
                const chartData = {
                    labels,
                    datasets: [
                        {
                            label: `Grades for ${firstName} ${lastName}`,
                            data,
                            fill: false,
                            borderColor: isDarkMode ? '#38bdf8' : '#0ea5e9',
                            tension: 0.4
                        }
                    ]
                };
    
                setChartData(chartData);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };
    
        fetchGrades();
    }, [isDarkMode, studentID, firstName, lastName]);
    
    useEffect(() => {
        const textColor = isDarkMode ? '#fff' : 'inherit';
        const textColorSecondary = isDarkMode ? '#fff' : 'inherit';
        const surfaceBorder = isDarkMode ? '#38bdf8' : '#0ea5e9';

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
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartOptions(options);
    }, [isDarkMode]);

    return (
        <Paper style={{width: '100%', backgroundColor: isDarkMode ? '#334155' : 'background.paper' }}>
            <div className="card">
                <h5 className="text-slate-600 dark:text-white font-medium text-lg">These grades are for this current month</h5>
                <Chart type="line" data={chartData} options={chartOptions} />
            </div>
        </Paper>
    );
}
