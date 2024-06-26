import {useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { InputMask } from "primereact/inputmask";

import { InputText } from 'primereact/inputtext';
        

export default function UpdateFacultyProfile({className = '' , style='' }) {
    const user = usePage().props.auth.faculty;
    // const { data, setData } = useForm({
    //     email: user.email,
    //     phone: user.phone
    // });

    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState();
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data 

    const initialValues = {
        email: user.email,
        phone: user.phone 
    };
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('email is required').email('Must be a valid email'),
        phone: Yup.string()
      .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Invalid US phone number format')
      .required('Phone number is required'),
    });

    const updateProfile = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put('/updateProfile', values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.errors) {
                setErrors(response.data.errors);
                setErrorOpen(true);
            } else if (response.data.success) {
                setSuccess(response.data.success);
                setSuccessOpen(true);
                window.location.reload();
                //setData('email', values.email, 'phone', values.phone); // Update local form data
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                });
                setRefreshData(true); // Set the flag to refresh data

            }
        } catch (error) {
            setErrors(error.message);
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
        setErrors(null);
    };

    const formatPermissions = (permissions) => {
        if(user.role === 'Admin'){
            return 'All Permissions'
        }
        else if (!permissions || !Array.isArray(permissions)) {
            return 'N/A';
        }
    
        // Replace underscores with spaces and join permissions with spaces
        return permissions.map(permission => permission.replace(/_/g, ' ')).join(', ');
    };

    return (
        <section className={className} style={style}>
            <header>
                <h2 className="text-xl m-3 font-medium text-gray-900 dark:text-white">Profile Information</h2>
                {errors && (
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
                                        {errors}
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

                <p className="m-3 text-sm text-gray-600 dark:text-white">
                    Update your account's profile information and email address.
                </p>
            </header>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={updateProfile}>
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
                <Form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="m-3">
                    <h1 className="text-xl font-black">{user.name}</h1> 
                    <p className="font-semibold">My Role: {user.role}</p>
                </div>

                <div>
                {/* <InputMask style={{width: '100%'}} mask="email" placeholder="Email" value={values.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} name="email"></InputMask> */}
                <InputText  style={{
                    width: '100%',
                    ...(touched.email && errors.email && { border: '1px solid #ef4444' }),
                }}
                 placeholder="Email"
                 onBlur={handleBlur}
                 onChange={handleChange}
                 value={values.email}
                 name="email"
                 id="email"
                />
                 <span className="text-red-500">{touched.email && errors.email}</span>

                {/* <Field style={{margin: 10, color: '#fff'}} fullWidth placeholder="Email" as={TextField}  value={values.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} id="email" name="email"/> */}
                </div>
                <div>
                <InputMask  style={{
                    width: '100%',
                    ...(touched.phone && errors.phone && { border: '1px solid #ef4444' }),
                }} mask="(999) 999-9999" placeholder="(999) 999-9999" value={values.phone} onChange={handleChange} onBlur={handleBlur} name="phone"></InputMask>
                <span className="text-red-500">{touched.phone && errors.phone}</span>
                {/* <Field style={{margin: 10}} fullWidth placeholder="Phone Number" as={TextField}  value={values.phone} helperText={touched.phone && errors.phone} error={touched.phone && Boolean(errors.phone)} onBlur={handleBlur} id="phone" name="phone"/> */}
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
                        <>
                            Save
                        </>
                    )}
                </Button> 
                </div>
            </Form>
            )}
            </Formik>
        </section>
    );
}
