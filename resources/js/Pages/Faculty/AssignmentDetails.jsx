import React, {useState, useEffect} from 'react';

import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';

import { Link } from '@inertiajs/react';
import EditAssignmentModal from '@/Components/AdminComponents/EditAssignmentModal';


export default function AssignmentDetails({ auth, assignment }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the system is in dark mode
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <AdminLayout
      user={auth}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Assignment Details</h2>}
    >
      <section className="bg-white dark:bg-gray-900 shadow-lg">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
            <h1 className="mb-4 text-3xl tracking-light font-black text-gray-900 dark:text-white text-center">Assignment Details</h1>
            {/* MODAL GOES HERE */}
            <EditAssignmentModal assignment={assignment}/>
            <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
  
               {assignment.assignment_name}</h2>
            <p className="mb-4 font-medium text-xl dark:text-white">
              <Tooltip title="Assignment Description" arrow>
              <DescriptionOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
              </Tooltip>
               {assignment.assignment_description}</p>
            <p className="mb-4 font-medium text-xl dark:text-white">
              <Tooltip title="Assignment Due Date" arrow>
              <CalendarMonthOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
              </Tooltip>
              {new Date(assignment.assignment_due_date).toLocaleString()}</p>
            <h2 className="font-bold text-2xl mb-4 mt-4">Assigned To:</h2>

            <ul className="flex flex-col shadow-lg dark:bg-slate-700 p-4 overflow-y-auto max-h-64 rounded">
  {assignment.students ? (
    assignment.students.map((student, index) => (
      <li key={index} className="border-gray-400 flex flex-row mb-2 justify-start items-center p-2 bg-white dark:bg-slate-500 dark:text-white rounded-md">
        <Link className="mr-2 hover:underline" href={`/faculty/studentassignment/${student.student_id}`}>{student.first_name} {student.last_name}</Link>
      </li>
    ))
  ) : (
    <li className="text-gray-500 dark:text-gray-400">Not assigned to any student</li>
  )}
</ul>


         
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
