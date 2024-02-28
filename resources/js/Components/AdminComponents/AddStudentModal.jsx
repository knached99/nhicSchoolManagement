import React, {useState, useEffect} from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import Button from '@mui/material/Button';

import { Button } from 'primereact/button';
        
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import axios from 'axios';  // Add this line
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

import states from '@/constants/states';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from "primereact/inputtextarea";

  
export default function AddStudentModal({refreshData}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [parents, setParents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const fetchData = async () => {
      try {
        // Fetch parents
        const parentsResponse = await fetch('/fetchParents');
        const { parents, error: parentsError } = await parentsResponse.json();
    
        if (parentsError) {
          throw new Error(parentsError);
        }
    
        // Fetch teachers
        const teachersResponse = await fetch('/fetchTeachers');
        const { teachers, error: teachersError } = await teachersResponse.json();
    
        if (teachersError) {
          throw new Error(teachersError);
        }
    
        // Now you have both parents and teachers data
        setParents(parents || []);
        setTeachers(teachers || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      // Check if the system is in dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
      setIsDarkMode(prefersDarkMode);
    }, []);
    
    const backgroundColor = isDarkMode ? '#334155' : 'background.paper';

    

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
  bgcolor: backgroundColor,
  boxShadow: 24,
  p: 4,
};


  const indigo = {
    100: '#e0e7ff',
    200: '#c7d2fe',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    900: '#312e81',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };



  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${indigo[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${indigo[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? indigo[600] : indigo[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
      

    const initialValues = {
        first_name: '',
        last_name: '',
        date_of_birth: null, // You can set a default date or leave it as null
        address: '',
        street_address_2: '',
        city: '',
        state: '',
        zip: '',
        level: '',
        gender: '',
        allergies_or_special_needs: '',
        emergency_contact_person: '',
        emergency_contact_hospital: '',
        user_id: '',
        faculty_id: '',
      };
    
    const validation = Yup.object().shape({
        first_name: Yup.string().required('First Name is required'),
        last_name: Yup.string().required('Last Name is required'),
        date_of_birth:  Yup.date()
        .max(new Date(), 'Date of Birth cannot be today or a future date')
        .required('Date of Birth is required'),
        address: Yup.string().required('Address is required').matches(/^[a-zA-Z0-9\s,.-]+$/, 'Invalid address'),
        street_address_2: Yup.string().nullable().matches(/^[a-zA-Z0-9\s]+$/, 'Invalid apartment or unit number'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zip: Yup.string()
        .matches(/^\d{5}$/, 'Must be a valid 5-digit ZIP code')
        .required('ZIP Code is required'),
        level: Yup.string().required('Level is required'),
        gender: Yup.string().required('Gender is required'),
        allergies_or_special_needs: Yup.string(),
        emergency_contact_person: Yup.string(),
        emergency_contact_hospital: Yup.string()
      });

      const addStudent = async (values, { setSubmitting }) => {
        try {
          const response = await axios.post('/addStudent', values, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.data.success) {
            // Handling success response
            setSuccess(response.data.success);
            setSuccessOpen(true);
            refreshData();
      
            // Reset form values
            // Assuming values is an object with form field keys
            Object.keys(values).forEach((key) => {
              values[key] = '';
            });
          } else if (response.data.error) {
            // Handling validation errors
            setError(response.data.error);
            console.log(response.data.error);
            setErrorOpen(true);
          } else {
            // Handling other error cases
            setError(response.data.error);
            console.log(response.data.error);
            setErrorOpen(true);
          }
        } catch (error) {
          // Handling network or unexpected errors
          setError('Error adding student: ' + error.message);
          setErrorOpen(true);
        } finally {
          setSubmitting(false);
        }
      };
      
      

  

  return (
    <div className="mb-5">
      <button onClick={handleOpen} className="bg-slate-300 hover:bg-slate-400 text-black font-normal py-2 px-4 rounded">
        Add Student
      </button>
      {/* <Button onClick={handleOpen} style={{backgroundColor: '#cbd5e1', color: '#000', margin: 20}}>Add Student</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
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
            <Typography id="transition-modal-title" variant="h6" style={{color: isDarkMode ? '#fff' : 'inherit'}} component="h1">
             <h1 className="font-black text-2xl"> Add a Student </h1>

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
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2, color: isDarkMode ? '#fff' : 'inherit' }}>
           <h5 className="mb-5 font-bold">
            <Alert severity="info">
            Add a student manually. Ensure all information typed is correct.
            </Alert>
           </h5>
            </Typography>
            <Formik initialValues={initialValues} validationSchema={validation} onSubmit={addStudent}>
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
            style={{
              width: '100%',
              margin: 10,
              ...(touched.first_name && errors.first_name && { border: '1px solid #ef4444' }),
          }}
          name="first_name"
          value={values.first_name}
          id="first_name"
          placeholder="First Name"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.first_name && errors.first_name}</span>


          <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.last_name && errors.last_name && { border: '1px solid #ef4444' }),
          }}
          name="last_name"
          value={values.last_name}
          id="last_name"
          placeholder="Last Name"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.last_name && errors.last_name}</span>


             <InputLabel style={{color: isDarkMode ? '#fff' : 'inherit'}}>Date Of Birth</InputLabel>

             <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.date_of_birth && errors.date_of_birth && { border: '1px solid #ef4444' }),
          }}
          name="date_of_birth"
          value={values.date_of_birth}
          id="date_of_birth"
          placeholder="Date Of Birth"
          onChange={handleChange}
          onBlur={handleBlur}
          type="date"
            />
            <span className="text-red-500">{touched.date_of_birth && errors.date_of_birth}</span>


          <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.address && errors.address && { border: '1px solid #ef4444' }),
          }}
          name="address"
          value={values.address}
          id="address"
          placeholder="Street Address"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.address && errors.address}</span>

            
          <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.street_address_2 && errors.street_address_2 && { border: '1px solid #ef4444' }),
          }}
          name="street_address_2"
          value={values.street_address_2}
          id="street_address_2"
          placeholder="Apartment/Unit Number"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.street_address_2 && errors.street_address_2}</span>

          <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.city && errors.city && { border: '1px solid #ef4444' }),
          }}
          name="city"
          value={values.city}
          id="city"
          placeholder="City"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.city && errors.city}</span>

            <select className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.state && errors.state ? 'border-red-500 border-1' : ''}`} 
             name="state"
             id="state"
             onChange={handleChange}
             onBlur={handleBlur}
            >
      
              <option disabled selected>Select State</option>
              {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            <span className="text-red-500">{touched.state && errors.state}</span>


            <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.zip && errors.zip && { border: '1px solid #ef4444' }),
          }}
          name="zip"
          value={values.zip}
          id="zip"
          placeholder="Zip Code"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.zip && errors.zip}</span>
            


            
          <select className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.level && errors.level ? 'border-red-500 border-1' : ''}`} 
             name="level"
             id="level"
             onChange={handleChange}
             onBlur={handleBlur}
            >
      
              <option disabled selected>Select Level</option>
              <option value="l">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
            </select>
            <span className="text-red-500">{touched.level && errors.level}</span>


            <select className={`p-3 m-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.gender && errors.gender ? 'border-red-500 border-1' : ''}`} 
             name="gender"
             id="gender"
             onChange={handleChange}
             onBlur={handleBlur}
            >
      
              <option disabled selected>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <span className="text-red-500">{touched.gender && errors.gender}</span>


            {loading ? <CircularProgress color="primary" /> : 
          <select className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.user_id && errors.user_id ? 'border-red-500 border-1' : ''}`} 
          name="user_id"
          id="user_id"
          onChange={handleChange}
          onBlur={handleBlur}
          >

          <option disabled selected>Select Parent</option>
            {parents.map((parent)=>(
              <option key={parent.user_id} value={parent.user_id}>
                {parent.name} - {parent.email}
              </option>
            ))}
          </select>
      
            }


            {loading ? <CircularProgress color="primary" /> : 
            <select className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.faculty_id && errors.faculty_id ? 'border-red-500 border-1' : ''}`} 
          name="faculty_id"
          id="faculty_id"
          onChange={handleChange}
          onBlur={handleBlur}
          >

          <option disabled selected>Select Teacher</option>
            {teachers.map((teacher)=>(
              <option key={teacher.faculty_id} value={teacher.faculty_id}>
                {teacher.name} - {teacher.email}
              </option>
            ))}
          </select>
        }


            
        <InputTextarea 
        rows={2} cols={30} 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.allergies_or_special_needs && errors.allergies_or_special_needs && { border: '1px solid #ef4444' }),
          }}
          name="allergies_or_special_needs"
          value={values.allergies_or_special_needs}
          id="allergies_or_special_needs"
          placeholder="allergies or special needs"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.allergies_or_special_needs && errors.allergies_or_special_needs}</span>

            <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.allergies_or_special_needs && errors.emergency_contact_person && { border: '1px solid #ef4444' }),
          }}
          name="emergency_contact_person"
          value={values.emergency_contact_person}
          id="emergency_contact_person"
          placeholder="emergency contact person"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.emergency_contact_person && errors.emergency_contact_person}</span>


            <InputText 
            style={{
              width: '100%',
              margin: 10,
              ...(touched.emergency_contact_hospital && errors.emergency_contact_hospital && { border: '1px solid #ef4444' }),
          }}
          name="emergency_contact_hospital"
          value={values.emergency_contact_hospital}
          id="emergency_contact_hospital"
          placeholder="emergency contact hospital"
          onChange={handleChange}
          onBlur={handleBlur}
            />
            <span className="text-red-500">{touched.emergency_contact_hospital && errors.emergency_contact_hospital}</span>



        <Button
        label={isSubmitting ? 'creating user' : 'Create User'}
        loading={isSubmitting}
        severity="info"
                                        type="submit"
                                        style={{
                                            color: 'white',
                                            width: '100%',
                                            backgroundColor: isSubmitting || !isValid || !dirty && '#l66534',
                                            padding: 15,
                                            marginTop: 10,
                                        }}
                                        disabled={isSubmitting || !isValid || !dirty}
                                    />
                                        {/* {isSubmitting ? (
                                            <CircularProgress size={24} style={{ color: '#fff' }} />
                                        ) : (
                                            <>
                                               Create User
                                            </>
                                        )} */}
         </Form>
         )}
            </Formik>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
