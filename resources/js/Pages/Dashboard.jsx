import React, {useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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


export default function Dashboard({ auth }) {
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Form Validation Logic 

    const validation = Yup.object().shape({
        address: Yup.string().required('Street address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zipcode: Yup.string()
          .matches(/^\d{5}$/, 'Zip code must be 5 digits')
          .required('Zip code is required'),
      });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                           {/* Modal Goes Here */}
                           <div>
                        <Button onClick={handleOpen} variant="contained" style={{margin: 10, backgroundColor: '#000'}}>Add Student</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add a student 
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <InputLabel>
                                Enter Student's Name 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="name" name="name" />
                                <InputLabel>
                                Enter Student's Date Of Birth 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="date_of_birth" name="date_of_birth" type="date"/>
                                <InputLabel>
                                Enter Student's Address 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="address" name="address"/>

                                <InputLabel>
                                Street Address 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="address" name="address"/>

                                <InputLabel>
                                City 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="city" name="city"/>

                                <InputLabel>
                                State 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="state" name="state"/>

                                <InputLabel>
                                Zipcode 
                                </InputLabel>
                                <TextField className="m-1" fullWidth id="zip" name="zip"/>

                                <Button variant="contained" style={{margin: 10, backgroundColor: '#334155'}}>Add Student</Button>
                            </Typography>
                            </Box>
                        </Modal>
                        </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome back, {auth.user.name}!</div>
                    </div>
             
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
