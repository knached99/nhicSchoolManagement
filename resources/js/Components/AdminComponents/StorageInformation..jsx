import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import StorageIcon from '@mui/icons-material/Storage';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import PortraitOutlinedIcon from '@mui/icons-material/PortraitOutlined';

export default function StorageInformation({ totalSize, logsSize, wallpaperSize, profilePicsSize, storageLeft, totalFiles, logFiles, wallpaperFiles, profileFiles }) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Total Files', 'Log Files', 'Wallpaper Files', 'Profile Picture Files'],
            datasets: [
                {
                    data: [totalFiles, logFiles, wallpaperFiles, profileFiles ],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ]
                }
            ]
        };
        const options = {
            // Add any options if needed
        };

        setChartData(data);
        setChartOptions(options);
    }, [totalFiles, logFiles, wallpaperFiles, profileFiles ]);

    return (
        <div className="card">
            <h6 className="dark:text-slate-200 text-xl">Storage Usage (Approximate)</h6>
            <div className="m-3">
                <ul class="max-w-md space-y-1 text-black list-disc list-inside dark:text-gray-100">
                    <li><StorageIcon /> Total Storage Used: {totalSize}</li>
                    <li><StorageIcon /> Available Free Space: {storageLeft}</li>
                    <li><ForestOutlinedIcon /> Logs Storage Used: {logsSize}</li>
                    <li><WallpaperIcon /> Wallpaper-Pics Storage Used: {wallpaperSize}</li>
                    <li><PortraitOutlinedIcon /> Profile-Pics Storage Used: {profilePicsSize}</li>
                    <h6 className="dark:text-slate-200 text-black text-lg">Number of Files</h6>
                    <li>Total Files: {totalFiles}</li>
                    <li>Log Files: {logFiles}</li>
                    <li>Wallpaper Pics: {wallpaperFiles}</li>
                    <li>Profile Pics: {profileFiles}</li>
                </ul>
            </div>
            {/* <div className="card flex justify-content-center"> */}
         
                {/* <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" /> */}
            {/* </div> */}
        </div>
    );
}
