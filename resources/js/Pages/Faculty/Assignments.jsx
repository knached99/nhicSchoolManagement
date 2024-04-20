import React, {useState, useEffect} from 'react'
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import UploadAssignmentModal from '@/Components/AdminComponents/UploadAssignmentModal';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from '@inertiajs/react';

// DataTable 

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


export default function Assignments({auth, notifications}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

const columns = [
  {id: 'assignment_id', label: 'Assignment ID', minWidth: 50},
  {id: 'assignment_name', label: 'Assignment', minWidth: 50},
  {id: 'assignment_description', label: 'Description', minWidth: 80},
  {id: 'assignment_due_date', label: 'Due Date', minWidth: 80},
  {id: 'view', label: 'Assignment Details', minWidth: 80},
  {id: 'delete', label: 'Delete Assignment', minWidth: 80}
  ];

  const getAssignments = async () => {
    try{
      const response = await axios.get('/getAssignments');
      const { assignments, error } = response.data;
            if(error){
        throw new Error(error);
      }
      return assignments || [];
    }
    catch(error){
      throw new Error(`Something went wrong: ${error.message}`);
    }
  };

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const assignments = await getAssignments();
        setRows(assignments);
        setLoading(false);
      }
      catch(error){
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [success]);


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

const refreshData = async () => {
  setLoading(true);
  try {
    const response = await axios.get('/getAssignments');
    const { assignments, error } = await response.data;

    if (error) {
      setError(error);
    } else if (assignments) {
      setRows(assignments.map(row => ({ ...row, id: row.assignment_id })));
    } else {
      setError('Unexpected response format from the server');
    }

    setLoading(false);
  } catch (error) {
    setError('Error fetching assignments: ' + error.message);
    setLoading(false);
  }
};


const deleteAssignment = async (assignment_id) => {
  try {
      const response = await axios.delete(`/deleteAssignment/${assignment_id}`);

      if (response.data.errors) {
          setError(response.data.errors);
          setErrorOpen(true);
      } else if (response.data.success) {
          setSuccess(response.data.success);
          setSuccessOpen(true);
          refreshData();

      }
  } catch (error) {
      setError(error.message || 'An error occurred deleting that student');
      setErrorOpen(true);
  } finally {
      setSubmitting(false);
  }
};


  return (
    <AdminLayout
    user={auth}
    notifications={notifications}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Assignments</h2>}
    >

    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="dark:bg-slate-600 bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <UploadAssignmentModal auth={auth} refreshData={refreshData}/>
            <h1 className="font-bold text-start text-2xl p-6 text-gray-900 dark:text-white">
            Assignments
            </h1>
            <p className="ml-4 mb-3 text-slate-800 dark:text-white">Assignments created are mass assigned to all of your students</p>

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
                 {/* Start Table Section */}
                 {loading ? (
          <CircularProgress color="primary"/>

        ) : rows.length === 0 ? (
          <div className="text-red-500 dark:text-red-400 text-2xl text-center p-3 m-3">
            No Assignments Uploaded Yet
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
                      <TableRow key={row.assignment_id}>                     
                      
                      <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>{row.assignment_id}</TableCell>

                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>{row.assignment_name}</TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          {row.assignment_description}
                        </TableCell>
                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          {new Date(row.assignment_due_date).toLocaleString()}
                        </TableCell>

                        <TableCell sx={{color: isDarkMode ? 'white' : 'inherit'}}>
                          <Link href={`/faculty/assignmentDetails/${row.assignment_id}`}>
                          <VisibilityOutlinedIcon/>
                          </Link>
                        </TableCell>

                        <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
                          <IconButton onClick={() => deleteAssignment(row.assignment_id)}>
                            <DeleteOutlineOutlinedIcon sx={{ color: isDarkMode ? 'white' : 'inherit' }} />
                          </IconButton>
                        </TableCell>

                       
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
                
                  {/* End Table Section */}       
            
          </div>
        </div>
    </div>

    </AdminLayout>
  )
}
