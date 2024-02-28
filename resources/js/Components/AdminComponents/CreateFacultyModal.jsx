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
        

        


export default function CreateFacultyModal() {
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

  // Form Intial Values
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    role: '',
    permissions: [],
  };

  // Yup Validation
  const validation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid US phone number format')
      .required('Phone number is required'),
    role: Yup.string().required('Role is required'),
  });

  const createFacultyRole = async (values, { setSubmitting }) => {
    try {
        const response = await axios.post('/createFacultyRole', values, {
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
            window.location.reload();

            // Reset form values
            Object.keys(values).forEach((key) => {
                values[key] = '';
            });
            window.setTimeout(() => {
                window.location.reload();
              }, 2000);
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
    <div className="inline-flex items-center px-1 pt-1 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none">
    <Tooltip title="Invite Team Member" TransitionComponent={Zoom}>
        <IconButton onClick={handleOpen} className="hover:text-slate-100">
            <PersonAddAltOutlinedIcon style={{color: '#fff', fontSize: 35}}/>
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
           <h1 className="font-black text-2xl"> Invite a team member to this organization </h1>
          </Typography>
          <Typography style={{color: isDarkMode ? '#fff' : 'inherit'}} id="modal-modal-description" sx={{ mt: 2 }}>
          <h5 className="mb-3 font-bold"> As an administrative user, you have the ability to assign roles and privileges to different faculty users of this system.</h5>

         <h5 className="font-semibold m-5"> 
         <Alert  severity="info">
            Upon invitation, the invited user will get an email with login credentials so they can login to the system.
         </Alert>
       
          </h5>
          </Typography>
          <Formik initialValues={initialValues} validationSchema={validation} onSubmit={createFacultyRole}>

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
            id="name"
            name="name"
            value={values.name}
            style={{
                width: '100%',
                ...(touched.name && errors.name && { border: '1px solid #ef4444' }),
            }}
            onChange={handleChange} 
            onBlur={handleBlur} 
            placeholder="Name"
            className="mb-3 mt-3"
            />
           <span className="text-red-500">{touched.name && errors.name}</span>


           <InputText 
            id="email"
            name="email"
            value={values.email}
            style={{
                width: '100%',
                ...(touched.email && errors.email && { border: '1px solid #ef4444' }),
            }}
            onChange={handleChange} 
            onBlur={handleBlur} 
            placeholder="Email"
            className="mb-3 mt-3"
            />
           <span className="text-red-500">{touched.email && errors.email}</span>

            
            {/* <Field as={TextField} value={values.name} helperText={touched.name && errors.name} error={touched.name && Boolean(errors.name)} onBlur={handleBlur} id="name" name="name" placeholder="Name" fullWidth style={{margin: 5}} /> */}
            {/* <Field as={TextField} value={values.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} id="email" name="email" placeholder="Email" fullWidth style={{margin: 5}} /> */}
            <InputMask
             id="phone" 
             name="phone" 
             value={values.phone} 
             style={{
                width: '100%',
                ...(touched.phone && errors.phone && { border: '1px solid #ef4444' }),
            }}
             onChange={handleChange} 
             onBlur={handleBlur}  
             mask="(999) 999-9999" 
             className="mb-3 mt-3"
             placeholder="(999) 999-9999">
             </InputMask>
             <span className="text-red-500">{touched.phone && errors.phone}</span>

            {/* <Field as={TextField} onChange={handleChange} value={values.phone} helperText={touched.phone && errors.phone} error={touched.phone && Boolean(errors.phone)} onBlur={handleBlur} id="phone" name="phone" placeholder="Phone Number" fullWidth style={{margin: 5}} /> */}
            <select name="role" 
            id="role"
            className="dark:bg-slate-900 dark:text-white w-full mt-3 mb-3 rounded border-none outline-none p-3"
            value={values.role}
            onChange={handleChange}
            >
            <option value="Admin">Admin</option>
            <option value="Teacher">Teacher</option>
            <option value="Assistant Teacher">Assistant Teacher</option>
            </select>
          {/* <FormControl sx={{ m: 1, width: '100%', }}>
            <InputLabel id="role">Select Role</InputLabel>
            <Select
                labelId="role"
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange} >
                <MenuItem value="">
                    <em>Make a Selection</em>
                </MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Asisstant Teacher">Asisstant Teacher</MenuItem>
            </Select>
             {touched.role && errors.role && (
                <FormHelperText>{errors.role}</FormHelperText>
             )}
        </FormControl> */}

        {/* <Button onClick={handleTogglePermissionsMenu} variant="outlined" style={{ margin: '10px 0' }}>
        {openPermissionsMenu ? 'Hide Permissions' : 'Show Permissions (For Teachers Only)'}
        </Button>

        <Collapse in={openPermissionsMenu}>   
        <FormGroup>
          <p className="text-start text-slate-600 mt-3 mb-3 font-bold">Teacher Permissions <span className="block font-normal">(You can modify these any time. Also please note, admins are granted all these permissions.)</span></p>
          <FormControlLabel control={<Field as={Switch} value="can_batch_import_students" name="permissions" id="can_batch_import_students" />} label="Can batch import students"/>
          <FormControlLabel control={<Field as={Switch} value="can_add_student" name="permissions" id="can_add_student" />} label="Can add student"/>
          <FormControlLabel control={<Field as={Switch} value="can_delete_parents" name="permissions" id="can_delete_parents" />} label="Can delete parents"/> 
          <FormControlLabel control={<Field as={Switch} value="can_delete_students" name="permissions" id="can_delete_students" />} label="Can delete students"/>
          <FormControlLabel control={<Field as={Switch} value="can_create_faculty_users" name="permissions" id="can_create_faculty_users" />} label="Can create faculty users"/>
          <FormControlLabel control={<Field as={Switch} value="can_delete_faculty_users" name="permissions" id="can_delete_faculty_users" />} label="Can delete faculty users"/>
          <FormControlLabel control={<Field as={Switch} value="can_revoke_user_access" name="permissions" id="can_revoke_user_access" />} label="Can revoke user access"/>
        </FormGroup>
        </Collapse> */}

        <Button 
        type="submit"
        label={isSubmitting ? 'creating user' : 'create user'}
        disabled={isSubmitting || !isValid || !dirty}
        loading={isSubmitting}
        severity="info"
        style={{width: '100%', padding: 15}}
        />


        {/* <Button
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
                                    </Button> */}
         </Form>
         )}
         </Formik>
        </Box>
        </Fade>
      </Modal>
    </div>
  )
}
