import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { object, mixed } from 'yup';
import { Formik, Form, Field } from 'formik';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Tooltip from '@mui/material/Tooltip';


export default function UpdateProfilePic({ className = '' }) {
    const profilePicPath = "http://localhost:8000/storage/profile_pics"; 
    const user = usePage().props.auth.faculty;
    const { data, setData } = useForm({
        profile_pic: user.profile_pic,
    });

    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    // const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data
    // const [previewImage, setPreviewImage] = useState(null);

    const initialValues = {
        profile_pic: null,
    };


      
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
    
    

    const uploadPhoto = async (values, { setSubmitting }) => {
        
        try {
            if (!values.profile_pic) {
                setErrors('Photo is required');
                setErrorOpen(true);
                return;
            }

            const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
            if (!allowedFileTypes.includes(values.profile_pic.type)) {
                setErrors(`Invalid file type selected. The chosen file must be in JPG, JPEG, or PNG format, but you selected a file with a "${values.profile_pic.type}" type.`);
                setErrorOpen(true);
                return;
            }
    

        
            if (values.profile_pic.size > 2 * 1024 * 1024) {
                setErrors(`File size exceeds the 2 MB limit. The file you selected is ${
                    values.profile_pic.size > 1024 * 1024 * 1024
                        ? `${(values.profile_pic.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                        : `${(values.profile_pic.size / (1024 * 1024)).toFixed(2)} MB`
                }`);
                                setErrorOpen(true);
                return;
            }
        
         
            const formData = new FormData();
            formData.append('profile_pic', values.profile_pic);
    
            const response = await axios.post('/uploadProfilePic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
    
            if (response.status === 200) {
                setSuccess(response.data.success);
                setSuccessOpen(true);
                window.setTimeout(() => {
                    window.location.reload();
                  }, 1000);
            } else {
                setErrors(`Server Error: ${response.data.errors}`);
                setErrorOpen(true);
            }
        } catch (error) {
            setErrors(error.message);
    
            if (error.response) {
                
                console.error('Server responded with status:', error.response.status);
                console.error('Server response data:', error.response.data);
    
                setErrors(`Server Error: ${error.response.status}`);
                setErrorOpen(true);

            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from server');
                setErrors('No response received from server');
            } 
            // else {
            //     // Something happened in setting up the request that triggered an Error
            //     setErrors('An error occurred while uploading the photo.');
            // }
    
            setErrorOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    const fileInputRef = useRef(null);
    
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
        <section className={className}>
            <header>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Profile Picture</h2>

                {errors && (
                    <Box style={{ padding: '1rem', maxHeight: '80vh', overflowY: 'auto', width: '100%' }}>
                        <Collapse in={errorOpen}>
                            <Alert
                                icon={<ErrorOutlineIcon fontSize="inherit" />}
                                severity="error"
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => setErrorOpen(false)}
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
                                        onClick={() => setSuccessOpen(false)}
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

                <p className="mt-1 text-xl dark:text-slate-100 mb-3 text-gray-600">Upload your Profile picture </p>
                {!user.profile_pic ? (
                 <Avatar  sx={{ width: 56, height: 56 }} {...stringAvatar(user.name)} />

                 )          
                : 
                (
                    <img src={`${profilePicPath}/${user.profile_pic}`} className="w-40 h-40 p-1 mt-3 rounded-full" alt="User Profile Pic" />
                )
                }


                {/* Image Preview Start */}
                {/* <div className="mt-2">
                    {previewImage && (
                        <>
                        <p className="font-semibold">Image Preview: </p>
                        <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="w-50 h-50 object-cover rounded ring-2 ring-gray-300 dark:ring-gray-500"
                        />
                        </>
                    )}
                </div> */}
                {/* Image Preview End */}
            </header>

            <Formik initialValues={initialValues} onSubmit={uploadPhoto}>
            {({ handleSubmit, setSubmitting, setFieldValue }) => (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <Tooltip title="Upload Profile Picture" arrow placement="right">
                        <IconButton onClick={() => fileInputRef.current.click()}>
                    <AddPhotoAlternateOutlinedIcon style={{ fontSize: 60 }} />
                    </IconButton>
                    </Tooltip>

                     <VisuallyHiddenInput
                        ref={fileInputRef}
                        type="file"
                        name="profile_pic" 
                        id="profile_pic"
                        onChange={(e) => {
                            setFieldValue('profile_pic', e.currentTarget.files[0]); 
                            uploadPhoto({ profile_pic: e.currentTarget.files[0] }, { setSubmitting });
                        }}
                        />

                               
                    <span className="text-slate-500 dark:text-white">Supported Formats: (jpg, jpeg, or png)</span>

                    </form>
                )}
            </Formik>
        </section>
    );
}