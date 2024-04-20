import React, {useState, useEffect} from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@inertiajs/react';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
        
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function StudentAssignment({ auth, student, assignment,  answer, grade }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [openPermissionsMenu, setOpenPermissionsMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
      }, []);

      // Assignment Form 

      const initialValues = {
        assignment_answer: '',
        assignment_due_date: assignment.assignment.assignment_due_date
      };

      const validation = Yup.object().shape({
        assignment_answer: Yup.string().required('Answer is required')
      });

      const submitAssignment = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(`/submitAssignment/${student.student_id}/${assignment.assignment.assignment_id}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.data.errors) {
                setError(response.data.errors);
                setErrorOpen(true);
            } else if (response.data.success) {
                setSuccess(response.data.success);
                setSuccessOpen(true);
                Object.keys(values).forEach((key) => {
                    values[key] = '';
                });
    
                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }
        } catch (error) {
            setError(error.message || 'An unexpected error occurred');
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
        setError(null);
    };

   

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-medium text-xl text-gray-800 leading-tight text-start dark:text-white">Assignment Details</h2>}
        >
            <section className="bg-white dark:bg-gray-900 shadow-lg">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
                    <div className="mb-4 text-3xl tracking-light font-medium text-gray-900 dark:text-slate-300 text-start">{assignment.assignment.assignment_name}
                    <h2 className="mb-4 text-xl tracking-tight font-bold text-gray-900 dark:text-slate-300">Assigned To: {student.first_name} {student.last_name}</h2>
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
        
                         <div className="block">
                           <h1 className="font-medium text-2xl mt-3 dark:text-slate-300 text-black">Answer:</h1>
                          
                           <>
  {answer ? (
    <>
      <p className="mt-3 mb-3 font-semibold italic text-slate-800 text-pretty dark:text-slate-200 text-lg">{answer.assignment_answer}</p>
      {answer && <p className="dark:text-slate-300">Submitted On: {new Date(answer.created_at).toLocaleString()}</p>}
      {!grade ? (
        <p className="dark:text-orange-400 text-orange-700 font-bold mt-3">Pending Grading</p>
      ) : (
        <>
          <p className="dark:text-slate-300 text-black">Grade: {grade.grade} / 100</p>
          <p className="dark:text-slate-300 text-black">Feedback: {grade.feedback}</p>
        </>
      )}
    </>
  ) : (
    <div className="container mx-auto py-8">
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

      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={submitAssignment}
      >
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
            <div className="max-w-md mx-auto rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-6">
                <InputTextarea
                  value={values.assignment_answer}
                  style={{
                    width: '100%',
                    ...(touched.assignment_answer &&
                      errors.assignment_answer && {
                        border: '1px solid #ef4444',
                      }),
                  }}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  id="assignment_answer"
                  name="assignment_answer"
                  rows="5"
                  cols="30"
                  placeholder="Enter your answer"
                />
                <span className="text-red-500 dark:text-red-400">
                  {touched.assignment_answer && errors.assignment_answer}
                </span>
              </div>
              <div className="flex justify-center">
                <Button
                  label="Submit Answer"
                  disabled={isSubmitting || !isValid || !dirty}
                  loading={isSubmitting}
                  type="submit"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )}
</>


                          </div>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}