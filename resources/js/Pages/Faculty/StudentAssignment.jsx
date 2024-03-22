import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Tooltip from '@mui/material/Tooltip';
import { Link } from '@inertiajs/react';

export default function StudentAssignment({ auth, student, assignments, answer }) {
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
                                <div className="mb-4 text-3xl tracking-light font-medium text-gray-900 dark:text-white text-start">Assignment Details For 
                                <span className="ml-2">{student.first_name} {student.last_name}</span> 
                                </div>
                               
                                <h2 className="mb-4 text-xl tracking-tight font-bold text-gray-900 dark:text-white">{assignment.assignment.assignment_name}</h2>
                                <p className="mb-4 font-medium text-xl dark:text-white">
                                    <Tooltip title="Assignment Description" arrow>
                                        <DescriptionOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
                                    </Tooltip>
                                    {assignment.assignment.assignment_description}
                                </p>
                                <p className="mb-4 font-medium text-xl dark:text-white">
                                    <Tooltip title="Assignment Due Date" arrow>
                                        <CalendarMonthOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} />
                                    </Tooltip>
                                    {new Date(assignment.assignment.assignment_due_date).toLocaleString()}
                                </p>
                               
                            </div>
                        ))}

                        
                         <div className="block">
                           <h1 className="font-medium text-2xl mt-3 dark:text-white text-black">Answer:</h1>  
                          <p className="mt-3 text-pretty dark:text-white text-lg"> {answer ? answer.assignment_answer : 'No Answer Provided Yet'} </p>
                          </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
