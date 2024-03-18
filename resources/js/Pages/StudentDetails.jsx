import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, Head } from '@inertiajs/react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import React, {useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

import CircularProgress from '@mui/material/CircularProgress';

// ICONS 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import Face6OutlinedIcon from '@mui/icons-material/Face6Outlined';
import Face3OutlinedIcon from '@mui/icons-material/Face3Outlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

// Lists

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import states from '@/constants/states';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // Set to a percentage for responsiveness
  maxWidth: 400, // Set a maximum width
  maxHeight: '80vh', // Set a maximum height (80% of the viewport height)
  overflowY: 'auto', // Enable vertical scrolling when content exceeds the height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
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
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );



  

export default function StudentDetails({auth, student}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);

    
  
    const initialValues = {
        student_id: student.student_id, 
        address: student.address, 
        street_address_2: student.street_address_2, 
        city: student.city, 
        state: student.state,
        zip: student.zip,
        gender: student.gender,
        date_of_birth: student.date_of_birth, 
        allergies_or_special_needs: student.allergies_or_special_needs,
        emergency_contact_person: student.emergency_contact_person,
        emergency_contact_hospital: student.emergency_contact_hospital
    };

    const validationSchema = Yup.object().shape({
        address: Yup.string().nullable().matches(/^[a-zA-Z0-9\s,.-]+$/, 'Invalid address'),
        street_address_2: Yup.string().nullable().matches(/^[a-zA-Z0-9\s]+$/, 'Invalid apartment or unit number'),
        city: Yup.string().nullable(),
        state: Yup.string().nullable(),
        zip: Yup.string().nullable().matches(/^\d{5}$/, 'Must be a valid 5-digit ZIP code'),
        gender: Yup.string().nullable(), 
        date_of_birth: Yup.string().nullable(),
        allergies_or_special_needs: Yup.string().nullable(),
        emergency_contact_person: Yup.string().nullable(),
        emergency_contact_hospital: Yup.string().nullable()
    });
    

    const updateStudentInformation = async (values, {setSubmitting})=>{
        try{
            const response = await axios.put(`/updateStudentInformation/${values.student_id}`, values, {
                headers: {
                    'Content-Type': 'application/json'
                  },
            });

            if(response.data.errors){
                setError(response.data.errors);
                setErrorOpen(true);
            }
            else if(response.data.success){
                setSuccess(response.data.success);
                setSuccessOpen(true);
                // Reset form values
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                });
                window.setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
        catch(error){
            setError(error.message || 'Whoops, something went wrong');
            setErrorOpen(true);
        }
        finally{
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

  return (
    <>
     <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{student.first_name} {student.last_name}'s profile</h2>}
        >
    <Head title={`${student.first_name} ${student.last_name}'s information`} />
    <div className="bg-gray-100">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
                    <Link href="/dashboard" class="float-start mb-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                    <ArrowBackOutlinedIcon/>  Back
                  </Link>

                    <Avatar sx={{ width: 100, height: 100 }} {...stringAvatar(`${student.first_name} ${student.last_name}`)} />
                        <h1 className="text-xl font-bold">{student.first_name} {student.last_name}</h1>
                        <p className="text-gray-700 text-center font-bold mt-3">Student Since: <span className="font-normal">{new Date(student.created_at).toLocaleDateString()}</span></p>
    
                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Student Bio</span>
                       
                        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <Tooltip title="Edit Information" arrow>
                        <IconButton onClick={handleOpen}>
                            <EditOutlinedIcon/>
                        </IconButton>
                        </Tooltip>
                        {/* Modal Start */}
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
              Edit {student.first_name} {student.last_name}'s information
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Edit and save the new information
            </Typography>
             

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={updateStudentInformation}>
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
                            <Field as={TextField} value={values.address} helperText={touched.address && errors.address} error={touched.address && Boolean(errors.address)} onBlur={handleBlur} onChange={handleChange} id="address" name="address" placeholder="Address" style={{margin: 10}} fullWidth/>
                            <Field as={TextField} value={values.street_address_2} helperText={touched.street_address_2 && errors.street_address_2} error={touched.street_address_2 && Boolean(errors.street_address_2)} onBlur={handleBlur} onChange={handleChange} id="street_address_2" name="street_address_2" placeholder="Apartment/Unit" style={{margin: 10}} fullWidth/>
                            <Field as={TextField} value={values.city} helperText={touched.city && errors.city} error={touched.city && Boolean(errors.city)} onBlur={handleBlur} onChange={handleChange} id="city" name="city" placeholder="City" style={{margin: 10}} fullWidth/>
                            <FormControl sx={{mx: 1, mt:3, mb:3, width: '100%' }}>
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

          <Field as={TextField} value={values.zip} helperText={touched.zip && errors.zip} error={touched.zip && Boolean(errors.zip)} onBlur={handleBlur} onChange={handleChange} id="zip" name="zip" placeholder="Zip" style={{margin: 10}} fullWidth/>
          <FormControl sx={{mx: 1, mt:3, mb:3, width: '100%'}}>
              <InputLabel id="gender">Select Gender</InputLabel>
              <Select
              labelId="gender"
              id="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              error={touched.gender && Boolean(errors.gender)}
              onBlur={handleBlur}
              >
             <MenuItem value="">
              <em>Select Gender</em>
             </MenuItem>
             <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              </Select>
              {touched.gender && errors.gender && (
              <FormHelperText style={{color: 'red'}}>{errors.gender}</FormHelperText>
            )}
            </FormControl>

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={[
                'DatePicker',
                'MobileDatePicker',
                'DesktopDatePicker',
                'StaticDatePicker',
                ]}
            >
         <DemoItem label="Date Of Birth">
         <DatePicker style={{margin: 5}} value={values.date_of_birth} helperText={touched.date_of_birth && errors.date_of_birth} error={touched.date_of_birth && Boolean(errors.date_of_birth)} id="date_of_birth" name="date_of_birth" onBlur={handleBlur} onChange={handleChange} defaultValue={dayjs(student.date_of_birth)} />
        </DemoItem>
            </DemoContainer>
            </LocalizationProvider> */}
            <Field as={TextField} type="date" value={values.date_of_birth} helperText={touched.date_of_birth && errors.date_of_birth} error={touched.date_of_birth && Boolean(errors.date_of_birth)} onBlur={handleBlur} id="date_of_birth" name="date_of_birth" placeholder="Date Of Birth" fullWidth style={{margin: 10}} />

            <Field as={Textarea } value={values.allergies_or_special_needs} helperText={touched.allergies_or_special_needs && errors.allergies_or_special_needs} error={touched.allergies_or_special_needs && Boolean(errors.allergies_or_special_needs)} onBlur={handleBlur} onChange={handleChange} id="allergies_or_special_needs" name="allergies_or_special_needs" placeholder="Allergies or Special Needs" style={{margin: 10}} fullWidth/>
            <Field as={TextField} value={values.emergency_contact_person} helperText={touched.emergency_contact_person && errors.emergency_contact_person} error={touched.emergency_contact_person && Boolean(errors.emergency_contact_person)} onBlur={handleBlur} onChange={handleChange} id="emergency_contact_person" name="emergency_contact_person" placeholder="Emergency Contact Person" style={{margin: 10}} fullWidth/>
            <Field as={TextField} value={values.emergency_contact_hospital} helperText={touched.emergency_contact_hospital && errors.emergency_contact_hospital} error={touched.emergency_contact_hospital && Boolean(errors.emergency_contact_hospital)} onBlur={handleBlur} onChange={handleChange} id="emergency_contact_hospital" name="emergency_contact_hospital" placeholder="Emergency Contact Hospital" style={{margin: 10}} fullWidth/>
            <Button type="submit" fullWidth style={{margin:5}}>Save Changes</Button>
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
        </Form>
            )}
            </Formik>
          </Box>
        </Fade>
      </Modal>
      {/* Modal End */}
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Street Address" arrow>
                <HomeOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={`${student.address}${student.street_address_2 ? `, ${student.street_address_2}` : ''}, ${student.city}, ${student.state}, ${student.zip}`} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
               {student.gender &&
                student.gender === 'Male' && (
                  <>
                  <Tooltip title="Gender" arrow>
                  <Face6OutlinedIcon/>
                  </Tooltip>
                  </>
                )
               }
               {
                student.gender === 'Female' && (
                  <>
                  <Tooltip title="Gender" arrow>
                  <Face3OutlinedIcon/>
                  </Tooltip>
                  </>
                  
                )
               }
              </ListItemIcon>
              <ListItemText primary={student.gender ? student.gender : 'N/A'} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Birthday" arrow>
                <CakeOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={student.date_of_birth ? student.date_of_birth : 'N/A'} />
            </ListItemButton>
          </ListItem>
          <Divider />


        <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Level" arrow>
                <GradeOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={student.level ? student.level : 'N/A'} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Allergies or Special Needs" arrow>
                <PsychologyAltOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={student.allergies_or_special_needs ? student.allergies_or_special_needs : 'N/A'} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Emergency Contact Person" arrow>
                <ContactEmergencyOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={student.emergency_contact_person ? student.emergency_contact_person : 'N/A'} />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Tooltip title="Emergency Contact Hospital" arrow>
                <LocalHospitalOutlinedIcon/> 
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={student.emergency_contact_hospital ? student.emergency_contact_hospital : 'N/A'} />
            </ListItemButton>
          </ListItem>
          </List>

        
      </nav>
      <Divider />
      </Box>

                    </div>
               
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Student Information</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{student.assignments.length}</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
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
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
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

                </div>
            </div>
        </div>
    </div>
</div>
</AuthenticatedLayout>
</>
  );
  
}
