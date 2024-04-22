import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Avatar from '@mui/material/Avatar';

const FormBuilder = ({ auth, notifications }) => {
    const [forms, setForms] = useState([]);
    const [newFormName, setNewFormName] = useState('');
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('');
    const [newFieldOptions, setNewFieldOptions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const profilePicPath = "http://localhost:8000/storage/profile_pics"; 

    useEffect(() => {
        fetchForms();
    }, []);

    const fields = [
        {name: 'Input', type: 'input'},
        {name: 'Select', type: 'select'},
        {name: 'Radio', type: 'radio'},
        {name: 'Checkbox', type: 'checkbox'},
        {name: 'Date', type: 'date'}
    ];
    

    const fetchForms = () => {
        axios.get('/faculty/getForms')
            .then(response => {
                setForms(response.data);
                setError(null);
            })
            .catch(error => {
                console.error('Error fetching forms:', error);
                setError('Failed to fetch forms. Please try again.');
            });
    };

    const createForm = () => {
        setIsLoading(true);
        axios.post('/faculty/forms/', { name: newFormName })
            .then(response => {
                const formData = response.data;
                setForms([...forms, formData]);
                setNewFormName('');
                setSuccess('Form Created!');
                setIsLoading(false);
                setError(null);
                // Redirect to the edit form page after creating the form
                window.location.href = `/faculty/form/${formData.form_id}/editForm`;
            })
            .catch(error => {
                console.error('Error creating form:', error);
                setError('Failed to create form. Please try again');
                setIsLoading(false);
            });
    };
    
    
    const addField = (formId) => {
        if (!newFieldName.trim() || !newFieldType) {
            setError('Field name and type are required.');
            return;
        }
    
        // if (!['input', 'select', 'radio', 'checkbox', 'date'].includes(newFieldType)) {
        //     setError('Invalid field type selected.');
        //     return;
        // }
    
        const fieldData = {
            name: newFieldName,
            type: newFieldType,
            options: newFieldOptions.split(',').map(option => option.trim()),
        };

        const setNewFieldType = (selectedOption) => {
            // Extract the type from the selected option
            const fieldType = selectedOption ? selectedOption.type : '';
        
            // Set the extracted type to newFieldType
            setNewFieldType(fieldType);
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
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
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

    return (
        <AdminLayout
            user={auth}
            notifications={notifications}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Faculty Dashboard</h2>}
        >
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <h1 className="font-black dark:text-white text-xl mb-5 text-center">Form Builder</h1>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                    <div className="shadow-md p-4 bg-white dark:bg-slate-800 m-5">
                        <InputText
                            className="mr-3"
                            type="text"
                            value={newFormName}
                            onChange={(e) => setNewFormName(e.target.value)}
                            placeholder="Enter form name"
                        />
                        <Button onClick={createForm} disabled={isLoading} label="Create Form" />
                    </div>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {forms.map(form => (
                                <div className="my-4 shadow-lg p-4 bg-white dark:bg-slate-800 dark:text-white rounded-md dark:slate-800" key={form.id}>
                                <a className="float-start inline-block mr-6 underline text-blue-500 dark:text-blue-400" href={`/faculty/form/${form.form_id}/editForm`}>View Form</a>

                                <h3 className="font-bold text-xl mb-5">{form.name}</h3>

                               <div className="mb-3 inline-block">
                                <h3 className="text-xl mb-3">Created By: </h3>
                                {form.faculty.profile_pic ? (
                                    <>
                                    <Avatar alt="Profile Picture" src={`${profilePicPath}/${form.faculty.profile_pic}`} sx={{ width: 50, height: 50 }} />

                                        <h1 className="font-semibold">{form.faculty.name}</h1>
                                    </>
                                    ) : (
                                    <>
                                <Avatar sx={{width: 50, height: 50}} {...stringAvatar(form.faculty.name)} />
                                <h1 className="font-semibold">{form.faculty.name}</h1>
                                    </>
                                    )}
                                    </div>

                                    <div>
                                  

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
                            ))}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default FormBuilder;
