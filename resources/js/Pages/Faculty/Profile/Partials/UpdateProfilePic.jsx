import {useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, mixed } from 'yup';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import defaultProfilePic from '../../../../../../public/assets/images/default_profile_pic.png';

export default function UpdateProfilePic({className= ''}) {
    const user = usePage().props.auth.faculty;
    const {data, setData} = useForm({
        profile_pic: user.profile_pic
    });
    
    const [errors, setErrors] = useState();
    const [success, setSuccess] = useState();
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data 
    const [previewImage, setPreviewImage] = useState(null);
    const [profilePic, setProfilePic] = useState();

    const validationSchema = object().shape({
        profile_pic: mixed()
        .required('Must select a profile pic')
        .test('fileSize', 'File size is too large', (value)=>{
            if(!value) return true;  // Allow empty file 
            return value.size <= 2 * 1024 * 1024 // 2 MB
        })
        .test('fileType', 'Invalid file type selected', (value)=>{
            if(!value) return true; 
            return ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(value.type);
        }),
    });

    const initialValues = {
        profile_pic: undefined 
       };

    const handlePhotoChange = (e, form)=>{
        const file = e.target.files[0];
        form.setFieldValue('file', file);
        if(file){
            const reader = new FileReader();
            reader.onload = (e)=>{
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        else{
            setPreviewImage(null);
        }
    };

    const uploadPhoto = async (values) => {
        try {
          if (!values.profile_pic) {
            setModalError('Photo is required');
            return;
          }
      
          const formData = new FormData();
          formData.append('photo', values.profile_pic);
      
          const response = await axios.post('/uploadProfilePic', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          if (response.status === 200) {
            // Success: Clear the form or show a success message.
            setSuccess(response.data.success);
            setSuccessOpen(true);
            setPreviewImage(null); // Clear the image preview
            
            // Update the 'photos' state to trigger a re-render
            setProfilePic([...profilePic, response.data.profile_pic]); // Assuming response.data.photo contains the new photo data
          } else {
            // Handle other server errors as needed.
            setErrors(`Server Error: ${response.status}`);
            setErrorOpen(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 422) {
            // Validation errors: Display the errors on the form.
            const validationErrors = error.response.data.error;
            setErrors(validationErrors); // Set Formik errors
            setErrorOpen(true);
          } else {
            setErrors('An error occurred while uploading the photo.');
            setErrorOpen(true);
        }
        }
      };
  
      
  return (
    <section className={className}>
    <header>
        <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
        {errors && (
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
                                {errors}
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

        <p className="mt-1 text-sm text-gray-600">
            Uload your Profile picture 
        </p>
        <img src={defaultProfilePic} className="w-100 h-100 p-1  mt-3 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" />

    </header>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={uploadPhoto}>
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
        <Form onSubmit={handleSubmit} className="mt-6 space-y-6">
    
        <div>
        <Field
        type="file"
        id="profile_pic"
        name="profile_pic"
        value={values.profile_pic}
        helperText={touched.profile_pic && errors.profile_pic}
        error={touched.profile_pic && Boolean(errors.profile_pic)}
        onBlur={handleBlur}

        accept=".png, .jpg, .jpeg, .webp"
        component={TextField}
        style={{margin: 10}}
        fullWidth
        onChange={(e) => handlePhotoChange(e, { setFieldValue })}
        />        
        </div>

        <div className="flex items-center gap-4">
        <Button
            type="submit"
            variant="contained"
            style={{
                color: 'white',
                width: '100%',
                backgroundColor: isSubmitting || !isValid || !dirty ? '#l66534' : '#3d5afe',
                padding: 15,
                marginTop: 10,
            }}
            disabled={isSubmitting || !isValid || !dirty}
        >
            {isSubmitting ? (
                <CircularProgress size={24} style={{ color: '#fff' }} />
            ) : (
                <>
                    Save
                </>
            )}
        </Button> 
        </div>
    </Form>
    )}
    </Formik>
</section>
  )
}
