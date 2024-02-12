import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout'
import React, {useState, useEffect} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TextField from '@mui/material/TextField';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText  from '@mui/material/FormHelperText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function Student({auth, student}) {
    const [error, setError] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [parents, setParents] = useState([]);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
          const response = await fetch('/fetchTeachers');
          console.log(response);
          const { teachers, error } = await response.json();

          if (error) {
            throw new Error(error);
          }
      
          return teachers || [];
        } catch (error) {
          throw new Error('Error fetching teachers: ' + error.message);
        }
      };

      const fetchParents = async () => {
        try {
          const response = await fetch('/fetchParents');
          console.log(response);
          const { parents, error } = await response.json();

          if (error) {
            throw new Error(error);
          }
      
          return parents || [];
        } catch (error) {
          throw new Error('Error fetching parents: ' + error.message);
        }
      };
  
      useEffect(() => {
        const fetchData = async () => {
          try {
            const facultyUsers = await fetchTeachers();
            const parentUsers = await fetchParents();
            setParents(parentUsers);
            setTeachers(facultyUsers);
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
    

      // For assigning teacher to student 
      const initialValues = {
        student_id: student.student_id,
        faculty_id: ''
      };
      
// For assigning teacher to student 
    const validationSchema = Yup.object().shape({
      faculty_id: Yup.string().required('Must Select Teacher')
    });


    const parentInitialValues = {
      student_id: student.student_id, 
      user_id: ''
    };

    const validateData = Yup.object().shape({
      user_id: Yup.string().required('Must Select Parent')
    });

    const assignTeacherToStudent = async (values, { setSubmitting }) => {
      try {
        const response = await axios.put(`/assignTeacherToStudent/${values.student_id}/${values.faculty_id}`, values, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
    
        if (response.data.errors) {
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          setSuccess(response.data.success);
          setSuccessOpen(true);
    
          // Reset form values
          Object.keys(values).forEach((key) => {
            values[key] = '';
          });
          window.setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } catch (error) {
        setError(error.message || 'Unable to assign teacher to student, something went wrong');
        setErrorOpen(true);
      } finally {
        setSubmitting(false);
      }
    };


    const assignParentToStudent = async (values, { setSubmitting }) => {
      try {
        const response = await axios.put(`/assignParentToStudent/${values.student_id}/${values.user_id}`, values, {
          headers: {
            'Content-Type': 'application/json'
          },
        });
    
        if (response.data.errors) {
          setError(response.data.errors);
          setErrorOpen(true);
        } else if (response.data.success) {
          setSuccess(response.data.success);
          setSuccessOpen(true);
    
          // Reset form values
          Object.keys(values).forEach((key) => {
            values[key] = '';
            window.setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        }
      } catch (error) {
        setError(error.message || 'Unable to assign parent to student, something went wrong');
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
    <>
      <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">{student.first_name} {student.last_name}'s Profile Page</h2>}
      >
    <div className="bg-gray-100">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
            
                        <AccountCircleIcon style={{fontSize: 100, color: 'gray'}}/>
                        <h1 className="text-xl font-bold">{student.first_name} {student.last_name}</h1>
                        <p className="text-gray-700 text-center font-bold mt-3">Parent/Guardian Email: <span className="font-normal">{student.parent_guardian_email}</span></p>
                        <p className="text-gray-700 text-center font-bold mt-3">Student Since: <span className="font-normal">{new Date(student.created_at).toLocaleDateString()}</span></p>

                        {auth.role === 'Admin' && !student.faculty_id && (
                        <div class="mt-6 flex flex-wrap gap-4 justify-center">
                        <span className="text-indigo-500">{student.first_name} {student.last_name} is not assigned to a teacher</span>
                        {loading ? <CircularProgress color="primary" />  : 
                      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={assignTeacherToStudent}>
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
                                {error && (
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
                          <input type="hidden" name="student_id" id="student_id" value={student.student_id}/>
                          <FormControl sx={{ m: 1, width: '100%' }}>
                            <InputLabel id="faculty_id">Select Teacher</InputLabel>
                            <Select
                              labelId="faculty_id"
                              id="faculty_id"
                              name="faculty_id"
                              value={values.faculty_id || ''}
                              onChange={handleChange}
                              style={{ width: 300 }}
                            >
                              <MenuItem value="">
                                <em>Select Teacher</em>
                              </MenuItem>
                    
                              {teachers.map((teacher) => (
                                <MenuItem key={teacher.faculty_id} value={teacher.faculty_id}>
                                  {teacher.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            type="submit"
                            variant="contained"
                            style={{
                              color: 'white',
                              width: '100%',
                              backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3b82f6',
                              padding: 15,
                              marginTop: 10,
                            }}
                            disabled={isSubmitting || !isValid || !dirty}
                          >
                            {isSubmitting ? (
                              <CircularProgress size={24} style={{ color: '#fff' }} />
                            ) : (
                              <>Assign</>
                            )}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                            }
                        </div>
                        )}
                        
                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Student Bio</span>
                        <ul>
                            <li className="mb-2">{student.address}, {student.street_address_2 && (<p>{student.street_address_2}</p>)}{student.city}, {student.state}, {student.zip}</li>                      
                        </ul>
                    </div>
                   {student.user_id ? (
                    <div className="flex flex-col mt-5">
                    <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Parent Bio</span>
                    {student.user ? 
                    <ul>
                      <li>{student.user.name}</li>
                      <li>{student.user.email}</li>
                      <li>{!student.user.email_verified_at ? <span className="text-red-500">Account Not Verified</span> : <span className="text-emerald-500">Account Verified</span>}</li>
                    </ul>
                    : 
                    'N/A' 
                   }
                    </div>
                   )
                    :
                    <>
                    <span className="text-indigo-500">A parent is not yet assigned to {student.first_name} {student.last_name}</span>
                    <Formik initialValues={parentInitialValues} validationSchema={validateData} onSubmit={assignParentToStudent}>
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
                              {error && (
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
                        <input type="hidden" name="student_id" id="student_id" value={student.student_id}/>
                        <FormControl sx={{ m: 1, width: '100%' }}>
                          <InputLabel id="user_id">Select Parent</InputLabel>
                          <Select
                            labelId="user_id"
                            id="user_id"
                            name="user_id"
                            value={values.user_id || ''}
                            onChange={handleChange}
                            style={{ width: 300 }}
                          >
                            <MenuItem value="">
                              <em>Select Parent</em>
                            </MenuItem>
                  
                            {parents.map((parent) => (
                              <MenuItem key={parent.user_id} value={parent.user_id}>
                                {parent.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          type="submit"
                          variant="contained"
                          style={{
                            color: 'white',
                            width: '100%',
                            backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3b82f6',
                            padding: 15,
                            marginTop: 10,
                          }}
                          disabled={isSubmitting || !isValid || !dirty}
                        >
                          {isSubmitting ? (
                            <CircularProgress size={24} style={{ color: '#fff' }} />
                          ) : (
                            <>Assign</>
                          )}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                  </>
                  }
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Student Information</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">6</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Average Grade
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">100/100</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Teacher
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p className="font-bold text-2xl text-center">
          {student.faculty ? student.faculty.name : 'Unassigned'}
      </p>

        </p>
      </div>
    </div>
  </div>
  
</div>
                    <h2 className="text-xl font-bold mt-6 mb-4">Student Metrics</h2>
                    {/* <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
</div>

</AdminLayout>
</>
  );
}
