import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddStudentModal from '@/Components/AdminComponents/AddStudentModal';
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


export default function StudentsTable({auth, path}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);



  const backgroundOpacity = auth.faculty && auth.faculty.wallpaper_pic || auth.wallpaper_pic ?  {
    opacity: 0.9
  }
  : null;


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(path, {
          method: 'GET', 
        });
        const { students, error } = await response.json();

        if (error) {
          setError(error);
        } else if (students) {
          setRows(students.map(row => ({ ...row, id: row.student_id })));
        } else {
          setError('Unexpected response format from the server');
        }

        setLoading(false);
      } catch (error) {
        setError('Error fetching students: ' + error.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);


  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);
  }, []);
  
  const backgroundColor = isDarkMode ? '#000' : 'background.paper';

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccess(null);
};

const handleCloseError = () => {
    setErrorOpen(false);
    setError(null);
};

  // Function to refresh the data
  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(path);
      const { students, error } = await response.json();

      if (error) {
        setError(error);
      } else if (students) {
        setRows(students.map(row => ({ ...row, id: row.student_id })));
      } else {
        setError('Unexpected response format from the server');
      }

      setLoading(false);
    } catch (error) {
      setError('Error fetching students: ' + error.message);
      setLoading(false);
    }
  };
  
  const deleteAllStudents = async () => {
    try {
        const response = await axios.delete(`/deleteAllStudents`);
  
        if (response.data.errors) {
            setError(response.data.errors);
            setErrorOpen(true);
        } else if (response.data.success) {
            setSuccess(response.data.success);
            setSuccessOpen(true);
            refreshData();
  
        }
    } catch (error) {
        setError(error.message || 'An error occurred deleting your students');
        setErrorOpen(true);
    } finally {
        setSubmitting(false);
    }
  };

  const deleteStudent = async (student_id) => {
    try {
        const response = await axios.delete(`/deleteStudent/${student_id}`);

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

const viewStudentDetails = (student_id) => {
  window.location.href = `/student/${student_id}/view`;
}


const columns = [
  // { field: 'student_id', headerName: 'Student ID', width: 300 },
  { field: 'first_name', headerName: 'First Name', width: 120 },
  { field: 'last_name', headerName: 'Last Name', width: 120 },
  {
    field: 'user_id',
    headerName: 'Parent/Guardian',
    width: 200,
    renderCell: (params) => (
      <div>
        {params.row.user && params.row.user.name ? params.row.user.name : 'N/A'}
      </div>
    ),
  }, 
  
  {
    field: 'faculty_id',
    headerName: 'Teacher',
    width: 200,
    renderCell: (params) => (
      <div>
      {params.row.faculty && params.row.faculty.name ? params.row.faculty.name : 'Unassigned'}
      </div>
    ),
  }, 
  
  { field: 'date_of_birth', headerName: 'Date Of Birth', width: 150 },
  { field: 'address', headerName: 'Address', width: 150 },
  {
    field: 'street_address_2',
    headerName: 'Street Address 2',
    width: 140,
    renderCell: (params) => (
      <div>
        {params.row.street_address_2 ? params.row.street_address_2 : 'N/A'}
      </div>
    ),
  },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'zip', headerName: 'Zip Code', width: 120 },
  { field: 'level', headerName: 'Level', width: 120 },
  {
    field: 'created_at',
    headerName: 'Uploaded At',
    width: 180,
    renderCell: (params) => (
      <span>
        {new Date(params.row.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
        })}
      </span>
    ),
  },  {
    field: 'details',
    headerName: 'Details',
    width: 120,
    renderCell: (params) => (
      <Tooltip title={`${params.row.first_name} ${params.row.last_name}'s details`} arrow>
        <IconButton disabled={auth.role === 'Teacher' || auth.role === 'Assistant Teacher'} className="hover:text-emerald-500" onClick={() => viewStudentDetails(params.row.student_id)}>
          <VisibilityOutlinedIcon className="dark:text-white"/>
        </IconButton>
      </Tooltip>
    ),
  },
  
  {
    field: 'delete',
    headerName: 'Delete',
    width: 120, 
    renderCell: (params) => (
      <Tooltip title={`Delete ${params.row.first_name} ${params.row.last_name} from the system`}>
        <IconButton  disabled={auth.role === 'Teacher' || auth.role === 'Assistant Teacher'} onClick={()=> deleteStudent(params.row.student_id)}>
          <DeleteOutlineOutlinedIcon sx={{ color: isDarkMode ? 'white' : 'inherit' }} />
        </IconButton>
      </Tooltip>
    )
  }
];

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="dark:bg-slate-800 bg-white p-5 rounded overflow-hidden sm:rounded-lg" style={backgroundOpacity}>
        <h1 className="m-3 text-center font-black text-xl dark:text-white">Students</h1>
        {auth.faculty && (
          (auth.faculty.role === 'Admin') && (
              <>
              <AddStudentModal refreshData={refreshData}/>

              </>
          )
      )}

{rows.length === 0 ? (
  // No data, do not display the button
  <></>
) : (
  // There is data
  auth.faculty && auth.faculty.role === 'Admin' && (
    <>
      <Tooltip title="Once you delete all of your students, there is no going back as this action will delete all of your students and their associated data." arrow TransitionComponent={Zoom}>
        <Button variant="contained" style={{ backgroundColor: '#ef4444', marginBottom: 20 }} onClick={deleteAllStudents}>
          Delete All Students
        </Button>
      </Tooltip>
    </>
  )
)}

     

      
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

        {/* Table Section */}
        {loading ? (
        <CircularProgress color="primary"/>

        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">No Students in the system</div>
        ) : (
          <Paper sx={{ width: '100%', backgroundColor}}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
              sx={{backgroundColor: isDarkMode ? '#334155' : 'inherit', color: isDarkMode ? '#fff' : 'inherit'}}
                rows={rows}
                columns={columns}
                pageSize={5}
                pagination
                rowsPerPageOptions={[5, 10, 20]}
              />
            </div>
          </Paper>
        )}
      </div>
    </div>
  );

}