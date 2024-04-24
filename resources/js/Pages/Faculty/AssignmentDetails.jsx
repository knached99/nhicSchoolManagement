import React, {useState, useEffect} from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Link } from '@inertiajs/react';
import EditAssignmentModal from '@/Components/AdminComponents/EditAssignmentModal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


export default function AssignmentDetails({ auth, assignment, notifications }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);

  useEffect(() => {

    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);

  }, []);

  const handleCloseError = () => {
    setErrorOpen(false);
    setError(null);
};

  const deleteAssignment = async (assignment_id) => {
    try {
        const response = await axios.delete(`/deleteAssignment/${assignment_id}`);
  
        if (response.data.errors) {
            setError(response.data.errors);
            setErrorOpen(true);
        } else if (response.data.success) {
          window.location.href="/faculty/assignments";
          
        }
    } catch (error) {
        setError(error.message || 'An error occurred deleting that student');
        setErrorOpen(true);
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      user={auth}
      notifications={notifications}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Assignment Details</h2>}
    >
      <section className="bg-white dark:bg-gray-900 shadow-lg">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
            <h1 className="mb-4 text-3xl tracking-light font-black text-gray-900 dark:text-white text-center">Assignment Details</h1>
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

            {/* MODAL GOES HERE */}
            {auth.faculty_id === assignment.faculty_id || auth.role === 'Admin' && 
            
              <>
            <EditAssignmentModal assignment={assignment}/>

            <Tooltip title="Delete Assignment" arrow>
            <IconButton onClick={() => deleteAssignment(assignment.assignment_id)}>
            <DeleteOutlineOutlinedIcon className="hover:bg-red-500" style={{ fontSize: 40, marginRight: 10, color: isDarkMode ? '#fff' : 'inherit' }} />
           </IconButton>
           </Tooltip>
           </>
            
            }
            
            <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
  
               {assignment.assignment_name}</h2>
            <p className="mb-4 font-medium text-xl dark:text-white">
              <Tooltip title="Assignment Description" arrow>
              <DescriptionOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
              </Tooltip>
               {assignment.assignment_description}</p>

               <p className="mb-4 font-medium text-xl dark:text-white">
               <Tooltip title="The faculty user that created this assignment" arrow>
                <PersonOutlineOutlined style={{fontSize: 30, marginRight: 10}}/>
                </Tooltip> 
                {assignment.admin?.name}
               </p>
            <p className="mb-4 font-medium text-xl dark:text-white">
              <Tooltip title="Assignment Due Date" arrow>
              <CalendarMonthOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
              </Tooltip>
              {new Date(assignment.assignment_due_date).toLocaleString()}</p>
            <h2 className="font-bold text-2xl mb-4 mt-4">Assigned To:</h2>

            <ul className="flex flex-col shadow-lg dark:bg-slate-700 p-4 overflow-y-auto max-h-64 rounded">
  {assignment.students ? (
    assignment.students.map((student, index) => (
      <Link  href={`/faculty/studentassignment/${student.student_id}/${assignment.assignment_id}`}>
      <li key={index} className="border-gray-400 flex flex-row mb-2 justify-start items-center p-2 bg-white dark:bg-slate-500 dark:text-white rounded-md hover:bg-blue-500 hover:dark:bg-blue-40 hover:text-white">
        {student.first_name} {student.last_name}
      </li>
      </Link>
    ))
  ) : (
    <li className="text-gray-500 dark:text-gray-400">Not assigned to any student</li>
  )}
</ul>


         
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
