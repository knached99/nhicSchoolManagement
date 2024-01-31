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

const columns = [
  { id: 'student_id', label: 'Student ID', minWidth: 50 },
  { id: 'first_name', label: 'First Name', minWidth: 80 },
  { id: 'last_name', label: 'Last Name', minWidth: 80 },
  { id: 'parent_guardian_email', label: 'Parent/Guardian Email', minWidth: 80 },
  { id: 'date_of_birth', label: 'Date Of Birth', minWidth: 80 },
  {id: 'address', label: 'Address', minWidth: 80},
  { id: 'city', label: 'City', minWidth: 80 },
  { id: 'state', label: 'State', minWidth: 80 },
  { id: 'zip', label: 'Zip Code', minWidth: 80 },
  { id: 'grade', label: 'Grade', minWidth: 80 },
  { id: 'created_at', label: 'Uploaded At', minWidth: 80 },
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
          setRows(admins);
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
  
  

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl">Students</h1>
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
          <Paper sx={{ width: '100%', backgroundColor: '#fff'}}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(rows) &&
                    rows.map((row, index) => (
                      <TableRow key={row.student_id}>
                        <TableCell>{row.student_id}</TableCell>
                        <TableCell>{row.first_name}</TableCell>
                        <TableCell>{row.last_name}</TableCell>
                        <TableCell>{row.parent_guardian_email}</TableCell>
                        <TableCell>{row.date_of_birth}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell>{row.state}</TableCell>
                        <TableCell>{row.zip}</TableCell>
                        <TableCell>{row.grade}</TableCell>
                        <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                        <Tooltip title={`${row.name} 's details`}>   
                        <IconButton className="hover:text-emerald-500" onClick={()=>viewFacultyDetails(row.faculty_id)}>
                        <VisibilityOutlinedIcon/>
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