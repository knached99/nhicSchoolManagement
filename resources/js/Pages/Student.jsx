import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import states from '@/constants/states';

import React, {useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import { Button } from 'primereact/button';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';

import CircularProgress from '@mui/material/CircularProgress';
// ICONS 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PlaceIcon from '@mui/icons-material/Place';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

// Lists

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

// components 

import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';

import AttendanceHistory from '@/Components/AdminComponents/AttendanceHistory';
import AssignmentsTable from '@/Components/AdminComponents/AssignmentsTable';

export default function Student({auth, student, assignments}) {
    const [error, setError] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [parents, setParents] = useState([]);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingParents, setLoadingParents] = useState(true);
    const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);
    const [isDarkMode , setIsDarkMode] = useState(false);

    const fetchTeachers = async () => {
        try {
          const response = await fetch('/fetchTeachers');
          const { teachers, error } = await response.json();

          if (error) {
            throw new Error(error);
          }
      
          return teachers || [];
        } catch (error) {
          throw new Error('Error fetching teachers: ' + error.message);
        }
      };

      const fetchParents = async () => {
        try {
          const response = await fetch('/getVerifiedParents');
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
            const facultyUsers = await fetchTeachers();
            const parentUsers = await fetchParents();
            setParents(parentUsers);
            setTeachers(facultyUsers);
            setLoading(false);
            setLoadingParents(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
            setLoadingParents(false);
          }
        };
    
        fetchData();
      }, []);
    
      useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
      }, []);
      
      const backgroundColor = isDarkMode ? '#334155' : 'background.paper';

    

      // For assigning teacher to student 
      const initialValues = {
        student_id: student.student_id,
        faculty_id: ''
      };
      
// For assigning teacher to student 
    const validationSchema = Yup.object().shape({
      faculty_id: Yup.string().required('Must Select Teacher')
    });


    const parentInitialValues = {
      student_id: student.student_id, 
      user_id: ''
    };

    const validateData = Yup.object().shape({
      user_id: Yup.string().required('Must Select Parent')
    });



    const assignTeacherToStudent = async (values, { setSubmitting }) => {
      try {
        const response = await axios.put(`/assignTeacherToStudent/${values.student_id}/${values.faculty_id}`, values, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
    
        if (response.data.errors) {
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          setSuccess(response.data.success);
          setSuccessOpen(true);
    
          // Reset form values
          Object.keys(values).forEach((key) => {
            values[key] = '';
          });
          window.setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setError(error.message || 'Unable to assign teacher to student, something went wrong');
        setErrorOpen(true);
      } finally {
        setSubmitting(false);
      }
    };


    const assignParentToStudent = async (values, { setSubmitting }) => {
      try {
        const response = await axios.put(`/assignParentToStudent/${values.student_id}/${values.user_id}`, values, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
    
        if (response.data.errors) {
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          setSuccess(response.data.success);
          setSuccessOpen(true);
    
          // Reset form values
          Object.keys(values).forEach((key) => {
            values[key] = '';
            window.setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        }
      } catch (error) {
        setError(error.message || 'Unable to assign parent to student, something went wrong');
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

  //     const handleTogglePermissionsMenu = () => {
  //   setOpenPermissionsMenu(!openPermissionsMenu);
  // };


  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const studentInitialValues = {
    student_id : student.student_id, 
    date_of_birth: student.date_of_birth || '',
    address: student.address || '', 
    street_address_2 : student.street_address_2 || '',
    city: student.city || '', 
    state: student.state || '', 
    zip: student.zip || '', 
    level: student.level || '', 
    gender: student.gender || '', 
    allergies_or_special_needs: student.allergies_or_special_needs || '',
    emergency_contact_person: student.emergency_contact_person || '',
    emergency_contact_hospital: student.emergency_contact_hospital || '',
    faculty_id: student.faculty_id || '', 

  };

  const studentValidationSchema = Yup.object().shape({
    date_of_birth:  Yup.date()
    .max(new Date(), 'Date of Birth cannot be a future date')
    .nullable(),
    address: Yup.string().nullable().matches(/^[a-zA-Z0-9\s,.-]+$/, 'Invalid address'),
    street_address_2: Yup.string().nullable().matches(/^[a-zA-Z0-9\s]+$/, 'Invalid apartment or unit number'),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    zip: Yup.string()
    .matches(/^\d{5}$/, 'Must be a valid 5-digit ZIP code')
    .nullable(),
    level: Yup.string().nullable(),
    gender: Yup.string().nullable(),
    allergies_or_special_needs: Yup.string(),
    emergency_contact_person: Yup.string(),
    emergency_contact_hospital: Yup.string()

  });

  const editStudentInformation = async (values, { setSubmitting }) => {
    console.log('Submitting Form: ' + values);

    try {
      const response = await axios.put(`/editStudentInformation/${values.student_id}`, values, {
        headers: {
          'Content-Type': 'application/json'
        },
      });


      console.log('Response: ' + response);
  
      if (response.data.errors) {
        setError(response.data.errors);
        console.log('Submission Error: ' + response.data.errors);
        setErrorOpen(true);
      } else if (response.data.success) {
        setSuccess(response.data.success);
        console.log('Submission Success: ' + response.data.success);
        setSuccessOpen(true);
  
        // Reset form values
        Object.keys(values).forEach((key) => {
          values[key] = '';
        });
        window.setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setError(error.message || 'Unable to edit student information, something went wrong');
      console.log('Error Messages: ' + error.message);
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  

  if(auth.role!== 'Admin' && auth.faculty_id !==student.faculty_id){
    return (
      <>
      <Head title="Unauthorized"/>
       <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">Not Authorized</h2>}
      >
       <h1 className="text-center font-normal text-2xl dark:text-white"> You are not authorized to view this page. This student is not assigned to you. </h1>
      </AdminLayout>
            
      </>
    );
  }


  return (
    <>
      <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">{student.first_name} {student.last_name}'s Profile Page</h2>}
      >
    <div className="container mx-auto py-8" >
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
            
                <div className="bg-white dark:bg-slate-800 dark:text-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
                    <Link href="/faculty/dash" class="float-start mb-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                    <ArrowBackOutlinedIcon/>  Back
                  </Link>
            
                    <Avatar sx={{ width: 100, height: 100 }} {...stringAvatar(`${student.first_name} ${student.last_name}`)} />
                        <h1 className="text-xl font-bold">{student.first_name} {student.last_name}</h1>
                        <p className="text-gray-700 dark:text-white text-center font-bold mt-3">
                        Student Since: 
                        <span className="font-normal ml-1">
                        {new Date(student.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </p>
                                  
                      {/* && !student.faculty_id */}
                        {auth.role === 'Admin'  && (
                        <div class="mt-6 flex flex-wrap gap-4 justify-center">
                        <span className="text-indigo-500 dark:text-indigo-300">{student.first_name} {student.last_name} {!student.faculty_id ? 'is not assigned to a teacher' :  `is assigned to ${student.faculty.name} but you can switch teachers at any time`} </span>
                        {loading ? <CircularProgress color="primary" />  : 
                      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={assignTeacherToStudent}>
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
                          <input type="hidden" name="student_id" id="student_id" value={student.student_id}/>
                          <FormControl sx={{ m: 1, width: '100%' }}>
                            <InputLabel id="faculty_id">{!student.faculty_id ? 'Select Teacher' : 'Switch Teacher'}</InputLabel>
                            <Select
                              labelId="faculty_id"
                              id="faculty_id"
                              name="faculty_id"
                              value={values.faculty_id || ''}
                              onChange={handleChange}
                              style={{ width: 300,
                                backgroundColor: isDarkMode ? '#475569' : 'inherit'
                              
                              }}
                            >
                              <MenuItem value="">
                                <em>Select Teacher</em>
                              </MenuItem>
                    
                              {teachers.map((teacher) => (
                                <MenuItem key={teacher.faculty_id} value={teacher.faculty_id}>
                                  {teacher.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            type="submit"
                            variant="contained"
                            style={{
                              color: 'white',
                              width: '100%',
                              backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3b82f6',
                              padding: 15,
                              marginTop: 10,
                            }}
                            disabled={isSubmitting || !isValid || !dirty}
                          >
                            {isSubmitting ? (
                              <CircularProgress size={24} style={{ color: '#fff' }} />
                            ) : (
                              <>Assign</>
                            )}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                            }
                        </div>
                        )}
                        
                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-white uppercase font-bold tracking-wider mb-2">Student Bio</span>
                        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: backgroundColor }}>
      <nav aria-label="main mailbox folders">
        
       
       <Formik initialValues={studentInitialValues} validationSchema={studentValidationSchema} onSubmit={editStudentInformation}>
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

      <div className="card m-3">
            <Inplace closable>
                <InplaceDisplay>
                   <CakeOutlinedIcon style={{margin: 5}}/>
              {`${student.date_of_birth}` || 'Click to edit date of birth'}
              </InplaceDisplay>
                <InplaceContent>
                    <InputText
                     style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.date_of_birth && errors.date_of_birth && { border: '1px solid #ef4444' }),
                  }}
                    id="date_of_birth" name="date_of_birth" type="date" value={values.date_of_birth} onChange={handleChange} onBlur={handleBlur} autoFocus />
                <FormHelperText style={{color: '#ef4444'}}>{touched.date_of_birth && errors.date_of_birth}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
                <InplaceDisplay>
                {student.gender === 'Male' && <MaleIcon style={{ margin: 5 }} />}
                {student.gender === 'Female' && <FemaleIcon style={{ margin: 5 }} />}
                  {`${student.gender}` || 'Click to edit gender'}</InplaceDisplay>
                <InplaceContent>
                <select
                value={values.gender || ''}
                 style={{
                  width: '100%',
                  margin: 10,
                  ...(touched.gender && errors.gender && { border: '1px solid #ef4444' }),
              }}
                id="gender" name="gender" onChange={handleChange} onBlur={handleBlur} className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.gender && errors.gender ? 'border-red-500 border-1' : ''}`}>
                  <option disabled selected>{values.gender ? values.gender : 'Select Gender'}</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <FormHelperText style={{color: '#ef4444'}}>{touched.gender && errors.gender}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
                <InplaceDisplay>
                  <GradeOutlinedIcon style={{margin: 5}}/>
                  {`${student.level}` || 'Click to edit level'}
                  </InplaceDisplay>
                <InplaceContent>
                <select 
                value={values.level || ''}
                style={{
                  width: '100%',
                  margin: 10,
                  ...(touched.level && errors.level && { border: '1px solid #ef4444' }),
              }}
                id="level" name="level" onChange={handleChange} onBlur={handleBlur} className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.gender && errors.gender ? 'border-red-500 border-1' : ''}`}>
                  <option disabled selected>{values.level ? values.level : 'Select Level'}</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                </select>
                <FormHelperText style={{color: '#ef4444'}}>{touched.level && errors.level}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
                <InplaceDisplay>
                  <HomeOutlinedIcon style={{margin: 5}}/>
                  {`${student.address}` || 'Click to edit street address'}
                  </InplaceDisplay>
                <InplaceContent>
                    <InputText 
                    placeholder="Street Address"
                     style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.address && errors.address && { border: '1px solid #ef4444' }),
                  }}
                    id="address" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} autoFocus />
                    <FormHelperText style={{color: '#ef4444', fontSize: 18}}>{touched.address && errors.address}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>
        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <ApartmentIcon style={{margin: 5}}/>
              {`${student.street_address_2 ? values.street_address_2 : ''}` || 'Click to edit apartment/unit number'}
              </InplaceDisplay>
                <InplaceContent>
                    <InputText
                    placeholder="Apartment/Unit Number"
                    style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.street_address_2 && errors.street_address_2 && { border: '1px solid #ef4444' }),
                  }}
                    id="street_address_2" name="street_address_2" value={values.street_address_2 ? values.street_address_2 : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                  <FormHelperText style={{color: '#ef4444'}}>{touched.street_address_2 && errors.street_address_2}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <LocationCityIcon style={{margin: 5}}/>
              {`${student.city ? student.city : ''}` || 'Click to edit city'}
              </InplaceDisplay>
                <InplaceContent>
                    <InputText
                    placeholder="City"
                    id="city"
                    name="city" 
                     style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.city && errors.city && { border: '1px solid #ef4444' }),
                  }}
                    value={values.city ? values.city : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                  <FormHelperText style={{color: '#ef4444'}}>{touched.city && errors.city}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <PlaceIcon style={{margin: 5}}/>
              {`${student.state ? student.state : ''}` || 'Click to edit state'}
              </InplaceDisplay>
                <InplaceContent>
                  <select className={`p-3 ml-3 rounded dark:bg-slate-900 dark:text-white w-full inline-block ${touched.state && errors.state ? 'border-red-500 border-1' : ''}`}
                    id="state"
                    value={values.state || ''}
                    name="state"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option disabled selected>{values.state}</option>
                    {states.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
                    
                  </select>

                    <FormHelperText style={{color: '#ef4444'}}>{touched.state && errors.state}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <NumbersIcon style={{margin: 5}}/>
              {`${student.zip ? student.zip : ''}` || 'Click to edit zipcode'}
              </InplaceDisplay>
                <InplaceContent>
                    <InputText
                    placeholder="Zip Code"
                    id="zip"
                    name="zip" 
                     style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.zip && errors.zip && { border: '1px solid #ef4444' }),
                  }}
                    value={values.zip ? values.zip : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                <FormHelperText style={{color: '#ef4444'}}>{touched.zip && errors.zip}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <PsychologyAltOutlinedIcon style={{margin: 5}}/>
              {`${values.allergies_or_special_needs ? values.allergies_or_special_needs : ''}` || 'Click to edit allergies or special needs'}</InplaceDisplay>
                <InplaceContent>
                    <InputText 
                    id="allergies_or_special_needs"
                    name="allergies_or_special_needs"
                    placeholder="allergies or special needs"
                     style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.allergies_or_special_needs && errors.allergies_or_special_needs && { border: '1px solid #ef4444' }),
                  }}
                    value={values.allergies_or_special_needs ? values.allergies_or_special_needs : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                </InplaceContent>
                <FormHelperText style={{color: '#ef4444'}}>{touched.allergies_or_special_needs && errors.allergies_or_special_needs}</FormHelperText>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <ContactEmergencyOutlinedIcon style={{margin: 5}} />
              {`${values.emergency_contact_person ? values.emergency_contact_person : ''}` || 'Click to edit emergency contact person'}</InplaceDisplay>
                <InplaceContent>
                    <InputText 
                    placeholder="emergency contact person"
                    id="emergency_contact_person"
                    name="emergency_contact_person"
                    style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.emergency_contact_person && errors.emergency_contact_person && { border: '1px solid #ef4444' }),
                  }}
                    value={values.emergency_contact_person ? values.emergency_contact_person : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                  <FormHelperText style={{color: '#ef4444'}}>{touched.emergency_contact_person && errors.emergency_contact_person}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

        <div className="card m-3">
            <Inplace closable>
            <InplaceDisplay>
              <LocalHospitalOutlinedIcon style={{margin: 5}}/>
              {`${values.emergency_contact_hospital ? values.emergency_contact_hospital : ''}` || 'Click to edit emergency contact hospital'}</InplaceDisplay>
                <InplaceContent>
                    <InputText 
                    placeholder="emergency contact hospital"
                    id="emergency_contact_hospital"
                    name="emergency_contact_hospital"
                    style={{
                      width: '100%',
                      margin: 10,
                      ...(touched.emergency_contact_hospital && errors.emergency_contact_hospital && { border: '1px solid #ef4444' }),
                  }}
                    value={values.emergency_contact_hospital ? values.emergency_contact_hospital : ''} onChange={handleChange} onBlur={handleBlur} autoFocus />
                <FormHelperText style={{color:'#ef4444'}}>{touched.emergency_contact_hospital && errors.emergency_contact_hospital}</FormHelperText>
                </InplaceContent>
            </Inplace>
        </div>

            <Button
              label={isSubmitting ? 'Saving' : 'Save'}
              loading={isSubmitting}
              severity="info"
              type="submit" // Make sure this is set to "submit"
              style={{
                color: 'white',
                width: '100%',
                backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3b82f6',
                padding: 15,
                marginTop: 10,
                marginBottom: 10,
              }}
              disabled={isSubmitting}
              />


       </Form>
       )}
       </Formik>

        
      </nav>
      <Divider />
      </Box>

                    </div>
                   {student.user_id ? (
                    <div className="flex flex-col mt-5">
                    <span className="text-gray-700 dark:text-white uppercase font-bold tracking-wider mb-2">Parent Bio</span>
                    {student.user ? 
   
                    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: backgroundColor }}>
                    <nav aria-label="main mailbox folders">
                      <List>

                      <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}>
                              <Tooltip title="Parent's Name" arrow>
                              <PersonOutlineOutlinedIcon/> 
                              </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={student.user.name ? student.user.name : 'N/A'} />
                          </ListItemButton>
                        </ListItem>
                        <Divider/>

                                    
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}>
                              <Tooltip title="Parent's Address" arrow>
                              <HomeOutlinedIcon/> 
                              </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={`${student.user.address && student.user.address} ${student.user.address_2 ? `, ${student.user.address_2}` : ''}, ${student.user.city && student.user.city}, ${student.user.state && student.user.state}, ${student.user.zip && student.user.zip}`} />
                          </ListItemButton>
                        </ListItem>
                        <Divider/>
                        

                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}>
                              <Tooltip title="Parent's Number" arrow>
                              <PhoneIphoneOutlinedIcon/> 
                              </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={student.user.phone ? student.user.phone : 'N/A'} />
                          </ListItemButton>
                        </ListItem>
                        <Divider/>

                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon style={{color: isDarkMode ? '#fff' : 'inherit'}}>
                              <Tooltip title="Parent's Email" arrow>
                              <MailOutlineOutlinedIcon/> 
                              </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={student.user.email ? student.user.email : 'N/A'} />
                          </ListItemButton>
                        </ListItem>
                    
                        </List>
                        </nav>
                        </Box>
                    : 
                    'N/A' 
                   }
                    </div>
                   )
                    :
                    <>
                   {auth.role === 'Admin' &&  (
          <>
           
            {loadingParents ? <CircularProgress color="primary"/>
            :
            <>
            <span className="text-indigo-500">
            A parent is not yet associated with {student.first_name} {student.last_name}. 
            Assign {student.first_name}'s parent to this student.
          </span>

            <Formik
              initialValues={parentInitialValues}
              validationSchema={validateData}
              onSubmit={assignParentToStudent}
            >
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
                  {error && (
                    <Box
                      style={{
                        padding: '1rem',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        width: '100%',
                      }}
                    >
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

                  <input type="hidden" name="student_id" id="student_id" value={student.student_id} />
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="user_id">Select Parent</InputLabel>
                    <Select
                      labelId="user_id"
                      id="user_id"
                      name="user_id"
                      value={values.user_id || ''}
                      onChange={handleChange}
                      style={{ width: 300,
                      backgroundColor: backgroundColor
                      }}
                    >
                      <MenuItem value="">
                        <em>Select Parent</em>
                      </MenuItem>

                      {parents.map((parent) => (
                        <MenuItem key={parent.user_id} value={parent.user_id}>
                          {parent.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      color: 'white',
                      width: '100%',
                      backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3b82f6',
                      padding: 15,
                      marginTop: 10,
                    }}
                    disabled={isSubmitting || !isValid || !dirty}
                  >
                    {isSubmitting ? <CircularProgress size={24} style={{ color: '#fff' }} /> : <>Assign</>}
                  </Button>
                </Form>
              )}
            </Formik>
            </>
            }
            
          </>
        )}

                  </>
                  }
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                    <h2 className="text-xl dark:text-white font-bold mb-4">Student Information</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-100 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{assignments.length}</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-100 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Average Grade
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">100/100</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-100 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Teacher
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p className="font-bold text-2xl text-center">
          {student.faculty ? student.faculty.name : 'Unassigned'}
      </p>

        </p>
      </div>
    </div>
  </div>
  
</div>
                    <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">Student Metrics</h2>
                    <AttendanceHistory studentID={student.student_id}/>
                    <AssignmentsTable studentID={student.student_id} />
                    {/* Assignments Table Goes Here */}
                   
                </div>
            </div>
        </div>
    </div>

</AdminLayout>
</>
  );
}
