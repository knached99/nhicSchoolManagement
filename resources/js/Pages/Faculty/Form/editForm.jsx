import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Avatar from '@mui/material/Avatar';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from '@mui/material/IconButton';


export default function editForm({ form, auth, success }) {
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('');
    const [newFieldOptions, setNewFieldOptions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(true);

    const fields = [
        { name: 'Input', type: 'input' },
        { name: 'Select', type: 'select' },
        { name: 'Radio', type: 'radio' },
        { name: 'Checkbox', type: 'checkbox' },
        { name: 'Date', type: 'date' }
    ];

    const addField = (formId) => {
        if (!newFieldName.trim() || !newFieldType) {
            setError('Field name and type are required.');
            return;
        }

        const fieldData = {
            name: newFieldName,
            type: newFieldType,
            options: newFieldOptions.split(',').map(option => option.trim()),
        };

        axios.post(`/faculty/forms/${formId}/fields`, fieldData)
            .then(response => {
                const updatedForms = forms.map(form => {
                    if (form.id === formId) {
                        return {
                            ...form,
                            fields: [...form.fields, response.data],
                        };
                    }
                    return form;
                });
                setForms(updatedForms);
                setNewFieldName('');
                setNewFieldType('');
                setNewFieldOptions('');
                setSuccess('Field Added!');
                setError(null);
            })
            .catch(error => {
                console.error('Error adding field:', error);
                setError('Failed to add field. Error: ' + error);
            });
    };

    function stringToColor(string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    const handleCloseSuccess = () => {
        setSuccessOpen(false);
        setSuccess(null);
    };

    return (
        <AdminLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{form.name}</h2>}
        >
            <div className="my-4 px-6 mx-6 shadow-lg p-4 bg-white dark:bg-slate-800  dark:text-white rounded-md dark:slate-800" key={form.id}>
                <div className="flex flex-col items-start">
                    <Link href="/faculty/forms" className="float-start mb-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                        <ArrowBackOutlinedIcon />
                        Back
                    </Link>
                </div>
                <h3 className="font-bold text-xl mb-5">{form.name}</h3>

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

                <div className="mb-3 inline-block">
                    <h3 className="text-xl mb-3">Created By: </h3>
                    {form.faculty.profile_pic ? (
                        <>
                            <Avatar alt="Profile Picture" src={`${profilePicPath}/${form.faculty.profile_pic}`} sx={{ width: 50, height: 50 }} />
                            <h1 className="font-semibold">{form.faculty.name}</h1>
                        </>
                    ) : (
                        <>
                            <Avatar sx={{ width: 50, height: 50 }} {...stringAvatar(form.faculty.name)} />
                            <h1 className="font-semibold">{form.faculty.name}</h1>
                        </>
                    )}
                </div>

                <div>
                    <InputText
                        type="text"
                        style={{margin: 10}}
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        placeholder="Enter field name"
                    />
                    <Dropdown style={{margin: 10}} value={newFieldType} onChange={(e) => setNewFieldType(e.value)} options={fields} optionLabel="name" placeholder="Select Field Type" className="w-full md:w-14rem" />
                    {['radio', 'checkbox', 'select'].includes(newFieldType) && (
                        <div>
                            <InputText
                                type="text"
                                value={newFieldOptions}
                                onChange={(e) => setNewFieldOptions(e.target.value)}
                                placeholder="Enter options (comma-separated)"
                            />
                        </div>
                    )}
                    <Button style={{margin: 10}} onClick={() => addField(form.form_id)} label="Add Field" className="mt-3" />
                </div>
                {form.fields && (
                    <ul>
                        {form.fields.map(field => (
                            <li key={field.id}>
                                {field.name} - {field.type}
                            </li>
                        ))}
                    </ul>
                )}
              
            </div>
        </AdminLayout>
    )
}
