import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Zoom from '@mui/material/Zoom';





export default function ImportStudentsModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Form Initial Values
  const initialValues = {
      file: null,
  };

  // Yup Validation
  const validationSchema = Yup.object().shape({
      file: Yup.mixed()
          .required('File is required')
          .test('fileType', 'Only Excel files (CSV, XLS, XLSX) are allowed', (value) => {
              if (value) {
                  const allowedFileTypes = [
                      'application/vnd.ms-excel',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel.sheet.macroEnabled.12',
                  ];
                  return allowedFileTypes.includes(value.type);
              }
              return true; // Allow empty value (no file selected)
          }),
  });

  const importStudents = async (values, { setSubmitting }) => {
      try {
          if (!values.file) {
              setError('Excel File is required');
              return;
          }

          const formData = new FormData();
          formData.append('file', values.file);

          const response = await axios.post('/studentBatchImport', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });

          if (response.status === 200) {
              setSuccess(response.data.success);
              setSuccessOpen(true);
              // Reset the form
              setSubmitting(false);
          } else {
              setOpen(true);
              setError(response.data.error);
              setErrorOpen(true);
          }
      } catch (error) {
          setOpen(true);
          setError(error.message);
          setErrorOpen(true);
      } finally {
          setSubmitting(false);
          window.location.reload(); // page refresh 
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
    width: '100%',
    maxWidth: 500,
    bgcolor: backgroundColor,
   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
   border: 'none',
  p: 4,
  };
  
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  return (
    <div className="inline-flex items-center px-1 pt-1 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ">
     <Tooltip title="Batch Import Students" TransitionComponent={Zoom} arrow>
        <IconButton onClick={handleOpen} className="hover:text-slate-100">
        <FileDownloadOutlinedIcon style={{color: '#fff', fontSize: '35'}}/>
        </IconButton>
     </Tooltip>

     <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>

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
            <IconButton onClick={handleClose} className="inline-flex float-end m-2">
                <CloseIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}/>
            </IconButton>
          <Typography style={{color: isDarkMode ? '#fff' : 'inherit'}} id="modal-modal-title" variant="h6" component="h2">
           <h1 className="font-black text-2xl"> Batch Student Import </h1>
          </Typography>
          <Typography style={{color: isDarkMode ? '#fff' : 'inherit'}} id="modal-modal-description" sx={{ mt: 2 }}>
           <h5 className="font-semibold m-3">You can import multiple students from an excel spreadsheet.</h5>
          </Typography>

                
<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={importStudents}>
  {({ handleSubmit, setSubmitting, setFieldValue, isValid, dirty, isSubmitting }) => (
    <Form onSubmit={handleSubmit} autoComplete="off">

      <VisuallyHiddenInput
        type="file"
        name="file"
        id="file"
        accept=".xls, .xlsx"
        onChange={(e) => {
            setFieldValue('file', e.currentTarget.files[0]);
            importStudents({ file: e.currentTarget.files[0] }, { setSubmitting });
          }}
        
      />
      {!isSubmitting ? (
        <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<FileDownloadOutlinedIcon />}
        htmlFor="file"
      >
        Import
      </Button>
      )
    :
    <>
    <p>Importing..</p>
    <CircularProgress/>
    </>
    }
      

    </Form>
  )}
</Formik>

        </Box>
      </Modal>
    </div>
  )
}
