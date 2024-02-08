import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import FacultyGuestLayout from '@/Layouts/AdminLayouts/FacultyGuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { Head, Link, useForm } from '@inertiajs/react';
import Box from '@mui/material/Box';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';

export default function Login({ errors, RATE_LIMIT_THRESHOLD_EXCEEDED, auth_error, status, canResetPassword }) {
    const [errorOpen, setErrorOpen] = useState(true);

    const { data, setData, post, processing, reset } = useForm({
        email: '',
        password: '',
        remember: false,

    });


    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('authenticate'));
    };

    const handleCloseError = () => {
        setErrorOpen(false);
        setError(null);
    };



    return (
        <FacultyGuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

             {errors.auth_error && (
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
                                        {errors.auth_error}
                                    </Alert>
                                </Collapse>
                            </Box>
                        )}

                            {errors.RATE_LIMIT_THRESHOLD_EXCEEDED && (
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
                                        {errors.RATE_LIMIT_THRESHOLD_EXCEEDED}
                                    </Alert>
                                </Collapse>
                            </Box>
                        )}

       
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">

                        <Link href={route('faculty.password.request')} className="text-sm text-gray-600 hover:text-gray-900">
                            Forgot your password?
                        </Link>
              

                    <PrimaryButton
                        type="submit"
                        className="ml-4"
                        processing={processing}
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
                
            </form>
        </FacultyGuestLayout>
    );
}
