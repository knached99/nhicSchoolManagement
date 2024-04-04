import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout'
import React, {useState, useEffect} from 'react';
import { Link} from '@inertiajs/react';
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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';
import Tooltip from '@mui/material/Tooltip';

// Prime React Components 

import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';


// Icons 
import Avatar from '@mui/material/Avatar';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ComputerIcon from '@mui/icons-material/Computer';
// Table 
import StudentsTable from '@/Components/AdminComponents/StudentsTable';
import MyAttendanceTable from '@/Components/AdminComponents/MyAttendanceTable';

import { Calendar } from 'primereact/calendar';
        
export default function ViewProfile({auth, user, students, bannedDetails, clientIP, assignmentsCount}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [banError, setBanError] = useState(null);
  const [banSuccess, setBanSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [banSuccessOpen, setBanSuccessOpen] = useState(true);
  const [banErrorOpen, setBanErrorOpen] = useState(true);
  const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);
  const [openBanBlock, setOpenBanBlock] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [checked, setChecked] = useState(false);

  const profilePicPath = "http://localhost:8000/storage/profile_pics"; 


  const initialValues={
    email: user.email,
    phone_number: user.phone,
    role: user.role,
  };

  const validation = Yup.object().shape({
    email: Yup.string().email('Invalid email format'),
    phone_number: Yup.string().matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid US phone number format'),
    role: Yup.string(),
  });

  const banInitialValues = {
    ban_status: '',
    permanent_ban: '',
    client_ip: clientIP,
    banned_until: '',
    ban_reason: ''
  };

  const banValidationSchema = Yup.object().shape({
    ban_status: Yup.string().required('Must select ban or unban'),
    //permanent_ban: Yup.string().required('Must select Yes or No')
  });

  const updateBanStatus = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put(`/banOrUnbanUser/${user.faculty_id}`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Values Selected: ' + values);
  
      if (response.data.errors) {
        setBanError(response.data.errors);
        setBanErrorOpen(true);
      } else if (response.data.success) {
        setBanSuccess(response.data.success);
        setBanError(null);
        setBanSuccessOpen(true);
        Object.keys(values).forEach((key) => {
          values[key] = '';
        });
        window.setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setBanError(error.message || 'An unexpected error occurred');
      setBanErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };


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
        setError(null);
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



const handleBanCloseSuccess = () => {
  setBanSuccessOpen(false);
  setBanSuccess(null);
};

const handleBanCloseError = () => {
  setBanErrorOpen(false);
  setBanError(null);
};

  const handleTogglePermissionsMenu = () => {
    setOpenPermissionsMenu(!openPermissionsMenu);
  };

  const handleBanBlock = () => {
    setOpenBanBlock(!openBanBlock);
  }
    

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
  

  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);
  }, []);
  
  const backgroundColor = isDarkMode ? '#000' : 'background.paper';

  useEffect(() => {
    const getBanStatus = async () => {
      try {
        const response = await axios.get(`/getBanStatus/${user.user_id}`);
        const data = await response.json();

        setChecked(data.ban_status);
      } catch (error) {
        console.error('Error fetching ban status:', error);
      }
    };

    // Check if the user object is available before calling the function
    if (user && user.user_id) {
      getBanStatus(user.user_id);
    }
  }, [user, banSuccess]); // Add any other dependencies as needed

  const roles = [
    { name: 'Admin', value: 'Admin' },
    { name: 'Teacher', value: 'Teacher' },
    { name: 'Assistant Teacher', value: 'Assistant Teacher' }
  ];
  

  return (
    <>
      <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">{user.name}'s Profile Page</h2>}
      >
    <div className="container mx-auto py-8" >
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
                    <Link href="/faculty/dash" class="float-start mb-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                    <ArrowBackOutlinedIcon/>  Back
                  </Link>
                    {user.profile_pic ? (
                    <>
                    <Avatar alt="Profile Picture" src={`${profilePicPath}/${user.profile_pic}`} sx={{ width: 100, height: 100 }} />
                  
                    </>
                  ) : (
                    <>
                    <Avatar sx={{width: 50, height: 50}} {...stringAvatar(user.name)} />
                    </>
                  )}

                       
                        <h1 className="text-xl font-bold dark:text-white">{user.name}</h1>
                        <p className="text-gray-700 dark:text-white text-center font-bold"><MailOutlineOutlinedIcon/> <span className="font-semibold">{user.email}</span></p>

                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col dark:text-white">
                        <span className="dark:text-white text-gray-700 uppercase font-bold tracking-wider mb-2">Team Member's Bio</span>
                        <ul>
                        {/* <li className="mb-2">Permissions:  <span className="font-normal">{user.role==='Admin' && 'All Permissions' || user.role==='Teacher' && formatPermissions(user.permissions)}</span></li>                       */}
                        <li className="mb-2">
                          <Tooltip title="Phone Number" arrow>
                          <SmartphoneOutlinedIcon/>
                          </Tooltip>
                           {user.phone ?? 'N/A'}
                           </li>
                        <li className="mb-2">
                          <Tooltip title="Role" arrow>
                          <WorkOutlineOutlinedIcon/>
                          </Tooltip>
                           {user.role}
                           </li>

                        <li className="mb-2">
                          <Tooltip title="Detected IP Address" arrow>
                          <ComputerIcon/>
                          </Tooltip>
                          {clientIP ?? 'N/A'}
                          </li>
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
                                       {/* <Field
                                        id="email"
                                        name="email"
                                        className=""
                                        helperText={touched.email && errors.email}
                                        error={touched.email && Boolean(errors.email)}
                                        value={values.email}
                                        onBlur={handleBlur}
                                        component={TextField}
                                        style={{ margin: 10 }}
                                        fullWidth
                                        onChange={handleChange}
                                      /> */}
                                      <InputText 
                                      id="email"
                                      name="email"
                                      value={values.email}
                                      className="w-full"
                                      onChange={handleChange} 
                                      onBlur={handleBlur} 
                                      style={{
                                        width: '100%',
                                        ...(touched.email && errors.email && { border: '1px solid #ef4444' }),
                                    }}
                                      />


                                       </div>

                                       <div>
                                       {/* <Field
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
                                   /> */}
                                               <InputMask
             id="phone_number" 
             name="phone_number" 
             value={values.phone_number} 
             style={{
                width: '100%',
                ...(touched.phone_number && errors.phone_number && { border: '1px solid #ef4444' }),
            }}
             onChange={handleChange} 
             onBlur={handleBlur}  
             mask="(999) 999-9999" 
             placeholder="(999) 999-9999">
             </InputMask>
             <span className="text-red-500">{touched.phone_number && errors.phone_number}</span>
                                       </div>

                                       <div>
                                       <Dropdown 
                                      className={`${touched.role && errors.role ? 'border-red-500 border-1' : ''}`}
                                      value={values.role} 
                                      onChange={handleChange}
                                      id="role"
                                      name="role"
                                      placeholder="Select Role"
                                      options={roles.map(role => ({ value: role.value, label: role.name }))}
                                  />

                              
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
                            
                            {/* Start IP Ban Block */}
                            <>
                           <button
                              onClick={handleBanBlock}
                              className={`${
                                openPermissionsMenu ? 'bg-blue-700' : 'bg-slate-400 hover:bg-blue-700'
                              } text-white font-bold py-2 px-4 m-4 rounded`}
                            >
                              Ban User {openBanBlock ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                            </button>


                         <Collapse in={openBanBlock}>
                         
                        <div className="border-t-2 border-slate-800"></div>
                        {bannedDetails && bannedDetails.length !== 0 && (
  <>
    <h6 className="text-black dark:text-white font-black text-xl">
      Ban Details
    </h6>

    <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-white">
      <li className="flex items-center font-bold">
        Client IP Address:
        <span className="inline-block ml-2 text-black dark:text-white">
        {clientIP}
        </span>
      </li>

      <li className="flex items-center font-bold">
        Status:
        <span className="inline-block ml-2 text-black dark:text-white">
          {bannedDetails[0].ban_status === 0 ? (
            <span className="text-emerald-500">Not Banned</span>
          ) : bannedDetails[0].ban_status === 1 ? (
            <span className="text-red-500">Banned</span>
          ) : null}
        </span>
      </li>


      <li className="flex items-center font-bold">
        Banned On:
        <span className="inline-block ml-2 text-black dark:text-white">
          {new Date(bannedDetails[0].created_at).toLocaleDateString()}
        </span>
      </li>

      <li className="flex items-center font-bold">
        Banned Until:
        <span className="inline-block ml-2 text-black dark:text-white">
          {new Date(bannedDetails[0].banned_until).toLocaleDateString()}
        </span>
      </li>

      <li className="flex items-center font-bold">
        Reason:
        <span className="inline-block ml-2 text-black dark:text-white">
          {bannedDetails[0].ban_reason ? bannedDetails[0].ban_reason : 'None Provided'}
        </span>
      </li>

      <li className="flex items-center font-bold">
        Permanently Banned?
        <span className="inline-block ml-2 text-black dark:text-white">
          {bannedDetails[0].permanent_ban !== undefined ? (
            bannedDetails[0].permanent_ban === 0 ? (
              <span className="text-emerald-500">No</span>
            ) : bannedDetails[0].permanent_ban === 1 ? (
              <span className="text-red-500">Yes</span>
            ) : null
          ) : null}
        </span>
      </li>

    </ul>
  </>
)}

                      
{user.client_ip !== null && 
  <Formik initialValues={banInitialValues} validationSchema={banValidationSchema} onSubmit={updateBanStatus}>
                           {({ values, errors, touched, handleSubmit, handleBlur, handleChange, isValid, dirty, isSubmitting, setFieldValue }) => (
                               <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                   
                            {banError && (
                            <Box   style={{
                              padding: '1rem',
                              maxHeight: '80vh',
                              overflowY: 'auto',
                              width: '100%'
                            }}>
                                <Collapse in={banErrorOpen}>
                                    <Alert
                                        icon={<ErrorOutlineIcon fontSize="inherit" />}
                                        severity="error"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={handleBanCloseError}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        {banError}
                                    </Alert>
                                </Collapse>
                            </Box>
                        )}

                        {banSuccess && (
                            <Box sx={{ width: '100%' }}>
                                <Collapse in={banSuccessOpen}>
                                    <Alert
                                        icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                                        severity="success"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={handleBanCloseSuccess}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        }
                                        sx={{ mb: 2 }}
                                    >
                                        {banSuccess}
                                    </Alert>
                                </Collapse>
                            </Box>
                        )}


    <div className="flex flex-wrap gap-3">
    <h6>Ban User?</h6>
    <span className="text-red-500 block">{touched.ban_status && errors.ban_status}</span>

        <div className="flex align-items-center">
          <input
            type="radio"
            id="ban_status"
            name="ban_status"
            value="0"
            onChange={handleChange}
            checked={values.ban_status === '0'}
          />
          <label htmlFor="ban_status" className="ml-2">Unban</label>
        </div>

        <div className="flex align-items-center">
          <input
            type="radio"
            id="ban_status_ban"
            name="ban_status"
            value="1"
            onChange={handleChange}
            checked={values.ban_status === '1'}
          />
          <label htmlFor="ban_status_ban" className="ml-2">Ban</label>
        </div>


      </div>

      {bannedDetails && bannedDetails.length > 0 ? (
  <>
  </>
) : (
  <div className="flex flex-wrap gap-3">
    <h6>Permanently Ban User?</h6>
    <span className="text-red-500 block">{touched.permanent_ban && errors.permanent_ban}</span>

    <div className="flex align-items-center">
      
      <input
        type="radio"
        id="permanent_ban"
        name="permanent_ban"
        value="0"
        onChange={handleChange}
        checked={values.permanent_ban === '0'}
      />
      <label htmlFor="ban_permanent_status" className="ml-2">
        No
      </label>
    </div>

    <div className="flex align-items-center">
      <input
        type="radio"
        id="permanent_ban"
        name="permanent_ban"
        value="1"
        onChange={handleChange}
        checked={values.permanent_ban === '1'}
      />
      <label htmlFor="ban_status_ban" className="ml-2">
        Yes
      </label>
    </div>

    <div className="flex flex-wrap gap-3">
    <div className="card flex justify-content-center">
      <label className="dark:text-white block">ban user until</label>
      <Calendar onChange={handleChange} 
      type="date"
      id="banned_until"
      name="banned_until"
      onBlur={handleBlur}
      />
      {/* <input
        type="date"
        className="block dark:text-white border-slate-400 rounded dark:bg-slate-800 w-full"
        id="banned_until"
        name="banned_until"
        onChange={handleChange}
        onBlur={handleBlur}
      /> */}
      </div>
    </div>

    <div className="flex flex-wrap gap-3">
      <InputTextarea
        rows={5}
        cols={30}
        id="ban_reason"
        name="ban_reason"
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Why are you banning this user? This message will be shown to the user when they attempt to log in."
      />
    </div>
  </div>
)}


 

               
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
}

             </Collapse>
             </>
              {/* End IP Ban Block */}
             </>
        
           }
                        
                     
      </div>
              
                   
   </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="dark:bg-slate-800 bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Team Member's Information</h2>
                    
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-600 dark:text-white border-slate-900 dark:border-slate-200 border-2 shadow-md bg-clip-border rounded-xl">
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
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-600 dark:text-white border-slate-900 dark:border-slate-200 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Total Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{assignmentsCount}</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-600 dark:text-white border-slate-900 dark:border-slate-200 border-2 shadow-md bg-clip-border rounded-xl">
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
                    <h2 className="text-xl font-bold mt-6 mb-4 dark:text-white">Students</h2>

                    <StudentsTable auth={auth} path={`/showStudentsForTeacher/${user.faculty_id}`}/>
                    <div className="dark:border-white dark:border-b-2"></div>
                    {auth.role === 'Teacher' || auth.role === 'Substitute Teacher' && auth.faculty_id !== user.faculty_id ? (
                    <p></p>
                  ) : (
                    <MyAttendanceTable facultyID={user.faculty_id} auth={auth && auth.faculty_id} />
                  )}


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

</AdminLayout>
</>
  );
}
