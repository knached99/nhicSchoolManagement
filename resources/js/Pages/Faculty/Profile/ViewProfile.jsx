import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout'
import React, {useState, useEffect} from 'react';
import { useForm, usePage } from '@inertiajs/react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';
// Icons 
import Avatar from '@mui/material/Avatar';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// Table 
import StudentsTable from '@/Components/AdminComponents/StudentsTable';
import MyAttendanceTable from '@/Components/AdminComponents/MyAttendanceTable';

export default function ViewProfile({auth, user, students}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);


  const profilePicPath = "http://localhost:8000/storage/profile_pics"; 

  //   const formatPermissions = (permissions) => {
  //     if (!permissions || !Array.isArray(permissions)) {
  //         return 'N/A';
  //     }
  
  //     // Replace underscores with spaces and join permissions with spaces
  //     return permissions.map(permission => permission.replace(/_/g, ' ')).join(', ');
  // };

  const initialValues={
    email: user.email,
    phone_number: user.phone,
    role: user.role,
  };

  const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format'),
    phone_number: Yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid US phone number format'),
    role: Yup.string(),
  });


  const updateUserInformation = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(`/updateUserInformation/${user.faculty_id}`, values, {
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
        window.setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
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

  const handleTogglePermissionsMenu = () => {
    setOpenPermissionsMenu(!openPermissionsMenu);
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
      <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">{user.name}'s Profile Page</h2>}
      >
    <div className="bg-gray-100">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
                    {user.profile_pic ? (
                    <>
                    <Avatar alt="Profile Picture" src={`${profilePicPath}/${user.profile_pic}`} sx={{ width: 100, height: 100 }} />
                  
                    </>
                  ) : (
                    <>
                    <Avatar sx={{width: 50, height: 50}} {...stringAvatar(user.name)} />
                    </>
                  )}

                       
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <p className="text-gray-700 text-center font-bold"><MailOutlineOutlinedIcon/> <span className="font-semibold">{user.email}</span></p>

                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Teacher Information</span>
                        <ul>
                        {/* <li className="mb-2">Permissions:  <span className="font-normal">{user.role==='Admin' && 'All Permissions' || user.role==='Teacher' && formatPermissions(user.permissions)}</span></li>                       */}
                        <li className="mb-2"><SmartphoneOutlinedIcon/> {user.phone ?? 'N/A'}</li>
                        <li className="mb-2"><WorkOutlineOutlinedIcon/> {user.role}</li>  
                        </ul>

                        {auth.role === 'Admin' && 
                        <>
                           <button
                              onClick={handleTogglePermissionsMenu}
                              className={`${
                                openPermissionsMenu ? 'bg-blue-700' : 'bg-slate-400 hover:bg-blue-700'
                              } text-white font-bold py-2 px-4 m-4 rounded`}
                            >
                              Edit User {openPermissionsMenu ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </button>


                         <Collapse in={openPermissionsMenu}>
                           <Formik initialValues={initialValues} validationSchema={validation} onSubmit={updateUserInformation}>
                           {({ values, errors, touched, handleSubmit, handleBlur, handleChange, isValid, dirty, isSubmitting, setFieldValue }) => (
                               <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                     
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
                                       <div>
                                       <Field
                                        id="email"
                                        name="email"
                                        helperText={touched.email && errors.email}
                                        error={touched.email && Boolean(errors.email)}
                                        value={values.email}
                                        onBlur={handleBlur}
                                        component={TextField}
                                        style={{ margin: 10 }}
                                        fullWidth
                                        onChange={handleChange}
                                      />


                                       </div>

                                       <div>
                                       <Field
                                       id="phone_number"
                                       name="phone_number"
                                       helperText={touched.phone_number && errors.phone_number}
                                       error={touched.phone_number && Boolean(errors.phone_number)}
                                       value={values.phone_number}
                                       onBlur={handleBlur}
                                       component={TextField}
                                       style={{ margin: 10 }}
                                       fullWidth
                                       onChange={handleChange}
                                   />
                                       </div>

                                       <div>
                                       <FormControl sx={{ m: 1, width: '100%', }}>
                                      <InputLabel id="role">Select Role</InputLabel>
                                      <Select
                                      labelId="role"
                                      id="role"
                                      name="role"
                                      value={values.role}
                                      onChange={handleChange}
                                    >
                                      <MenuItem value="">
                                        <em>Make a Selection</em>
                                      </MenuItem>
                                      <MenuItem value="Admin">Admin</MenuItem>
                                      <MenuItem value="Teacher">Teacher</MenuItem>
                                      <MenuItem value="Assistant Teacher">Assistant Teacher</MenuItem>
                                      {values.role && (
                                        <MenuItem value={values.role} disabled>
                                          {values.role}
                                        </MenuItem>
                                      )}
                                    </Select>

                                      {touched.role && errors.role && (
                                          <FormHelperText>{errors.role}</FormHelperText>
                                      )}
                                  </FormControl>
                                     
                                       </div>
               
                                       <div className="flex items-center gap-4">
                                       <Button
                                       type="submit"
                                       variant="contained"
                                       style={{
                                           color: 'white',
                                           width: '100%',
                                           backgroundColor: isSubmitting ? '#l66534' : '#3d5afe',
                                           padding: 15,
                                           marginTop: 10,
                                       }}
                                       disabled={isSubmitting}
                                   >
                                       {isSubmitting ? (
                                           <CircularProgress size={24} style={{ color: '#fff' }} />
                                       ) : (
                                           <>Save</>
                                       )}
                                   </Button>
               
               
                                       </div>
                                   </form>
                               )}
                           </Formik>
                           </Collapse>
                           </>
                        }
                        
                     
                    </div>
              
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Teacher's Information</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Students
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{students.length}</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Total Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">10</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Faculty Since
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p className="font-bold text-2xl text-center">
          {new Date(user.created_at).toLocaleDateString()}
      </p>

        </p>
      </div>
    </div>
  </div>
  
</div>
                    <h2 className="text-xl font-bold mt-6 mb-4">Students</h2>
                    <StudentsTable auth={auth} path={`/showStudentsForTeacher/${user.faculty_id}`}/>
                    <MyAttendanceTable/>

                    {/* <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
</div>

</AdminLayout>
</>
  );
}
