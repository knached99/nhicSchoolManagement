import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

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
    const [role, setRole] = useState('');

    const handleRoleSelect = (event) => {
        setRole(event.target.value);
      };

    // Form Intial Values
    const initialValues = {
        name: '',
        email: '',
        phone_number: '',
        role: '',
    };
    // Yup Validation 
    const validation = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        phone_number: Yup.string()
          .matches(/^\d{3}-\d{3}-\d{4}$/, 'Invalid US phone number format')
          .required('Phone number is required'),
        role: Yup.string().required('Role is required')
      });

      const handleSubmit = () => {
        console.log('ALERT');
      };

      
      

  return (
    <div className="inline-flex items-center px-1 pt-1 text-lg font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ">
    <Tooltip title="Create Faculty User">
        <IconButton onClick={handleOpen} className="hover:text-emerald-500">
            <AddCircleOutlineIcon/>
        </IconButton>
    </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
          <Formik initialValues={initialValues} validationSchema={validation} onSubmit={handleSubmit}>

          {({
            values, 
            errors,
            touched,
            handleSubmit,
            handleBlur,
            isValid,
            dirty,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} autoComplete="off">
            <Field as={TextField} value={values.name} helperText={touched.name && errors.name} error={touched.name && Boolean(errors.name)} onBlur={handleBlur} id="name" name="name" placeholder="Name" fullWidth style={{margin: 5}}/>
            <Field as={TextField} value={values.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} id="email" name="email" placeholder="Email" fullWidth style={{margin: 5}}/>
            <Field as={TextField} value={values.phone_number} helperText={touched.phone_number && errors.phone_number} error={touched.phone_number && Boolean(errors.phone_number)} onBlur={handleBlur} id="phone_number" name="phone_number" placeholder="Phone Number" fullWidth style={{margin: 5}}/>
           
            <InputLabel id="role">Role</InputLabel>

            <Select
            labelId="role"
          value={values.role}
          helperText={touched.role && errors.role} error={touched.role && Boolean(errors.role)} onBlur={handleBlur} id="role" name="role"
          label="Role"
          onChange={handleRoleSelect}
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Teacher">Teacher</MenuItem>
        </Select>
            <Button variant="contained"    style={{
                  color: 'white',
                  width: '100%',
                  backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#000',
                  padding: 10,
                  marginTop: 10,
                }}
                disabled={isSubmitting || !isValid || !dirty} fullWidth>Create</Button>
         </Form>
         )}
         </Formik>
        </Box>
      </Modal>
    </div>
  )
}
