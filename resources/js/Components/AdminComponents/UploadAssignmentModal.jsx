import React, {useState, useEffect, useRef} from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Button } from 'primereact/button';
import Typography from '@mui/material/Typography';


import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import { InputMask } from 'primereact/inputmask';
        
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Zoom from '@mui/material/Zoom';

import { InputText } from 'primereact/inputtext';

export default function UploadAssignmentModal({auth}) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [open, setOpen] = useState(false);
    const [students, setStudents] = useState([]);

    const initialValues = {
        assignment_name: '',
        assignment_description: '',
        assignment_due_date: '',
        student_id: ''
    };

    const validate = Yup.object().shape({
        assignment_name: Yup.string().required('Assignment name is required'),
        assignment_description: Yup.string().required('You must provide a description for the assignment'),
        assignment_due_date: Yup.date().required('You must provide a due date for the assignment')
    });

    const uploadAssignment = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('/uploadAssignment', values, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            console.log(response); // Log the entire response to the console
    
            if (response.data.errors) {
                setError(response.data.errors);
                console.log(response.data.errors);
                setErrorOpen(true);
            } else if (response.data.success) {
                setSuccess(response.data.success);
                setSuccessOpen(true);
    
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                });
            }
        } catch (error) {
            console.log(error);
            setError(error.message || 'Whoops, something went wrong uploading the assignment');
            setErrorOpen(true);
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        const fetchStudents = async () => {
          try {
            const response = await fetch(`/showStudentsForTeacher/${auth.faculty_id}`);
            const { students, error } = await response.json();
    
            if (error) {
              setError(error);
            } else if (students) {
              setStudents(students);
            } else {
              setError('Unexpected response format from the server');
            }
    
          } catch (error) {
            setError('Error fetching students: ' + error.message);
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

    useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
      }, []);
      
      const backgroundColor = isDarkMode ? '#334155' : 'background.paper';

    const style = {
        position: 'absolute',
        borderRadius: 5,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%', // Set to a percentage for responsiveness
        maxWidth: 800, // Set a maximum width
        maxHeight: '80vh', // Set a maximum height (80% of the viewport height)
        overflowY: 'auto', // Enable vertical scrolling when content exceeds the height
        bgcolor: backgroundColor, // Apply dynamic background color
        boxShadow: 24,
        p: 4,
      };

      

  return (
    <>
    <button onClick={handleOpen} className="m-4 p-3 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 bg-slate-300 rounded hover:bg-slate-400 text-lg float-end">Upload an Assignment</button>

    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={open}
    closeAfterTransition
    slots={{ backdrop: Backdrop }}
    slotProps={{
      backdrop: {
        timeout: 500,
      },
    }}

  >
    <Fade in={open}>
    <Box sx={style}>

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
        <IconButton onClick={handleClose} className="inline-flex float-end m-2">
            <CloseIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}/>
        </IconButton>
      <Typography style={{color: isDarkMode ? '#fff' : 'inherit'}} id="modal-modal-title" variant="h6" component="h2">
       <h1 className="font-black text-2xl"> Upload an Assignment </h1>
      </Typography>
      <Typography style={{color: isDarkMode ? '#fff' : 'inherit'}} id="modal-modal-description" sx={{ mt: 2 }}>
      <h5 className="mb-3 font-medium text-lg text-slate-600 dark:text-slate-100">Upload online assignments which can then be assigned to students </h5>
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validate} onSubmit={uploadAssignment}>
      {({
            values, 
            errors,
            touched,
            handleSubmit,
            handleBlur,
            handleChange,
            isValid,
            dirty,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} autoComplete="off">
             <InputText 
             id="assignment_name"
             name="assignment_name"
             placeholder="Enter assignment name"
             value={values.assignment_name}
             style={{
                width: '100%',
                ...(touched.assignment_name && errors.assignment_name && { border: '1px solid #ef4444' }),
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mb-3 mt-3"/>
            <span className="text-red-500">{touched.assignment_name && errors.assignment_name}</span>
           
           <label className="dark:text-white">Assignment Due Date</label>
            <InputText 
             type="date"
             id="assignment_due_date"
             name="assignment_due_date"
             style={{
                width: '100%',
                ...(touched.assignment_due_date && errors.assignment_due_date && { border: '1px solid #ef4444' }),
            }}
            onChange={handleChange} 
            onBlur={handleBlur} 
            className="mb-3 mt-3"
             />
          <span className="text-red-500">{touched.assignment_due_date && errors.assignment_due_date}</span>

            {students.length === 0 ? (
                <>
                </>
            )
            :
            <>
            <label className="mb-4 mt-3 font-medium dark:text-white">Assign To: </label>

            <select
            name="student_id"
            className="w-full p-3 rounded border-2 border-slate-300 dark:bg-slate-900 dark:text-white"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.student_id} // Ensure the selected value is controlled by the form state
            >
            <option value="none">No One</option>
            <option value="all_students">All Students</option>
            {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                {student.first_name} {student.last_name}
                </option>
            ))}
            </select>
            </>
            }
           


          <textarea 
             id="assignment_description"
             name="assignment_description"
             style={{
                width: '100%',
                ...(touched.assignment_description && errors.assignment_description && { border: '1px solid #ef4444' }),
            }}
            onChange={handleChange} 
            onBlur={handleBlur} 
            placeholder="Enter assignment description and details"
            className="mb-3 mt-3 dark:bg-slate-900 dark:text-white rounded"
            >
           </textarea>
          <span className="text-red-500">{touched.assignment_description && errors.assignment_description}</span>

            <Button type="submit"
            label={isSubmitting ? 'uploading assignment...' : 'upload assignment'}
            disabled={isSubmitting  || !isValid || !dirty}
            loading={isSubmitting}
            severity="info"
            />
            
            </Form>
             )}


      </Formik>
 
    </Box>
    </Fade>
  </Modal>
  </>
  )
}
