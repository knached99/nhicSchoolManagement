import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Zoom from '@mui/material/Zoom';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


export default function ParentsTable({auth}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetch('/fetchParents', {
          method: 'GET', 
        });
        const { parents, error } = await response.json();

        if (error) {
          setError(error);
        } else if (parents) {
          setRows(parents.map(row => ({ ...row, id: row.user_id })));
        } else {
          setError('Unexpected response format from the server');
        }

        setLoading(false);
      } catch (error) {
        setError('Error fetching parents: ' + error.message);
        setLoading(false);
      }
    };

    fetchParents();
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
      const response = await fetch('/fetchParents');
      const { parents, error } = await response.json();

      if (error) {
        setError(error);
      } else if (parents) {
        setRows(parents.map(row => ({ ...row, id: row.user_id })));
      } else {
        setError('Unexpected response format from the server');
      }

      setLoading(false);
    } catch (error) {
      setError('Error fetching parents: ' + error.message);
      setLoading(false);
    }
  };
  
  const deleteAllParents = async () => {
    try {
        const response = await axios.delete(`/deleteParents`);
  
        if (response.data.errors) {
            setError(response.data.errors);
            setErrorOpen(true);
        } else if (response.data.success) {
            setSuccess(response.data.success);
            setSuccessOpen(true);
            refreshData();
  
        }
    } catch (error) {
        setError(error.message || 'An error occurred deleting your parents');
        setErrorOpen(true);
    } finally {
        setSubmitting(false);
    }
  };

  const deleteParent = async (user_id) => {
    try {
        const response = await axios.delete(`/deleteParent/${user_id}`);

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

const viewParentDetails = (user_id) => {
  window.location.href = `/parent/${user_id}/view`;
}

const columns = [
  { field: 'user_id', headerName: 'Parent ID', width: 120 },
  { field: 'name', headerName: 'Name', width: 120 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'email_verified_at',
    headerName: 'Email Verification',
    width: 200,
    renderCell: (params) => (
      params.row.email_verified_at === null ? (
        <span className="py-1 px-3 no-underline rounded-full bg-red-400 text-white font-sans font-semibold text-sm border-red-100 hover:text-white hover:bg-blue-light focus:outline-none active:shadow-none mr-2">
          Unverified
        </span>
      ) : (
        <span className="py-1 px-3 no-underline rounded-full bg-emerald-500 text-white font-sans font-normal text-sm border-green-100 hover:text-white hover:bg-green-light focus:outline-none active:shadow-none mr-2">
          Verified
        </span>
      )
    )
  },
  
  {
    field: 'created_at',
    headerName: 'Account Created At',
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
      <Tooltip title={`${params.row.first_name} ${params.row.last_name}'s details`}>
        <IconButton className="hover:text-emerald-500" onClick={() => viewParentDetails(params.row.user_id)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    ),
  },
  
  {
    field: 'delete',
    headerName: 'Delete',
    width: 120, 
    renderCell: (params) => (
      <Tooltip title={`Delete ${params.row.name} from the system`}>
        <IconButton disabled={!auth.role==='Admin'} className="hover:text-red-500" onClick={()=> deleteParent(params.row.user_id)}>
          <DeleteOutlineOutlinedIcon/>
        </IconButton>
      </Tooltip>
    )
  }
];

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl">Parents</h1>
  
{rows.length === 0 ? (
  // No data, do not display the button
  <></>
) : (
  // There is data
  auth.faculty && auth.faculty.role === 'Admin' && (
    <>
      <Tooltip title="Once you delete all of your parents, there is no going back as this action will delete all of your parents and their associated data." arrow TransitionComponent={Zoom}>
        <Button variant="contained" style={{ backgroundColor: '#ef4444', marginBottom: 20 }} onClick={deleteAllParents}>
          Delete All Parents
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
          <div className="flex items-center justify-center h-40">
            <CircularProgress color="secondary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">No Parents in the system</div>
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