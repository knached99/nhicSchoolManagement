import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
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
export default function UpdateFacultyPasswordForm({ className = '' }) {
    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState();
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    
    const initialValues = {
        current_password: '',
        password: '',
        password_confirmation: ''
    };

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validationSchema = Yup.object().shape({
        current_password: Yup.string().required('Current Password is required'),
        password: Yup.string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(
                passwordRegex,
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
        password_confirmation: Yup.string()
            .required('Password Confirmation is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    });


    const updatePassword = async (values, { setSubmitting }) => {
        try {
            const response = await axios.put('/updateFacultyPassword', values, {
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
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                });
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

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
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
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={updatePassword}>
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
                    <Field type="password" style={{margin: 10}} fullWidth placeholder="Current Password" as={TextField} value={values.current_password} helperText={touched.current_password && errors.current_password} error={touched.current_password && Boolean(errors.current_password)} onBlur={handleBlur} id="current_password" name="current_password"/>
                    <Field type="password"  style={{margin: 10}} fullWidth placeholder="New Password" as={TextField} value={values.password} helperText={touched.password && errors.password} error={touched.password && Boolean(errors.password)} onBlur={handleBlur} id="password" name="password"/>
                    <Field type="password"  style={{margin: 10}} fullWidth placeholder="Confirm Password" as={TextField} value={values.password_confirmation} helperText={touched.password_confirmation && errors.password_confirmation} error={touched.password_confirmation && Boolean(errors.password_confirmation)} onBlur={handleBlur} id="password_confirmation" name="password_confirmation"/>
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
                            Update
                        </>
                    )}
                </Button>   

                </div>

                <div>
                    {/* <InputLabel htmlFor="password" value="New Password" />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" /> */}
                </div>

                <div>
                    {/* <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" /> */}
                </div>

                <div className="flex items-center gap-4">
                    {/* <PrimaryButton disabled={processing}>Save</PrimaryButton> */}

                    {/* <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition> */}
                </div>
            </Form>
            )}
            </Formik>
        </section>
    );
}
