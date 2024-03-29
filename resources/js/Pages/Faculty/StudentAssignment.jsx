import React, {useState} from 'react';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@inertiajs/react';

import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
  
import { Button } from 'primereact/button';
import FormHelperText  from '@mui/material/FormHelperText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import axios from 'axios';  
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Box from '@mui/material/Box';

export default function StudentAssignment({ auth, student, assignments, answer, grade }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [parents, setParents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialValues = {
        grade: '',
        feedback: '',
    };

    const validation = Yup.object().shape({
        grade: Yup.number()
        .integer('Grade must be an integer')
        .min(0, 'Grade must be greater than or equal to 0')
        .max(100, 'Grade must be less than or equal to 100')
        .required('Grade is required'),

        feedback: Yup.string()
    });

    const gradeAssignment = async(values, {setSubmitting}) =>{
        try{
            const response = await axios.post(`/submitGrade/${assignments[0].assignment_student_id}/${assignments[0].assignment_id}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if(response.data.success){
                setSuccess(response.data.success);
                setSuccessOpen(true);
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                  });
                  window.location.refresh; 
            }
            else if(response.data.errors){
                setError(response.data.errors);
                setErrorOpen(true);
            }
           
        }
        catch(error){
            setError(error.message);
            setErrorOpen(true);
        }
        finally{
            setSubmitting(false);
        }
    };

    
    const handleCloseSuccess = () => {
        setSuccessOpen(false);
        setSuccess(null);
    };
  
    const handleCloseError = () => {
        setErrorOpen(false);
        setError(null);
    };

    return (
        <AdminLayout
            user={auth}
            header={<h2 className="font-medium text-xl text-gray-800 leading-tight text-start">Assignment Details</h2>}
        >
            <section className="bg-white dark:bg-gray-900 shadow-lg">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
                      
                        {assignments.map((assignment, index) => (
                            
                            <div key={index}>
                                <div className="mb-4 text-3xl tracking-light font-medium text-gray-900 dark:text-slate-300 text-start">Assignment Details For 
                                <span className="ml-2">{student.first_name} {student.last_name}</span> 
                                </div>
                               
                                <h2 className="mb-4 text-xl tracking-tight font-bold text-gray-900 dark:text-slate-300">{assignment.assignment.assignment_name}</h2>
                                <p className="mb-4 font-medium text-xl dark:text-slate-300">
                                    <Tooltip title="Assignment Description" arrow>
                                        <DescriptionOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
                                    </Tooltip>
                                    {assignment.assignment.assignment_description}
                                </p>
                                <p className="mb-4 font-medium text-xl dark:text-slate-300">
                                    <Tooltip title="Assignment Due Date" arrow>
                                        <CalendarMonthOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
                                    </Tooltip>
                                    {new Date(assignment.assignment.assignment_due_date).toLocaleString()}
                                </p>
                               
                            </div>
                        ))}

                        
                         <div className="block">
                           <h1 className="font-medium text-2xl mt-3 dark:text-slate-300 text-black">Answer:</h1>  
                           {answer && (
                                <p className="dark:text-slate-100">
                                    Submitted On: {new Date(answer.created_at).toLocaleString(undefined, { hour12: true, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                )}

                          <p className="mt-3 text-pretty dark:text-slate-300 text-lg"> {answer ? answer.assignment_answer : 'No Answer Provided Yet'} </p>
                          {/* <div className="mt-3 text-pretty dark:text-slate-300 text-lg">{answer && answer.grade == undefined ? 
                          <> */}
                    <div className="mt-3 text-pretty dark:text-slate-300 text-lg">
                    {answer && !grade ? (
    <>
        <p className="dark:text-slate-200 text-slate-900 mt-3 mb-3">Enter a grade for this submission</p>
        {error && (
            <Box sx={{ width: '100%' }}>
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
                        {error}
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

        <Formik initialValues={initialValues} validationSchema={validation} onSubmit={gradeAssignment}>
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
                <Form onSubmit={handleSubmit} autoComplete="off">
                    <InputText
                        style={{
                            display: 'block',
                            width: '100%',
                            margin: '10px 0',
                            ...(touched.grade && errors.grade && { border: '1px solid #ef4444' }),
                        }}
                        id="grade"
                        name="grade"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Grade"
                    />

                    <span className="text-red-500 block mb-3">{touched.grade && errors.grade}</span>

                    <InputTextarea id="feedback" name="feedback" onChange={handleChange} onBlur={handleBlur} placeholder="Provide feedback to the student (optional)..." rows={5} cols={30} />
                    <Button label="Submit" className="ml-3 inline-block" />
                </Form>
            )}
        </Formik>
    </>
) : (
    <>
<p className="dark:text-slate-300 text-black">Grade: {grade ? `${grade.grade}/100` : "N/A"}</p>
<p className="dark:text-slate-300 text-black text-pretty">Feedback: {grade ? grade.feedback : "N/A"}</p>
    </>
)}


</div>


                        

    
                          </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
