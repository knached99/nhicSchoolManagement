import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { object, mixed } from 'yup';
import { Formik, Form, Field } from 'formik';

import 'primeicons/primeicons.css';
        
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
// import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';

// Profile Pic Upload 
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

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
    const [refreshData, setRefreshData] = useState(false); // handle state for refreshed data
    const [previewImage, setPreviewImage] = useState(null);

    const toast = useRef(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
    
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });
    
        setTotalSize(_totalSize);
    
        // Call your uploadPhoto function with the selected files
        const values = { profile_pic: e.files }; // Adapt the structure as needed
        const setSubmitting = () => {}; // Mock the setSubmitting function, you might need to handle this differently
    
        uploadPhoto(values, { setSubmitting });
    };
    
    const uploadPhoto = async (values, { setSubmitting }) => {
        try {
            if (!values.profile_pic || values.profile_pic.length === 0) {
                setErrors('Photo is required');
                setErrorOpen(true);
                return;
            }
    
            const formData = new FormData();
            
            // Append each file to the formData
            values.profile_pic.forEach((file, index) => {
                formData.append(`profile_pic[${index}]`, file);
            });
    
            const response = await axios.post('/uploadProfilePic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),

                },
            });
    
            if (response.status === 200) {
                setSuccess(response.data.success);
                setSuccessOpen(true);
                setPreviewImage(null);
                window.setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setErrors(`Server Error: ${response.data.errors}`);
                setErrorOpen(true);
            }
        } catch (error) {
            setErrors(error.message);
    
            if (error.response) {
                // Handle error response
                console.error('Server responded with status:', error.response.status);
                console.error('Server response data:', error.response.data);
    
                setErrors(`Server Error: ${error.response.status}`);
                setErrorOpen(true);
            } else if (error.request) {
                // Handle no response received
                console.error('No response received from server');
                setErrors('No response received from server');
            } else {
                // Handle other errors
                setErrors('An error occurred while uploading the photo.');
            }
    
            setErrorOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    
    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    // const validationSchema = object().shape({
    //     profile_pic: mixed()
    //         .required('Must select a profile pic')
    //         .test('fileSize', 'File size is too large', (value) => {
    //             if (!value) return true; // Allow empty file
    //             return value.size <= 2 * 1024 * 1024; // 2 MB
    //         })
    //         .test('fileType', 'Invalid file type selected', (value) => {
    //             if (!value) return true;
    //             return ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(value.type);
    //         }),
    // });

    // const initialValues = {
    //     profile_pic: null,
    // };

    // const handlePhotoChange = (e, setFieldValue) => {
    //     const file = e.target.files[0];
    
    //     setFieldValue('profile_pic', file);
    
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             setPreviewImage(e.target.result);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setPreviewImage(null);
    //     }
    
    //     setRefreshData(!refreshData);
    // };
    
    

    // const uploadPhoto = async (values, { setSubmitting }) => {
    //     try {
    //         if (!values.profile_pic) {
    //             setErrors('Photo is required');
    //             setErrorOpen(true);
    //             return;
    //         }
    
    //         const formData = new FormData();
    //         formData.append('profile_pic', values.profile_pic);
    
    //         const response = await axios.post('/uploadProfilePic', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    
    
    //         if (response.status === 200) {
    //             setSuccess(response.data.success);
    //             setSuccessOpen(true);
    //             setPreviewImage(null);
    //             window.setTimeout(() => {
    //                 window.location.reload();
    //               }, 2000);
    //         } else {
    //             setErrors(`Server Error: ${response.data.errors}`);
    //             setErrorOpen(true);
    //         }
    //     } catch (error) {
    //         setErrors(error.message);
    
    //         if (error.response) {
    //             // The request was made and the server responded with a status code
    //             // that falls out of the range of 2xx
    //             console.error('Server responded with status:', error.response.status);
    //             console.error('Server response data:', error.response.data);
    
    //             setErrors(`Server Error: ${error.response.status}`);
    //             setErrorOpen(true);

    //         } else if (error.request) {
    //             // The request was made but no response was received
    //             console.error('No response received from server');
    //             setErrors('No response received from server');
    //         } else {
    //             // Something happened in setting up the request that triggered an Error
    //             setErrors('An error occurred while uploading the photo.');
    //         }
    
    //         setErrorOpen(true);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };
    
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


      // Header Template 

      const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span className="dark:text-white">{formatedValue} / 1 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    // Item Template 

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    // Empty File Upload Template 

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };



    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <FileUpload ref={fileUploadRef} name="profile_pic" url="/uploadProfilePic" multiple accept=".png, .jpg, .jpeg," maxFileSize={1000000}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )

    
    // return (
    //     <section className={className}>
    //         <header>
    //             <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>

    //             {errors && (
    //                 <Box style={{ padding: '1rem', maxHeight: '80vh', overflowY: 'auto', width: '100%' }}>
    //                     <Collapse in={errorOpen}>
    //                         <Alert
    //                             icon={<ErrorOutlineIcon fontSize="inherit" />}
    //                             severity="error"
    //                             action={
    //                                 <IconButton
    //                                     aria-label="close"
    //                                     color="inherit"
    //                                     size="small"
    //                                     onClick={() => setErrorOpen(false)}
    //                                 >
    //                                     <CloseIcon fontSize="inherit" />
    //                                 </IconButton>
    //                             }
    //                             sx={{ mb: 2 }}
    //                         >
    //                             {errors}
    //                         </Alert>
    //                     </Collapse>
    //                 </Box>
    //             )}

    //             {success && (
    //                 <Box sx={{ width: '100%' }}>
    //                     <Collapse in={successOpen}>
    //                         <Alert
    //                             icon={<CheckCircleOutlineIcon fontSize="inherit" />}
    //                             severity="success"
    //                             action={
    //                                 <IconButton
    //                                     aria-label="close"
    //                                     color="inherit"
    //                                     size="small"
    //                                     onClick={() => setSuccessOpen(false)}
    //                                 >
    //                                     <CloseIcon fontSize="inherit" />
    //                                 </IconButton>
    //                             }
    //                             sx={{ mb: 2 }}
    //                         >
    //                             {success}
    //                         </Alert>
    //                     </Collapse>
    //                 </Box>
    //             )}

    //             <p className="mt-1 text-sm text-gray-600">Upload your Profile picture </p>
    //             {!user.profile_pic ? (
    //              <Avatar  sx={{ width: 56, height: 56 }} {...stringAvatar(user.name)} />

    //              )          
    //             : 
    //             (
    //                 <img src={`${profilePicPath}/${user.profile_pic}`} className="w-40 h-40 p-1 mt-3 rounded-full" alt="User Profile Pic" />
    //             )
    //             }


    //             {/* Image Preview Start */}
    //             <div className="mt-2">
    //                 {previewImage && (
    //                     <>
    //                     <p className="font-semibold">Image Preview: </p>
    //                     <img
    //                         src={previewImage}
    //                         alt="Profile Preview"
    //                         className="w-50 h-50 object-cover rounded ring-2 ring-gray-300 dark:ring-gray-500"
    //                     />
    //                     </>
    //                 )}
    //             </div>
    //             {/* Image Preview End */}
    //         </header>

    //         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={uploadPhoto}>
    //         {({ values, errors, touched, handleSubmit, handleBlur, handleChange, isValid, dirty, isSubmitting, setFieldValue }) => (
    //             <form onSubmit={handleSubmit} className="mt-6 space-y-6">
    //                     <div>
    //                     <Field
    //                     type="file"
    //                     id="profile_pic"
    //                     name="profile_pic"
    //                     helperText={touched.profile_pic && errors.profile_pic}
    //                     error={touched.profile_pic && Boolean(errors.profile_pic)}
    //                     onBlur={handleBlur}
    //                     accept=".png, .jpg, .jpeg, .webp"
    //                     component={TextField}
    //                     style={{ margin: 10 }}
    //                     fullWidth
    //                     onChange={(e) => handlePhotoChange(e, setFieldValue)}
    //                 />
    //                 <span className="text-slate-500">Supported Types: (jpg, jpeg, and png)</span>




    //                     </div>

    //                     <div className="flex items-center gap-4">
    //                     <Button
    //                     type="submit"
    //                     variant="contained"
    //                     style={{
    //                         color: 'white',
    //                         width: '100%',
    //                         backgroundColor: isSubmitting || !isValid || !dirty || !values.profile_pic ? '#l66534' : '#3d5afe',
    //                         padding: 15,
    //                         marginTop: 10,
    //                     }}
    //                     disabled={isSubmitting || !isValid || !dirty || !values.profile_pic}
    //                 >
    //                     {isSubmitting ? (
    //                         <CircularProgress size={24} style={{ color: '#fff' }} />
    //                     ) : (
    //                         <>Save</>
    //                     )}
    //                 </Button>


    //                     </div>
    //                 </form>
    //             )}
    //         </Formik>
    //     </section>
    // );
}