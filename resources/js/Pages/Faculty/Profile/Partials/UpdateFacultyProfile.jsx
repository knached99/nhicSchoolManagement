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

export default function UpdateFacultyProfile({className = '' }) {
    const user = usePage().props.auth.faculty;
    const { data, setData } = useForm({
        email: user.email
    });

    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState();
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data 

    const initialValues = {
        email: ''
    };
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('email is required').email('Must be a valid email')
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
                setData('email', values.email); // Update local form data
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

       // useEffect for data refresh
       useEffect(() => {
        const fetchData = async () => {
            // Fetch updated data from the server and update local state
            const updatedData = await axios.get('/fetchFacultyData');
            setData(updatedData);
        };

        if (refreshData) {
            fetchData();
            setRefreshData(false); // Reset the flag
        }
    }, [refreshData, setData]);

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
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
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

                <p className="mt-1 text-sm text-gray-600">
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
                <div>
                    <p className="font-bold">Name: {user.name}</p>
     
                </div>

                <div>
                <Field style={{margin: 10}} fullWidth placeholder="Email" as={TextField}  value={values.email || data.email} helperText={touched.email && errors.email} error={touched.email && Boolean(errors.email)} onBlur={handleBlur} id="email" name="email"/>
                </div>

                <div>
                  <p className="font-semibold">My Role: <span className="font-noraml">{user.role}</span></p>
                </div>
                <div>
                    <p className="font-semibold">My Permissions: <span className="font-normal">{formatPermissions(user.permissions)}</span></p>
                </div>


                <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    variant="contained"
                    style={{
                        color: 'white',
                        width: '100%',
                        backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3d5afe',
                        padding: 15,
                        marginTop: 10,
                    }}
                    disabled={isSubmitting || !isValid || !dirty}
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
