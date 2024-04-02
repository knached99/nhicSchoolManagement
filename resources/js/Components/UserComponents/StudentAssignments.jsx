import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

export default function StudentAssignments({ studentID }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/fetchStudentAssignments/${studentID}`);
        const { assignments, error } = await response.json();

        if (error) {
          setError(error);
        } else if (assignments) {
          // Map over assignments and format data for display
          const formattedAssignments = assignments.map((assignment) => ({
            id: assignment.assignment_student_id,
            assignment_id: assignment.assignment.assignment_id,
            assignment_name: assignment.assignment.assignment_name,
            assignment_due_date: new Date(assignment.assignment.assignment_due_date).toLocaleString(),
          }));
          setRows(formattedAssignments);
        } else {
          setError('Unexpected response format from the server');
        }

        setLoading(false);
      } catch (error) {
        setError('Error fetching assignments: ' + error.message);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    setIsDarkMode(prefersDarkMode);
  }, []);

  const backgroundColor = isDarkMode ? '#000' : 'background.paper';

  const handleCloseError = () => {
    setErrorOpen(false);
    setError(null);
  };

  const viewAssignmentDetails = (studentID, assignmentID) => {
    window.location.href = `/student/studentassignment/${studentID}/${assignmentID}`;
  }
  


  const columns = [
    // { field: 'assignment_id', headerName: 'Assignment ID', width: 120 },
    { field: 'assignment_name', headerName: 'Assignment', width: 200 },
    {
      field: 'assignment_due_date',
      headerName: 'Due Date',
      width: 200,
    },
    {
        field: 'view',
        headerName: 'View Assignment',
        renderCell: (params) => (
            <Tooltip title="View Assignment Details" arrow>
              <IconButton className="hover:text-emerald-500" onClick={() => viewAssignmentDetails(studentID, params.row.assignment_id)}>
                <VisibilityOutlinedIcon className="dark:text-white"/>
              </IconButton>
            </Tooltip>
          ),
          width: 150,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="dark:bg-slate-800 bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl dark:text-white">Assignments</h1>

        {error && (
          <Box
            style={{
              padding: '1rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              width: '100%',
            }}
          >
            <Collapse in={errorOpen}>
              <Alert
                icon={<ErrorOutlineIcon fontSize="inherit" />}
                severity="error"
                action={
                  <IconButton aria-label="close" color="inherit" size="small" onClick={handleCloseError}>
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

        {/* Table Section */}
        {loading ? (
          <CircularProgress color="primary" />
        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">No assignments associated with this student</div>
        ) : (
          <Paper sx={{ width: '100%', backgroundColor }}>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                sx={{ backgroundColor: isDarkMode ? '#334155' : 'inherit', color: isDarkMode ? '#fff' : 'inherit' }}
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
