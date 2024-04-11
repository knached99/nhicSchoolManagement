import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const FormBuilder = ({auth}) => {
    const [forms, setForms] = useState([]);
    const [newFormName, setNewFormName] = useState('');
    const [newFieldName, setNewFieldName] = useState('');
    const [newFieldType, setNewFieldType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = () => {
        axios.get('/faculty/getForms')
            .then(response => {
                setForms(response.data);
                setError(null); // Clear any previous errors
            })
            .catch(error => {
                console.error('Error fetching forms:', error);
                setError('Failed to fetch forms. Please try again.'); // Set error message
            });
    };

    const createForm = () => {
        setIsLoading(true);
        axios.post('/faculty/forms', { name: newFormName, fields: [{ name: '', type: '' }] })
            .then(response => {
                setForms([...forms, response.data]);
                setNewFormName('');
                setIsLoading(false);
                setError(null); // Clear any previous errors
            })
            .catch(error => {
                console.error('Error creating form:', error);
                setError('Failed to create form. Please try again.'); // Set error message
                setIsLoading(false);
            });
    };
    
    const addField = (formId) => {
        if (!newFieldName.trim() || !newFieldType) {
            setError('Field name and type are required.');
            return;
        }
    
        if (!['input', 'select', 'radio', 'checkbox', 'date'].includes(newFieldType)) {
            setError('Invalid field type selected.');
            return;
        }
    
        axios.post(`/faculty/forms/${formId}/fields`, { name: newFieldName, type: newFieldType })
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
                setError(null); // Clear any previous errors
            })
            .catch(error => {
                console.error('Error adding field:', error);
                setError('Failed to add field. Please try again.'); // Set error message
            });
    };

    return (
        <AdminLayout
        user={auth}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Faculty Dashboard</h2>}
      >
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          
            <h1 className="font-black text-xl mb-5 text-center">Form Builder</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message */}
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
                    {Array.isArray(forms) && forms.map(form => (
                        <div key={form.id}>
                            <h3>{form.name}</h3>
                            <div>
                                <input
                                    type="text"
                                    value={newFieldName}
                                    onChange={(e) => setNewFieldName(e.target.value)}
                                    placeholder="Enter field name"
                                />
                                <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
                                    <option value="">Select field type</option>
                                    <option value="input">Input</option>
                                    <option value="select">Select</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="date">Date</option>
                                </select>
                                <button onClick={() => addField(form.id)}>Add Field</button>
                            </div>
                            {console.log(form.fields)} {/* Log form.fields */}
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
