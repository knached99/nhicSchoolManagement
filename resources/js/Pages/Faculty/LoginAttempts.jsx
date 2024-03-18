import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';


export default function LoginAttempts({ auth, attempts }) {

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [open, setOpen] = useState(false);

    const handleCloseSuccess = () => {
        setSuccessOpen(false);
        setSuccess(null);
    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setError(null);
    };

    const handleBlockIP = async (clientIp) => {
        try {
          const response = await axios.post(`/blockIP/${clientIp}`, {}, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          console.log(response); // Log the entire response to the console
        
          if (response.data.errors) {
            // Handle errors
            setError(response.data.errors);
            setErrorOpen(true);
          } else if (response.data.success) {
            // Handle success
            setSuccess(response.data.success);
            setSuccessOpen(true);
            refreshData(); // Assuming refreshData is a function to update the data
          }
        } catch (error) {
          // Handle errors
          console.error(error);
          setError(error.message || 'Whoops, something went wrong blocking the IP');
          setErrorOpen(true);
        }
      };
      
      

  const columns = [
    { field: 'AttemptID', headerName: 'Attempt ID', width: 130 },
    { field: 'Email', headerName: 'Email Used', width: 200 },
    { field: 'IPAddress', headerName: 'IP Address', width: 200 },
    { field: 'UserAgent', headerName: 'User Agent', width: 1000 },
    {
        field: 'Block',
        headerName: 'Block',
        width: 200,
        renderCell: (params) => (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleBlockIP(params.row.client_ip)}
          >
            Block IP
          </Button>
        ),
      }
       ];

  // Transform attempts data into rows
  const rows = attempts.map((attempt, index) => ({
    id: index + 1,
    AttemptID: attempt.loginID,
    Email: attempt.email_used,
    IPAddress: attempt.client_ip,
    UserAgent: attempt.user_agent,
  }));

  return (
    <AdminLayout
    user={auth}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Faculty Dashboard</h2>}
  >
    <div style={{ height: 400, width: '100%' }}>
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

      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
    </AdminLayout>
  );
}