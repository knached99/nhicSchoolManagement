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
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'name', label: 'Name', minWidth: 80 },
  { id: 'email', label: 'Email', minWidth: 80 },
  { id: 'phone_number', label: 'Phone Number', minWidth: 80 },
  { id: 'role', label: 'Role', minWidth: 80 },
  {id: 'created_at', label: 'Created At', minWidth: 80},
  { id: 'view', label: 'View', minWidth: 80 },
  {field: 'delete', label: 'Delete', minWidth: 80}
];


export default function AdminsTable({auth}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  {console.log('Delete button condition met:', auth.faculty.role)}

  const viewFacultyDetails = (userID) => {
    window.location.href = `/faculty/profile/${userID}/view`;
  }
  
  const deleteAdminUser = async (userId) => {
    try {
      const response = await axios.delete(`/deleteAdminUser/${userId}`);
  
      if (response.data.success) {
        // Handling success response
        setSuccess(response.data.success);
      } else {
        // Handling failure response
        setError(`Error deleting admin user: ${userId} because: ${response.data.error}`);
        //console.error('Error deleting admin user:', response.data.error);
      }
    } catch (error) {
      // Handling other errors (e.g., network error)
      // console.error('Error deleting admin user:', error.message);
      setError(`Error deleting admin user: ${userId} because: ${error.message}`);

    }
  };
  

  useEffect(() => {
    const fetchFacultyUsers = async () => {
      try {
        const response = await fetch('/fetchFacultyUsers');
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
        setError('Error fetching faculty users: ' + error.message);
        setLoading(false);
      }
    };
  
    fetchFacultyUsers();
  }, []);
  
  

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
      <div className="bg-white p-5 rounded overflow-hidden sm:rounded-lg">
        <h1 className="m-3 text-center font-black text-xl">Faculty Users</h1>
        {error && (
          <div className="text-red-500 text-xl text-center p-3 m-3">{error}</div>
        )}

        {/* Table Section */}
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <CircularProgress color="secondary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-slate-500 text-xl text-center p-3 m-3">
            No faculty users created yet
          </div>
        ) : (
          <Paper sx={{ width: '100%', backgroundColor: '#fff' }}>
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
                      <TableRow key={row.faculty_id}>
                        <TableCell>{row.faculty_id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>
                          {row.phone_number ? row.phone_number : 'N/A'}
                        </TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>
                          {new Date(row.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={`${row.name}'s details`}>
                            <IconButton
                              className="hover:text-emerald-500"
                              onClick={() => viewFacultyDetails(row.faculty_id)}
                            >
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                         
                        </TableCell>

                        {auth.faculty && (
                            (auth.faculty.role === 'Admin' || (auth.faculty.permissions && auth.faculty.permissions.includes('can_delete_faculty_users'))) && (
                                <>
                                <TableCell>
                                <Tooltip
                                title={`Delete ${row.name} from the system`}
                              >
                                <IconButton className="hover:text-red-500" onClick ={()=>deleteAdminUser(row.faculty_id)}>
                                  <DeleteOutlineOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                                    </TableCell>
                                </>
                            )
                        )}
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