import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import FacultyGuestLayout from '@/Layouts/AdminLayouts/FacultyGuestLayout';
import { InputText } from 'primereact/inputtext';

export default function TwoFactorChallenge({ message }) {
    
    const { data, setData, post, processing, reset } = useForm({
      code: ''

    });

        const [error, setError] = useState(null);
       
    const submit = (e) => {
        e.preventDefault();
        
        post(route('two-factor.login'));
    };
        
        

    return (
        <>
            <FacultyGuestLayout>
                <Head title="Log in" />
                <div className="dark:text-white">
                    <h1 className="font-black mb-3 text-xl">Two-Step Verification</h1>
                    <p className="font-medium mb-3 mt-3">Enter the 6-digit verification code on your authenticator app or one of your backup codes to continue</p>
                    {message && <div className="bg-blue-500 p-3 m-3 text-white">{message}</div>}
                    {error && <div className="bg-red-500 p-3 m-3 text-white">{error}</div>}
                    <form onSubmit={submit}>
                        <InputText
                            type="text"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData({ ...data, code: e.target.value })}
                            placeholder="Enter verification code"
                        />
                        <PrimaryButton className="ml-3" type="submit">
                            Verify
                        </PrimaryButton>
                    </form>
                </div>
            </FacultyGuestLayout>
        </>
    );
}
