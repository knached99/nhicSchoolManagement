import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import FacultyGuestLayout from '@/Layouts/AdminLayouts/FacultyGuestLayout';
import { InputText } from 'primereact/inputtext';

export default function TwoFactorChallenge({ message }) {
    const [data, setData] = useState({ code: '' });
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        console.log('Submitting form with code:', data.code);
        setProcessing(true);
    
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
        // Set headers including CSRF token
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        };
    
        try {
            // Make the POST request using Axios
            const response = await axios.post('/two-factor-challenge', {
                code: data.code,
            }, {
                headers: headers,
            });
    
            // Handle successful response
            console.log('Form submitted successfully:', response);
            
            // If 2FA authentication is successful, redirect to faculty dashboard
            if (response.status === 204) {
                window.location.href = '/faculty/dash';
            }
    
        } catch (err) {
            // Handle error response
            console.log('Error:', err);
            if (err.response && err.response.status === 422) {
                setError(err.response.data.errors || 'Validation error');
            } else {
                setError(err.response?.data?.message || 'An error occurred');
            }
        } finally {
            setProcessing(false);
        }
    };
    

    return (
        <>
            <FacultyGuestLayout>
                <Head title="Log in" />
                <div className="dark:text-white">
                    <h1 className="font-black mb-3 text-xl">Two-Step Verification</h1>
                    <p className="font-medium mb-3 mt-3">Enter the 6-digit verification code on your authenticator app or one of your backup codes to continue</p>
                    {message && <div className="bg-blue-500 p-3 m-3 text-white">{message}</div>}
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={submit}>
                        <InputText
                            type="text"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData({ ...data, code: e.target.value })}
                            placeholder="Enter verification code"
                        />
                        <PrimaryButton className="ml-3" type="submit" processing={processing} disabled={processing}>
                            Verify
                        </PrimaryButton>
                    </form>
                </div>
            </FacultyGuestLayout>
        </>
    );
}
