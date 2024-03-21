import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function TwoFactorChallenge() {
    const [error, setError] = useState(null);
    const { data, setData, post, processing } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auth/two-factor-challenge'));
    };

    return (
        <div>
            <h1>Two-Factor Authentication</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={submit}>
                <input type="text" name="code" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="Enter verification code" />
                <PrimaryButton type="submit" processing={processing} disabled={processing}>
                    Verify
                </PrimaryButton>
            </form>
        </div>
    );
}
