import React, {useState, useEffect} from 'react';
// import { DataGrid } from '@mui/x-data-grid';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';


export default function LoginAttempts({ auth, attempts, notifications }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [open, setOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [locationData, setLocationData] = useState({});

    const handleCloseSuccess = () => {
        setSuccessOpen(false);
        setSuccess(null);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setError(null);
    };

    const handleBlockIP = async (AttemptID) => {
      try {
        const response = await axios.post(`/blockAttempt/${AttemptID}`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
            
        if (response.data.errors) {
          // Handle errors
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          // Handle success
          setSuccess(response.data.success);
          setSuccessOpen(true);
          // refreshData(); // Assuming refreshData is a function to update the data
        }
      } catch (error) {
        // Handle errors
        setError(error.message || 'Whoops, something went wrong blocking the IP');
        setErrorOpen(true);
      }
    };

    const deleteFailedAttempt = async (loginID) => {
      try {
        const response = await axios.delete(`/deleteFailedAttempt/${loginID}`, {}, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
      
        if (response.data.errors) {
          // Handle errors
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          // Handle success
          setSuccess(response.data.success);
          setSuccessOpen(true);
          // refreshData(); // Assuming refreshData is a function to update the data
        }
      } catch (error) {
        // Handle errors
        setError(error.message || 'Whoops, something went wrong deleting the IP');
        setErrorOpen(true);
      }
      
    };


  // Transform attempts data into rows
  const rows = attempts.map((attempt, index) => ({
    id: index + 1,
    AttemptID: attempt.loginID,
    Email: attempt.email_used,
    IPAddress: attempt.client_ip,
    UserAgent: attempt.user_agent,
    isBlocked: attempt.is_blocked, 
    locationData: attempt.location_information,
    googleMapsLink: attempt.google_maps_link,
    googleEarthLink: attempt.google_earth_link,
    created_at: attempt.created_at
  }));

  return (
    <AdminLayout
    user={auth}
    notifications={notifications}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Failed Login Attempts</h2>}
  >
 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
  <h1 className="text-center mb-5 font-black text-2xl dark:text-white">Failed Login Attempts</h1>
   {error && (
                        <Box   style={{
                          padding: '1rem',
                          maxHeight: '80vh',
                          overflowY: 'auto',
                          width: '100%'
                        }}>
                            <Collapse in={errorOpen}>
                                <Alert
                                    icon={<ErrorOutlineIcon fontSize="inherit" />}
                                    severity="error"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={handleCloseError}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {error}
                                </Alert>
                            </Collapse>
                        </Box>
                    )}

                    {success && (
                        <Box sx={{ width: '100%' }}>
                            <Collapse in={successOpen}>
                                <Alert
                                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                                    severity="success"
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={handleCloseSuccess}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {success}
                                </Alert>
                            </Collapse>
                        </Box>
                    )} 

  

      

<div className="relative overflow-x-auto">
    {attempts.length === 0 ? 
    <h1 className="text-center text-2xl mt-4 text-orange-500 dark:text-orange-400">No Failed Login Attempts Yet</h1>
    :
    <>
     <table className="w-full shadow-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-slate-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Attempt ID
                </th>
                <th scope="col" className="px-6 py-3">
                    Email Used
                </th>
                <th scope="col" className="px-6 py-3">
                    IP Address 
                </th>
                <th scope="col" className="px-6 py-3">
                    User Agent
                </th>
                <th scope="col" className="px-6 py-3">
                    Attempt Made On
                </th>

                <th scope="col" className="px-6 py-3">
                    Block Attempt 
                </th>

                <th scope="col" className="px-6 py-3">
                    Delete Attempt
                </th>

                <th scope="col" className="px-6 py-3">
                   Approximate Location 
                </th>

                <th scope="col" className="px-6 py-3">
                   Google Maps 
                </th>

                <th scope="col" className="px-6 py-3">
                   Google Earth 
                </th>

            </tr>
        </thead>
        <tbody>
        {rows.map(row => (
                <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {row.AttemptID}
                    </td>
                    <td className="px-6 py-4">
                        {row.Email}
                    </td>
                    <td className="px-6 py-4">
                        {row.IPAddress}
                    </td>
                    <td className="px-6 py-4">
                        {row.UserAgent}
                    </td>
                    <td className="px-6 py-4">
                    {new Date(row.created_at).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                    </td>
                    <td className="px-6 py-4">
                    {row.isBlocked === 1 ? 
                     <span className="text-orange-500">IP Address Blocked</span>
                     :
                    <button onClick={()=>handleBlockIP(row.AttemptID)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                      Block 
                    </button>
                    }
                    
                    </td>

                    <td className="px-6 py-4">
                    <button onClick={()=>deleteFailedAttempt(row.AttemptID)} className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                      Delete 
                    </button>
                    </td>

                    <td className="px-6 py-4">
                                      {row.locationData ? row.locationData : 'Not Available'}
                     </td>

                     <td className="px-6 py-4">
                     <a href={`${row.googleMapsLink}`} className="text-blue-500 dark:text-blue-400 font-bold underline" rel="noreferrer noopener" target="_blank">Google Maps</a>
                     </td>

                     <td className="px-6 py-4">
                     <a href={`${row.googleEarthLink}`} className="text-blue-500 dark:text-blue-400 font-bold underline" rel="noreferrer noopener" target="_blank">Google Earth</a>
                     </td>
                </tr>
            ))}

            {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                    White
                </td>
                <td className="px-6 py-4">
                    Laptop PC
                </td>
                <td className="px-6 py-4">
                    $1999
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                </th>
                <td className="px-6 py-4">
                    Black
                </td>
                <td className="px-6 py-4">
                    Accessories
                </td>
                <td className="px-6 py-4">
                    $99
                </td>
            </tr> */}
        </tbody>
    </table>
    </>
    }
   
</div>

    </div>
    </AdminLayout>
  );
}
