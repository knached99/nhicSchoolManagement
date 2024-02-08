import React, {useState} from 'react';
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Zoom from '@mui/material/Zoom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
 boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
p: 4,
};


export default function CreateFacultyModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorOpen, setErrorOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(true);
  const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);

  // Form Intial Values
  const initialValues = {
    name: '',
    email: '',
    phone_number: '',
    role: '',
    permissions: [],
  };

  // Yup Validation
  const validation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone_number: Yup.string()
      .matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid US phone number format')
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

            // Reset form values
            Object.keys(values).forEach((key) => {
                values[key] = '';
            });
        }
    } catch (error) {
        setError(error.message || 'An error occurred');
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
      

  return (
    <div className="inline-flex items-center px-1 pt-1 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none">
    <Tooltip title="Create Faculty User" TransitionComponent={Zoom}>
        <IconButton onClick={handleOpen} className="hover:text-emerald-500">
            <AddCircleOutlineIcon/>
        </IconButton>
    </Tooltip>
      <Modal
       open={open}
       onClose={handleClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
       style={{
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
       }}
      >
        <Box   style={{
          width: '100%',
          maxWidth: '80%',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#fff'
        }}>

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
                <CloseIcon/>
            </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a User
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          As an administrative user, you have the ability to assign roles and privileges to different faculty users of this system.
          <span className="text-indigo-800 font-semibold">
          Upon successful user creation, the new user will get an email, notifying them that they've been assigned the role and will receive a temporary password to login with. 
          </span>
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
            <Field as={TextField} value={values.name} helperText={touched.name && errors.name} error={touched.name && Boolean(errors.name)} onBlur={handleBlur} id="name" name="name" placeholder="Name" fullWidth style={{margin: 5}} />
            <Field as={TextField} value={values.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} id="email" name="email" placeholder="Email" fullWidth style={{margin: 5}} />
            <Field as={TextField} onChange={handleChange} value={values.phone_number} helperText={touched.phone_number && errors.phone_number} error={touched.phone_number && Boolean(errors.phone_number)} onBlur={handleBlur} id="phone_number" name="phone_number" placeholder="Phone Number" fullWidth style={{margin: 5}} />
            <FormControl sx={{ m: 1, width: '100%', }}>
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
                <MenuItem value="Teacher">Teacher</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
            </Select>
             {touched.role && errors.role && (
                <FormHelperText>{errors.role}</FormHelperText>
             )}
        </FormControl>

        <Button onClick={handleTogglePermissionsMenu} variant="outlined" style={{ margin: '10px 0' }}>
        {openPermissionsMenu ? 'Hide Permissions' : 'Show Permissions (For Teachers Only)'}
        </Button>

        <Collapse in={openPermissionsMenu}>   
        <FormGroup>
          <p className="text-start text-slate-600 mt-3 mb-3 font-bold">Teacher Permissions <span className="block font-normal">(You can modify these any time. Also please note, admins are granted all these permissions.)</span></p>
          {/* <FormControlLabel control={<Field as={Switch} value="can_view_all_students" name="permissions" id="can_view_all_students" />} label="Can view all students"/> */}
          <FormControlLabel control={<Field as={Switch} value="can_batch_import_students" name="permissions" id="can_batch_import_students" />} label="Can batch import students"/>
          <FormControlLabel control={<Field as={Switch} value="can_add_student" name="permissions" id="can_add_student" />} label="Can add student"/>
          <FormControlLabel control={<Field as={Switch} value="can_delete_parents" name="permissions" id="can_delete_parents" />} label="Can delete parents"/> 
          <FormControlLabel control={<Field as={Switch} value="can_delete_students" name="permissions" id="can_delete_students" />} label="Can delete students"/>
          <FormControlLabel control={<Field as={Switch} value="can_create_faculty_users" name="permissions" id="can_create_faculty_users" />} label="Can create faculty users"/>
          <FormControlLabel control={<Field as={Switch} value="can_delete_faculty_users" name="permissions" id="can_delete_faculty_users" />} label="Can delete faculty users"/>
          <FormControlLabel control={<Field as={Switch} value="can_revoke_user_access" name="permissions" id="can_revoke_user_access" />} label="Can revoke user access"/>
        </FormGroup>
        </Collapse>

       

 



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
      </Modal>
    </div>
  )
}
