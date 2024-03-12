import React, {useState, useEffect} from 'react';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

// MUI Components 


import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

// Formik & Yup 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Form Components 
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function EditAssignmentModal({assignment}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
   
    useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
      }, []);
      
      const backgroundColor = isDarkMode ? '#334155' : 'background.paper';
  
  const initialValues = {
    assignment_name: assignment.assignment_name,
    assignment_description: assignment.assignment_description,
    assignment_due_date: assignment.assignment_due_date
  };

  const validate = Yup.object().shape({
    assignment_name: Yup.string().required('Assignment name is required'),
    assignment_description: Yup.string().required('Assignment description is required'),
    assignment_due_date: Yup.date().required('Assignment due date is required')
  });


  const editAssignmentDetails = async (values, { setSubmitting }) => {
    try {
        const response = await axios.put(`/editAssignmentDetails/${assignment.assignment_id}`, values, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data.errors) {
            setError(response.data.errors);
            setErrorOpen(true);
        } else if (response.data.success) {
            setSuccess(response.data.success);
            setSuccessOpen(true);
            Object.keys(values).forEach((key) => {
                values[key] = '';
            });
        }
    } catch (error) {
        setError(error.message || 'An unexpected error was encountered');
        setErrorOpen(true);
    } finally {
        setSubmitting(false);
    }
};


  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccess(null);
};

const handleCloseError = () => {
    setErrorOpen(false);
    setError(null);
};

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
    <Tooltip title="Edit Assignment Details" arrow>
    <IconButton onClick={handleOpen}>
    <DriveFileRenameOutlineOutlinedIcon style={{ fontSize: 40, marginRight: 10 }} />
    </IconButton>
    </Tooltip>

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
   <h1 className="font-black text-2xl"> Edit Assignment Details </h1>
</Typography>

  <Formik initialValues={initialValues} validationSchema={validate} onSubmit={editAssignmentDetails}>

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
    value={values.assignment_name}
    style={{
        width: '100%',
        ...(touched.assignment_name && errors.assignment_name && { border: '1px solid #ef4444' }),
    }}
    onChange={handleChange} 
    onBlur={handleBlur} 
    placeholder="Assignment Name"
    className="mb-3 mt-3"
    />
   <span className="text-red-500">{touched.assignment_name && errors.assignment_name}</span>


   <InputTextarea 
    id="assignment_description"
    name="assignment_description"
    value={values.assignment_description}
    style={{
        width: '100%',
        ...(touched.assignment_description && errors.assignment_description && { border: '1px solid #ef4444' }),
    }}
    onChange={handleChange} 
    onBlur={handleBlur} 
    placeholder="assignment description"
    className="mb-3 mt-3"
    rows={5} cols={30}
    />
         <span className="text-red-500">{touched.assignment_description && errors.assignment_description}</span>

<label className="dark:text-white mt-4 mb-4 font-semibold">Assignment Due Date</label>
<InputText 
    type="date"
    id="assignment_due_date"
    name="assignment_due_date"
    value={values.assignment_due_date}
    style={{
        width: '100%',
        ...(touched.assignment_due_date && errors.assignment_due_date && { border: '1px solid #ef4444' }),
    }}
    onChange={handleChange} 
    onBlur={handleBlur} 
    placeholder="Assignment Due Date"
    className="mb-3 mt-3"
    />

<span className="text-red-500">{touched.assignment_due_date && errors.assignment_due_date}</span>



<Button 
type="submit"
label={isSubmitting ? 'Updating Details...' : 'Update Details'}
disabled={isSubmitting || !isValid || !dirty}
loading={isSubmitting}
severity="info"
style={{width: '100%', padding: 15}}
/>


 </Form>
 )}
 </Formik>
</Box>
</Fade>
</Modal>
</>
  );
}
