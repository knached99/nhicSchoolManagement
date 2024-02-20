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

export default function MyAttendanceTable({ auth }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [successOpen, setSuccessOpen] = useState(true);
  const [errorOpen, setErrorOpen] = useState(true);

  const handleAttendanceChange = (id, value) => {
    // Update the is_present field in the corresponding row
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, is_present: value } : row
    );
    setRows(updatedRows);
  };

  // const handleReasonChange = (id, value) => {
  //   const updatedRows = rows.map((row) =>
  //     row.id === id ? { ...row, reason_for_absence: value } : row
  //   );
  
  //   console.log("Updated Rows after Reason Change:", updatedRows);
  
  //   setRows(updatedRows);
  // };
  
  



const handleAttendanceSubmission = async () => {
    try {
      console.log("Rows before submission:", rows);
  
      const response = await axios.post(`/submitAttendance/${auth.faculty.faculty_id}`, {
        attendanceData: rows.map(row => ({
          student_id: row.student_id,
          is_present: row.is_present,
        })),
      });
      
      console.log("Response from backend:", response.data);
  
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
      const studentsResponse = await fetch('/getMyStudents');
      const { students: studentData, error: studentError } = await studentsResponse.json();

      if (studentError) {
        setError(studentError);
        setLoading(false);
        return;
      }

      // Fetch attendance data
      const attendanceResponse = await fetch(`/getAttendance/${auth.faculty.faculty_id}`);
      const { attendance: attendanceData, error: attendanceError } = await attendanceResponse.json();

      if (attendanceError) {
        setError(attendanceError);
        setLoading(false);
        return;
      }

      // Merge student and attendance data based on student_id
      const mergedRows = studentData.map(student => {
        const correspondingAttendance = attendanceData.find(attendance => attendance.student_id === student.student_id);
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
}, []); // Empty dependency array to ensure the effect runs only once when the component mounts

const isAttendanceTaken = rows.some(row => row.is_present !== undefined);

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
            params.row.is_present === undefined ? (
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
            ) : (
              // Display "Present" or "Absent" based on the value in the row
              <div>{params.row.is_present === 1 ? 'Present' : 'Absent'}</div>
            )
          )}
        </div>
      ),
    },
    // {
    //   field: 'reason_for_absence',
    //   headerName: 'Reason For Absence (if absent)',
    //   width: 300,
    //   height: 400,
    //   renderCell: (params) => (
    //     <div>
    //       {params.attendanceData ? (
    //         <div className="m-3 p-2">
    //           {params.row.reason_for_abscence} {/* Fix the typo here */}
    //         </div>
    //       ) : (
    //         <Textarea
    //           variant="outlined"
    //           size="lg"
    //           value={params.attendanceData ? params.attendanceData.reason_for_abscence : params.value}
    //           onChange={(e) => handleReasonChange(params.id, e.target.value)}
    //           minRows={3}
    //           style={{ width: '100%' }}
    //           readOnly={params.attendanceData !== undefined} // Make the textarea read-only if attendance data exists
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    
    
    
  ];

  
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
      <h1 className="m-3 text-center font-black text-xl">Attendance For {new Date().toLocaleDateString()}</h1>

        <Paper sx={{width: '100%', backgroundColor: '#fff'}}>
     
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={10}
      />
      </Paper>
      <Button
          variant="contained"
          color="primary"
          onClick={handleAttendanceSubmission}
          style={{marginTop: 20, float: 'right'}}
          disabled={isAttendanceTaken}
        >
          Submit Attendance
        </Button>
    </div>
    </div>
  );
}
