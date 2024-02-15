import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddStudentModal from '@/Components/AdminComponents/AddStudentModal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';


export default function MyStudentsTable({auth}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);

  const viewStudentDetails = (student_id) => {
  window.location.href = `/student/${student_id}/view`;
}

  const columns = [
    { field: 'student_id', headerName: 'Student ID', width: 120 },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'parent_guardian_email', headerName: 'Parent/Guardian Email', width: 200 },
    { field: 'date_of_birth', headerName: 'Date Of Birth', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    {field: 'street_address_2', headerName: 'Apt/Unit', width: 150},
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
    },    {
    field: 'details',
    headerName: 'Details',
    width: 120,
    renderCell: (params) => (
      <Tooltip title={`${params.row.first_name} ${params.row.last_name}'s details`}>
        <IconButton className="hover:text-emerald-500" onClick={() => viewStudentDetails(params.row.student_id)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    ),
  },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 80,
      renderCell: (params) => {
        if (auth.faculty && auth.faculty.role === 'Admin') {
          return (
            <Tooltip title={`Delete ${params.row.first_name} ${params.row.last_name} from the system`}>
              <IconButton className="hover:text-red-500" onClick={() => deleteStudent(params.row.student_id)}>
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
          );
        } else {
          // Render a disabled button or any other representation for no permissions
          return (
            <Tooltip title="You do not have permission to delete students">
              <span>
                <IconButton className="cursor-not-allowed" disabled>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </span>
            </Tooltip>
          );
        }
      },
    },
  ];
  

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/getMyStudents');
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
      const response = await fetch('/getMyStudents');
      const { admins, error } = await response.json();

      if (error) {
        setError(error);
      } else if (admins) {
        setRows(admins.map(row => ({ ...row, id: row.student_id })));
      } else {
        setError('Unexpected response format from the server');
      }

      setLoading(false);
    } catch (error) {
      setError('Error fetching students: ' + error.message);
      setLoading(false);
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

const deleteMyStudents = async () => {
  try {
      const response = await axios.delete(`/deleteMyStudents`);

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



  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl">My Students</h1>
        
        {auth.faculty && (
          (auth.faculty.role === 'Admin' ) && (
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
        auth.faculty && (
          auth.faculty.role === 'Admin' &&
           (
            <>
              <Tooltip title="Once you delete all of your students, there is no going back as this action will delete all of your students and their associated data." arrow TransitionComponent={Zoom} >
                <Button variant="contained" style={{ backgroundColor: '#ef4444', marginBottom: 20 }} onClick={deleteMyStudents}>
                  Delete All Students
                </Button>
              </Tooltip>
            </>
          )
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
          <div className="flex items-center justify-center h-40">
            <CircularProgress color="secondary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">You have not been any students yet, check back here later</div>
        ) : (
          <Paper sx={{ width: '100%', backgroundColor: '#fff' }}>
            <div style={{ height: 400, width: '100%' }}>
              
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                pagination
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
              />
            </div>
          </Paper>
        )}
      </div>
    </div>
  );

}