import { useState, useRef, useEffect } from 'react';
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


export default function UploadWallpaperPic({ className = '', style='' }) {
    const wallpaperPicPath = "http://localhost:8000/storage/wallpaper_pics"; 

    const user = usePage().props.auth.faculty;
    const { data, setData } = useForm({
        wallpaper_pic: user.wallpaper_pic,
    });

    const [errors, setErrors] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data
    // const [previewImage, setPreviewImage] = useState(null);

    const initialValues = {
        wallpaper_pic: null,
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
    
  const removeWallpaper = () => {
    // Send a DELETE request to your backend to remove the wallpaper
    axios.delete(`/removeWallpaper`)
      .then(response => {
        // Assuming the backend returns a success message or updated user data
        setSuccess(response.data.success);
        setSuccessOpen(true);

        window.setTimeout(() => {
            window.location.reload();
          }, 1500);
      })
      .catch(error => {

        console.error('Error removing wallpaper:', error);
        setErrorOpen(`Error removing wallpaper: ${error}`);
        setErrorOpen(true);
      });
  };
    const uploadPhoto = async (values, { setSubmitting }) => {
        
        try {
            if (!values.wallpaper_pic) {
                setErrors('Photo is required');
                setErrorOpen(true);
                return;
            }

            const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/avif'];
            if (!allowedFileTypes.includes(values.wallpaper_pic.type)) {
                setErrors(`Invalid file type selected. The chosen file must be in JPG, JPEG, or PNG format, but you selected a file with a "${values.wallpaper_pic.type}" type.`);
                setErrorOpen(true);
                return;
            }
    

        
            if (values.wallpaper_pic.size > 2 * 1024 * 1024) {
                setErrors(`File size exceeds the 2 MB limit. The file you selected is ${
                    values.wallpaper_pic.size > 1024 * 1024 * 1024
                        ? `${(values.wallpaper_pic.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                        : `${(values.wallpaper_pic.size / (1024 * 1024)).toFixed(2)} MB`
                }`);
                                setErrorOpen(true);
                return;
            }
        
         
            const formData = new FormData();
            formData.append('wallpaper_pic', values.wallpaper_pic);
    
            const response = await axios.post('/uploadWallpaperPic', formData, {
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

      useEffect(() => {
        // Check if the system is in dark mode
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
        setIsDarkMode(prefersDarkMode);
      }, []);
      
      const color = isDarkMode ? '#fff' : 'inherit';


    return (
        <section className={className} style={style}>
            <header>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Wallpaper Picture</h2>

              

                <p className="mt-1 text-xl dark:text-slate-100 mb-3 text-gray-600">Your Wallpaper picture will replace your background theme.
                For the most visually appealing wallpaper, we recommend downloading a wallpaper from  <a href="https://www.pexels.com/" className="text-blue-600 dark:text-blue-300 font-bold m-1" target="_blank" rel="noopener noreferrer">Pexels.com</a>
                or <a href="https://www.unsplash.com/" className="text-blue-600 dark:text-blue-300 font-bold m-1" target="_blank" rel="noopener noreferrer">Unsplash.com</a>
                 as the images there are 4k and crisp.
                <span className="block mt-3 border-b-2 border-slate-500dark:border-slate-100 p-2 mb-3">
                To download the image from the website:
                </span>

                <ol class="max-w-md space-y-1 text-gray-500 dark:text-white list-decimal list-inside ">
                <li>right click on the image you like </li> 
                <li>select "save Image as..."</li> 
                <li>Rename image and download</li> 
                <li>After downloading to your computer, upload the image here. </li>              
                </ol>
                </p>

                {user.wallpaper_pic ? 
                <>
                <h6 className="font-medium text-xl mb-5 text-slate-500 dark:text-white">Your current wallpaper: </h6>
                <img src={`${wallpaperPicPath}/${user.wallpaper_pic}`}/>
                <button className="hover:text-orange-500 font-medium" onClick={removeWallpaper}>Remove Wallpaper</button>
                </>
                 : null}
   
            </header>

            <Formik initialValues={initialValues} onSubmit={uploadPhoto}>
            {({ handleSubmit, setSubmitting, setFieldValue }) => (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <Tooltip title="Upload Profile Picture" arrow placement="right">
                        <IconButton onClick={() => fileInputRef.current.click()}>
                    <AddPhotoAlternateOutlinedIcon style={{ fontSize: 60, color: color }} />
                    </IconButton>
                    </Tooltip>

                     <VisuallyHiddenInput
                        ref={fileInputRef}
                        type="file"
                        name="wallpaper_pic" 
                        id="wallpaper_pic"
                        onChange={(e) => {
                            setFieldValue('wallpaper_pic', e.currentTarget.files[0]); 
                            uploadPhoto({ wallpaper_pic: e.currentTarget.files[0] }, { setSubmitting });
                        }}
                        />

                               
                    <span className="text-slate-500 dark:text-white">Supported Formats: (jpg, jpeg, png, webp, or avif)</span>
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
                    </form>
                )}
            </Formik>
        </section>
    );
}