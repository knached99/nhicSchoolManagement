import React, { useState, useEffect } from 'react';
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
import Textarea from '@mui/joy/Textarea';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function MyAttendanceTable({auth, facultyID}) {

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [successOpen, setSuccessOpen] = useState(true);
  const [errorOpen, setErrorOpen] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleAttendanceChange = (id, value) => {
    // Update the is_present field in the corresponding row
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, is_present: value } : row
    );
    setRows(updatedRows);
  };


  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccess(null);
};

const handleCloseError = () => {
    setErrorOpen(false);
    setError(null);
};



const handleAttendanceSubmission = async () => {
    try {
      console.log("Rows before submission:", rows);
  
      const response = await axios.post(`/submitAttendance/${facultyID ? facultyID : auth}`, {
        attendanceData: rows.map(row => ({
          student_id: row.student_id,
          is_present: row.is_present,
        })),
      });
      
  
      // Assuming the response directly contains the success or error message
      const { success, error } = response.data;
  
      if (success) {
        setSuccess(success);
        setSuccessOpen(true);
      } else if (error) {
        setError(error);
        setErrorOpen(true);
      }
    } catch (error) {
      setError(`Something went wrong submitting attendance: ${error.message}`);
    }
  };


  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        // Fetch students
        const studentsResponse = await fetch(`/showStudentsForTeacher/${facultyID ? facultyID : auth}}`);
        const { students: studentData, error: studentError } = await studentsResponse.json();

        if (studentError) {
          setError(studentError);
          setLoading(false);
          return;
        }

        // Fetch attendance data
        const attendanceResponse = await fetch(`/getAttendance/${facultyID ? facultyID : auth}`);
        const { attendance: fetchedAttendanceData, error: attendanceError } = await attendanceResponse.json();

        if (attendanceError) {
          setError(attendanceError);
          setLoading(false);
          return;
        }

        setAttendanceData(fetchedAttendanceData);

        // Merge student and attendance data based on student_id
        const mergedRows = studentData.map(student => {
          const correspondingAttendance = fetchedAttendanceData.find(attendance => attendance.student_id === student.student_id);
          return { ...student, ...correspondingAttendance, id: student.student_id };
        });

        setRows(mergedRows);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, [success]);


  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);
  }, []);
  
  const backgroundColor = isDarkMode ? '#000' : 'background.paper';

  const isAttendanceTaken = attendanceData && attendanceData.length > 0;
  const columns = [
    { field: 'student_id', headerName: 'Student ID', width: 120 },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    {
      field: 'is_present',
      headerName: 'Attendance Status',
      width: 200,
      renderCell: (params) => (
        <div>
          {params.attendanceData ? (
            // Display "Present" or "Absent" based on existing attendance data
            <div>{params.attendanceData.is_present === 1 ? 'Present' : 'Absent'}</div>
          ) : (
            // Display radio buttons if no existing attendance data
            params.row.is_present === undefined  && auth === params.row.faculty_id ? (
              <>              
                <>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={params.value === 1}
                        onChange={(e) => handleAttendanceChange(params.id, 1)}
                        value={1}
                        name={`attendance-radio-${params.id}`}
                      />
                    }
                    label="Present"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={params.value === 0}
                        onChange={(e) => handleAttendanceChange(params.id, 0)}
                        value={0}
                        name={`attendance-radio-${params.id}`}
                      />
                    }
                    label="Absent"
                  />
                </>
              
            </>
            
            ) : (
              // Display "Present" or "Absent" based on the value in the row
              <div>{params.row.is_present ===1 &&  
                <span class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-md font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">Present</span> 
                || params.row.is_present ===0 && 
                <span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-md font-medium text-red-700 ring-1 ring-inset ring-red-700/10">Absent</span>
              
                || params.row.is_present === undefined && 
                <span class="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-md font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10">N/A</span>
                }</div>
            )
          )}
        </div>
      ),
    },
    
    
    
  ];

  
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="dark:bg-black bg-white p-5 rounded overflow-hidden sm:rounded-lg">
      <h1 className="m-3 text-center font-black text-xl dark:text-white">Attendance For {new Date().toLocaleDateString()}</h1>
      {error && (
                            <Box sx={{ width: '100%' }}>
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

        <Paper sx={{width: '100%'}}>
     
      <DataGrid
        sx={{backgroundColor: backgroundColor,
        color: isDarkMode ? '#fff' : 'inherit'
        }}
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={10}
         pagination
        rowsPerPageOptions={[5, 10, 20]}
      />
      </Paper>
      {!isAttendanceTaken && rows.every(row => row.faculty_id === auth) ? (
      <Button
      variant="contained"
      color="primary"
      onClick={handleAttendanceSubmission}
      style={{marginTop: 20, float: 'right'}}
    >
      Submit Attendance
    </Button>
      ) :
      null
      }
      
    </div>
    </div>
  );
}