import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head, useForm } from '@inertiajs/react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Formik, Form } from 'formik';
import axios from 'axios';
import { Button } from 'primereact/button';

export default function Edit({ auth }) {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [preference, setPreference] = useState(auth.location_preference); // Initialize with auth.location_preference

    useEffect(() => {
        if (preference === 1) {
            getLocation();
        }
    }, [preference]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLatitude(latitude);
                    setLongitude(longitude);
                },
                handleError
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const saveLocation = async (values, { setSubmitting, setStatus }) => {
        try {
            // Include latitude and longitude in the payload
            const payload = {
                ...values,
                preference: values.preference,
                latitude: latitude,
                longitude: longitude,
            };

            // Make the PUT request to save location using axios
            const response = await axios.put(route('saveUserLocation'), payload);
            if (response.status === 200) {
                console.log('Location information saved successfully!');
                setStatus({ success: 'Location information saved successfully!' });
            } else {
                setStatus({ error: 'Failed to save location information.' });
            }
        } catch (error) {
            console.error('Error saving location information:', error);
            setStatus({ error: 'Failed to save location information: ' + error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const handleError = (error) => {
        console.error('Error getting geolocation:', error);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 shadow sm:rounded-lg">
                        <h1 className="dark:text-white text-xl font-bold"><LocationOnOutlinedIcon /> Enable Location Access</h1>
                        <p className="dark:text-white text-xl font-medium text-balance">Your location would allow our admins to get hospitals nearby to your child. Your location data is encrypted on our server so it is secure with us!</p>
                        <Formik
                            initialValues={{
                                preference: auth.location_preference,
                                latitude: auth.latitude || null,
                                longitude: auth.longitude || null,
                            }}
                            onSubmit={saveLocation}
                        >
                            {({ values, isSubmitting, handleChange }) => (
                                <Form>
                                    <div className="mt-5">
                                        <label className="dark:text-white mr-3">
                                            <input
                                                type="radio"
                                                name="preference"
                                                value={1}
                                                checked={values.preference === 1}
                                                onChange={() => {
                                                    setPreference(1);
                                                    handleChange({ target: { name: 'preference', value: 1 } });
                                                    getLocation();
                                                }}
                                            />
                                            Enable
                                        </label>

                                        <label className="dark:text-white mr-3">
                                            <input
                                            className="dark:text-white mr-3"
                                                type="radio"
                                                name="preference"
                                                value={0}
                                                checked={values.preference === 0}
                                                onChange={() => {
                                                    setPreference(0);
                                                    handleChange({ target: { name: 'preference', value: 0 } });
                                                }}
                                            />
                                            Disable
                                        </label>
                                    </div>
                                    {values.preference === 1 && (
                                        <>
                                            <div>
                                                <p className="dark:text-white mt-5 font-bold">Latitude</p>
                                                <p className="dark:text-white text-lg">{latitude && latitude}</p>
                                                <input type="hidden" name="latitude" value={latitude || ''} />
                                            </div>
                                            <div>
                                            <p className="dark:text-white mt-5 font-bold">Longitude</p>                                                <p className="dark:text-white text-lg">{longitude && longitude}</p>
                                                <input type="hidden" name="longitude" value={longitude || ''} />
                                            </div>
                                        </>
                                    )}
                                    {/* <button className= type="submit" disabled={isSubmitting}>
                                        Save
                                    </button> */}
                                    <Button className="mt-5 text-sm" label="Save" disabled={isSubmitting} loading={isSubmitting}/>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-slate-800 shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
