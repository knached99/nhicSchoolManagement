import React, {useState, useEffect} from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
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

import { Formik, Form, Field, ErrorMessage } from 'formik';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
export default function AddStudentModal({refreshData}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchParents = async () => {
      try {
        const response = await fetch('/fetchParents');
        console.log(response);
        const { parents, error } = await response.json();

        if (error) {
          throw new Error(error);
        }
    
        return parents || [];
      } catch (error) {
        throw new Error('Error fetching parents: ' + error.message);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const parents = await fetchParents();
          setParents(parents);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  

    const handleCloseSuccess = () => {
      setSuccessOpen(false);
      setSuccess(null);
  };

  const handleCloseError = () => {
      setErrorOpen(false);
      setError(null);
  };
      

    const initialValues = {
        first_name: '',
        last_name: '',
        date_of_birth: null, // You can set a default date or leave it as null
        address: '',
        street_address_2: '',
        city: '',
        state: '',
        zip: '',
        grade: '',
        user_id: '',
        // Add other fields as needed
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
        grade: Yup.string().required('Level is required'),
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
      
      

    const states = [
        { abbreviation: 'AL', name: 'Alabama' },
        { abbreviation: 'AK', name: 'Alaska' },
        { abbreviation: 'AZ', name: 'Arizona' },
        { abbreviation: 'AR', name: 'Arkansas' },
        { abbreviation: 'CA', name: 'California' },
        { abbreviation: 'CO', name: 'Colorado' },
        { abbreviation: 'CT', name: 'Connecticut' },
        { abbreviation: 'DE', name: 'Delaware' },
        { abbreviation: 'FL', name: 'Florida' },
        { abbreviation: 'GA', name: 'Georgia' },
        { abbreviation: 'HI', name: 'Hawaii' },
        { abbreviation: 'ID', name: 'Idaho' },
        { abbreviation: 'IL', name: 'Illinois' },
        { abbreviation: 'IN', name: 'Indiana' },
        { abbreviation: 'IA', name: 'Iowa' },
        { abbreviation: 'KS', name: 'Kansas' },
        { abbreviation: 'KY', name: 'Kentucky' },
        { abbreviation: 'LA', name: 'Louisiana' },
        { abbreviation: 'ME', name: 'Maine' },
        { abbreviation: 'MD', name: 'Maryland' },
        { abbreviation: 'MA', name: 'Massachusetts' },
        { abbreviation: 'MI', name: 'Michigan' },
        { abbreviation: 'MN', name: 'Minnesota' },
        { abbreviation: 'MS', name: 'Mississippi' },
        { abbreviation: 'MO', name: 'Missouri' },
        { abbreviation: 'MT', name: 'Montana' },
        { abbreviation: 'NE', name: 'Nebraska' },
        { abbreviation: 'NV', name: 'Nevada' },
        { abbreviation: 'NH', name: 'New Hampshire' },
        { abbreviation: 'NJ', name: 'New Jersey' },
        { abbreviation: 'NM', name: 'New Mexico' },
        { abbreviation: 'NY', name: 'New York' },
        { abbreviation: 'NC', name: 'North Carolina' },
        { abbreviation: 'ND', name: 'North Dakota' },
        { abbreviation: 'OH', name: 'Ohio' },
        { abbreviation: 'OK', name: 'Oklahoma' },
        { abbreviation: 'OR', name: 'Oregon' },
        { abbreviation: 'PA', name: 'Pennsylvania' },
        { abbreviation: 'RI', name: 'Rhode Island' },
        { abbreviation: 'SC', name: 'South Carolina' },
        { abbreviation: 'SD', name: 'South Dakota' },
        { abbreviation: 'TN', name: 'Tennessee' },
        { abbreviation: 'TX', name: 'Texas' },
        { abbreviation: 'UT', name: 'Utah' },
        { abbreviation: 'VT', name: 'Vermont' },
        { abbreviation: 'VA', name: 'Virginia' },
        { abbreviation: 'WA', name: 'Washington' },
        { abbreviation: 'WV', name: 'West Virginia' },
        { abbreviation: 'WI', name: 'Wisconsin' },
        { abbreviation: 'WY', name: 'Wyoming' },
      ];

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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Add a Student 

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
            <CloseIcon/>
            </IconButton>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            Add a student manually. Ensure all information typed is correct.
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
            <Field as={TextField} value={values.first_name} helperText={touched.first_name && errors.first_name} error={touched.first_name && Boolean(errors.first_name)} onBlur={handleBlur} id="first_name" name="first_name" placeholder="First Name" fullWidth style={{margin: 5}} />
            <Field as={TextField} value={values.last_name} helperText={touched.last_name && errors.last_name} error={touched.last_name && Boolean(errors.last_name)} onBlur={handleBlur} id="last_name" name="last_name" placeholder="Last Name" fullWidth style={{margin: 5}} />

            {/* <Field as={TextField} value={values.parent_guardian_email} helperText={touched.parent_guardian_email && errors.parent_guardian_email} error={touched.parent_guardian_email && Boolean(errors.parent_guardian_email)} onBlur={handleBlur} id="parent_guardian_email" name="parent_guardian_email" placeholder="Parent/Guardian Email" fullWidth style={{margin: 5}} /> */}
             <InputLabel>Date Of Birth</InputLabel>
            <Field as={TextField} type="date" value={values.date_of_birth} helperText={touched.date_of_birth && errors.date_of_birth} error={touched.date_of_birth && Boolean(errors.date_of_birth)} onBlur={handleBlur} id="date_of_birth" name="date_of_birth" placeholder="Date Of Birth" fullWidth style={{margin: 5}} />
            <Field as={TextField} value={values.address} helperText={touched.address && errors.address} error={touched.address && Boolean(errors.address)} onBlur={handleBlur} id="address" name="address" placeholder="Address" fullWidth style={{margin: 5}} />
            <Field as={TextField} value={values.street_address_2} helperText={touched.street_address_2 && errors.street_address_2} error={touched.street_address_2 && Boolean(errors.street_address_2)} onBlur={handleBlur} id="street_address_2" name="street_address_2" placeholder="Apartment/Unit Number" fullWidth style={{margin: 5}} />
            {loading ? <CircularProgress color="primary" /> : 
            <FormControl sx={{ m: 1, width: '100%' }}>
                            <InputLabel id="user_id">Select Parent</InputLabel>
                            <Select
                              labelId="user_id"
                              id="user_id"
                              name="user_id"
                              value={values.user_id || ''}
                              onChange={handleChange}
                              style={{ width: 300 }}
                            >
                              <MenuItem value="">
                                <em>Make a Selection</em>
                              </MenuItem>
                    
                              {parents.map((parent) => (
                                <MenuItem key={parent.user_id} value={parent.user_id}>
                                  {parent.name} - {parent.email}
                                </MenuItem>
                              ))}
                            </Select>
            </FormControl>
            }
            <Field as={TextField} value={values.city} helperText={touched.city && errors.city} error={touched.city && Boolean(errors.city)} onBlur={handleBlur} id="city" name="city" placeholder="City" fullWidth style={{margin: 5}} />
            <FormControl sx={{ m: 1, width: '100%' }}>
            <InputLabel id="state">Select State</InputLabel>
            <Select
              labelId="state"
              id="state"
              name="state"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.state && Boolean(errors.state)}

            >
              <MenuItem value="">
                <em>Select a State</em>
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            {touched.state && errors.state && (
              <FormHelperText style={{color: 'red'}}>{errors.state}</FormHelperText>
            )}
          </FormControl>

            <Field as={TextField} value={values.zip} helperText={touched.zip && errors.zip} error={touched.zip && Boolean(errors.zip)} onBlur={handleBlur} id="zip" name="zip" placeholder="Zip Code" fullWidth style={{margin: 5}} />
            <FormControl sx={{mx: 1, width: '100%'}}>
              <InputLabel id="grade">Select Level</InputLabel>
              <Select
              labelId="grade"
              id="grade"
              name="grade"
              value={values.grade}
              onChange={handleChange}
              error={touched.grade && Boolean(errors.grade)}
              onBlur={handleBlur}
              >
             <MenuItem value="">
              <em>Select Level</em>
             </MenuItem>
             <MenuItem value="l">Level 1</MenuItem>
              <MenuItem value="2">Level 2</MenuItem>
              <MenuItem value="3">Level 3</MenuItem>
              <MenuItem value="4">Level 4</MenuItem>
              <MenuItem value="5">Level 5</MenuItem>
              </Select>
              {touched.grade && errors.grade && (
              <FormHelperText style={{color: 'red'}}>{errors.grade}</FormHelperText>
            )}
            </FormControl>
            {/* <Field as={TextField} value={values.grade} helperText={touched.grade && errors.grade} error={touched.grade && Boolean(errors.grade)} onBlur={handleBlur} id="grade" name="grade" placeholder="Grade" fullWidth style={{margin: 5}} /> */}

        

        <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            color: 'white',
                                            width: '100%',
                                            backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#059669',
                                            padding: 15,
                                            marginTop: 10,
                                        }}
                                        disabled={isSubmitting || !isValid || !dirty}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress size={24} style={{ color: '#fff' }} />
                                        ) : (
                                            <>
                                               Create User
                                            </>
                                        )}
                                    </Button>
         </Form>
         )}
            </Formik>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
