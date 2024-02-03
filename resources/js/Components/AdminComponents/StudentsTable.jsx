import React, {useState, useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddStudentModal from '@/Components/AdminComponents/AddStudentModal';

const columns = [
  { field: 'student_id', headerName: 'Student ID', width: 120 },
  { field: 'first_name', headerName: 'First Name', width: 120 },
  { field: 'last_name', headerName: 'Last Name', width: 120 },
  { field: 'parent_guardian_email', headerName: 'Parent/Guardian Email', width: 200 },
  { field: 'date_of_birth', headerName: 'Date Of Birth', width: 150 },
  { field: 'address', headerName: 'Address', width: 150 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'zip', headerName: 'Zip Code', width: 120 },
  { field: 'grade', headerName: 'Grade', width: 120 },
  { field: 'created_at', headerName: 'Uploaded At', width: 180 },
  {
    field: 'details',
    headerName: 'Details',
    width: 120,
    renderCell: (params) => (
      <Tooltip title={`${params.row.first_name} ${params.row.last_name}'s details`}>
        <IconButton className="hover:text-emerald-500" onClick={() => viewFacultyDetails(params.row.faculty_id)}>
          <VisibilityOutlinedIcon />
        </IconButton>
      </Tooltip>
    ),
  },
];

export default function StudentsTable() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/showAllStudents');
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

    fetchStudents();
  }, []);

  // Function to refresh the data
  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/showAllStudents');
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
  

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl">Students</h1>
        <AddStudentModal refreshData={refreshData}/>
        {error && 
          <div className="text-red-500 text-xl text-center p-3 m-3">{error}</div>
        }

        {/* Table Section */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <CircularProgress color="secondary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">No Students in the system</div>
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