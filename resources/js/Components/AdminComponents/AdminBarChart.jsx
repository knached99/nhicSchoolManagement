import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function AdminBarChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch('/getGradesForAllStudents');
                const { grades } = await response.json();

                const data = {
                    labels: Object.keys(grades), // Months as labels
                    datasets: [{
                        label: 'Average Grades',
                        backgroundColor: '#818cf8', // Adjust as needed
                        borderColor: '#818cf8', // Adjust as needed
                        borderWidth: 1,
                        hoverBackgroundColor: '#a5b4fc', // Adjust as needed
                        hoverBorderColor: '#a5b4fc', // Adjust as needed
                        data: Object.values(grades)
                    }]
                };

                setChartData(data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, []);

    useEffect(() => {
        // Set chart options here if needed
        const options = {
            // Add your chart options here
        };

        setChartOptions(options);
    }, []);

    return (
        <div className="card">
            <h5 className="dark:text-slate-200 text-black text-xl">Average Grades for all students</h5>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
    );
}








