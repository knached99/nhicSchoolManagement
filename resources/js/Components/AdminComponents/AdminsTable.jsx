import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Box from '@mui/material/Box';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';



const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 80 },
  { id: 'email', label: 'Email', minWidth: 80 },
  { id: 'phone_number', label: 'Phone Number', minWidth: 80 },
  { id: 'role', label: 'Role', minWidth: 80 },
  {id: 'created_at', label: 'Created At', minWidth: 80},
  { id: 'view', label: 'View', minWidth: 80 },
  {field: 'delete', label: 'Delete', minWidth: 80}
];


export default function AdminsTable({auth}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const profilePicPath = "http://localhost:8000/storage/profile_pics"; 

  const viewFacultyDetails = (userID) => {
    window.location.href = `/faculty/profile/${userID}/view`;
  }
  
const deleteAdminUser = async (userId) => {
  try {
    const response = await axios.delete(`/deleteFacultyUser/${userId}`);

    if (response.data.success) {
      setRows(await fetchFacultyUsers());
      setSuccess(response.data.success);
      setSuccessOpen(true);
    } else {
      setError(response.data.error);
      setErrorOpen(true);
    }
  } catch (error) {
    setError(`Error deleting admin user: ${userId} because: ${error.message}`);
    setErrorOpen(true);
  }
};

    const fetchFacultyUsers = async () => {
      try {
        const response = await fetch('/fetchFacultyUsers');
        const { admins, error } = await response.json();
    
        if (error) {
          throw new Error(error);
        }
    
        return admins || [];
      } catch (error) {
        throw new Error('Error fetching faculty users: ' + error.message);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const facultyUsers = await fetchFacultyUsers();
          setRows(facultyUsers);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      // Check if the system is in dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
      setIsDarkMode(prefersDarkMode);
    }, []);
    
    const backgroundColor = isDarkMode ? '#1e293b' : 'background.paper';
  

    const handleCloseSuccess = () => {
      setSuccessOpen(false);
      setSuccess(null);
  };

  const handleCloseError = () => {
      setErrorOpen(false);
      setError(null);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  
  

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="dark:bg-slate-800 bg-white p-5 rounded overflow-hidden sm:rounded-lg">
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
        <h1 className="m-3 text-center font-black text-xl dark:text-white">Team Members</h1>
      

        {/* Table Section */}
        {loading ? (
          <CircularProgress color="primary"/>

        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">
            No Team Members Invited Yet
          </div>
        ) : (
            <Paper sx={{ width: '100%', backgroundColor: isDarkMode ? '#334155' : 'inherit' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell  sx={{ color: isDarkMode ? 'white' : 'inherit' }} key={column.id}>{column.label} </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(rows) &&
                    rows.map((row, index) => (
                      <TableRow key={row.faculty_id}>

                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>{row.faculty_id}</TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                        {row.profile_pic ? (
                          <>
                        <Avatar alt="Profile Picture" src={`${profilePicPath}/${row.profile_pic}`} sx={{ width: 50, height: 50 }} />

                            <h1 className="font-semibold">{row.name}</h1>
                          </>
                        ) : (
                          <>
                    <Avatar sx={{width: 50, height: 50}} {...stringAvatar(row.name)} />
                    <h1 className="font-semibold">{row.name}</h1>
                          </>
                        )}
                      </TableCell>

                         
                      
                          
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>{row.email}</TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          {row.phone ? row.phone : 'N/A'}
                        </TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>{row.role}</TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          {new Date(row.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          <Tooltip title={`${row.name}'s details`}>
                            <IconButton
                              sx={{color: isDarkMode ? 'white' : 'inherit'}}
                              className="hover:text-emerald-500"
                              onClick={() => viewFacultyDetails(row.faculty_id)}
                              disabled={row.faculty_id === auth.faculty.faculty_id}
                            >
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                         
                        </TableCell>

                       
                                
                                <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                                <Tooltip
                                title={`Delete ${row.name} from the system`}
                              >
                                <IconButton 
                                sx={{color: isDarkMode ? 'white' : 'inherit'}}
                                className="hover:text-red-500" onClick ={()=>deleteAdminUser(row.faculty_id)}
                                  disabled={/* Add a condition for disabling */ row.faculty_id === auth.faculty.faculty_id || auth.faculty.role !== 'Admin'}
                                >
                                  <DeleteOutlineOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                                    </TableCell>
                           
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>
    </div>
  );
}