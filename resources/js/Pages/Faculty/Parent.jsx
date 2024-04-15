import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import {Link, Head } from '@inertiajs/react';
import React, {useState, useEffect} from 'react'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import StudentsTable from '@/Components/AdminComponents/StudentsTable';


export default function Parent({auth, parent, studentWithHighestAverage, highestAverage}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errorOpen, setErrorOpen] = useState(true);
    const [successOpen, setSuccessOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    
useEffect(() => {
  // Check if the system is in dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  setIsDarkMode(prefersDarkMode);
}, []);
    


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
      children: `${name.split(' ')[0][0]}${name.split(' ')[0][0]}`,
    };
  }

  const streetAddress = () => {
    const addressParts = [];
    if (parent.address) addressParts.push(parent.address);
    if (parent.address_2) addressParts.push(parent.address_2);
    if (parent.city) addressParts.push(parent.city);
    if (parent.state) addressParts.push(parent.state);
    if (parent.zip) addressParts.push(parent.zip);
  
    return addressParts.length > 0 ? addressParts.join(', ') : 'No data';
  }

     // Change color of grade depending on grade 
     let gradeColor;

     if (highestAverage >= 90) {
      gradeColor = '#10b981'; // Green
     } else if (highestAverage >= 80 && highestAverage <= 89) {
      gradeColor = '#38bdf8'; // Blue
     } else if (highestAverage >= 70 && highestAverage <= 79) {
      gradeColor = '#fbbf24'; // Yellow
     } else if (highestAverage >= 60 && highestAverage <= 69) {
      gradeColor = '#fb923c'; // Orange
     } else {
      gradeColor = '#ef4444'; // Red
     }

  return (
    <>
     <AdminLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight dark:text-white">{parent.name}'s profile</h2>}
        >
    <Head title={`${parent.name}'s Info`} />
    <div className="bg-gray-100 dark:bg-gray-900">
    <div className="container mx-auto py-8 ">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
                    <Link href="/faculty/dash" class="float-start mb-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                    <ArrowBackOutlinedIcon/>  Back
                  </Link>

                    <Avatar sx={{ width: 100, height: 100 }} {...stringAvatar(`${parent.name}`)} />
                        <h1 className="text-xl font-bold dark:text-white">{parent.name}</h1>
                        <p className="text-gray-700 dark:text-white text-xl text-center font-bold mt-3">Account Registered On: <span className="font-normal">{new Date(parent.created_at).toLocaleDateString()}</span></p>
    
                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 dark:text-white uppercase font-bold tracking-wider mb-2">Parent Bio</span>
                    
                        <ul class="max-w-md space-y-1 text-gray-500 list-none list-inside dark:text-gray-400">
                            <li>
                            <span className="font-bold dark:text-white">Email:</span> {parent.email}
                            </li>
                            <li>
                            <span className="font-bold dark:text-white">Phone Number:</span> {parent.phone ? parent.phone : 'No Data'}
                            </li>
                            <li>
                            <span className="font-bold dark:text-white">Street Address:</span> {streetAddress()}
                            </li>

                            <li>
                            <span className="font-bold dark:text-white">Account Verification Date:</span> <span className="font-bold text-emerald-500 dark:text-emerald-400">{parent.email_verified_at ? new Date(parent.email_verified_at).toLocaleDateString() : 'No data'}</span>
                            </li>
                            
                        </ul>

                    </div>
               
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">{parent.name}'s Profile</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 ">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-indigo-400 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Total Number of students
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{parent.students.length}</p>
        </p>
      </div>
    </div>
  </div>
{studentWithHighestAverage && 
<>
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-indigo-400 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Student with highest overall grade average
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p class="font-bold text-2xl text-center">{studentWithHighestAverage}</p>

        </p>
      </div>
    </div>
  </div>


  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-indigo-400 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Grade Average for {studentWithHighestAverage}
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p class="font-bold text-2xl text-center"><span style={{color: gradeColor}}>{highestAverage}</span>/100</p>


        </p>
      </div>
    </div>
  </div>
  </>
}
  
</div>
{/* <StudentAssignments studentID={student.student_id} /> */}
<StudentsTable auth={auth} path={`/showStudentsForParent/${parent.user_id}`}/>

                </div>
            </div>
        </div>
    </div>
</div>
</AdminLayout>
</>
  );
  
}
