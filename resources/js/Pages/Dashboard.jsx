import {useState, useEffect} from 'react';
import StudentsList from '@/Components/UserComponents/StudentsList';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const [studentName, setStudentName] = useState(null);
    const [highestAverage, setHighestAverage] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStudentWithHighestGrade = async () => {
            try {
                const response = await axios.get('/studentWithHighestGradeAverage');
                const { studentWithHighestAverage, highestAverage, error } = response.data; 

                if (error) {
                    setError(error);
                } else {
                    setStudentName(studentWithHighestAverage);
                    setHighestAverage(highestAverage);
                }
            } catch (error) {
                setError('Unable to get data: ' + error.message);
            }
        };
        getStudentWithHighestGrade();
    }, []);

       // Change color of grade depending on grade 
       let color;

       if (highestAverage >= 90) {
           color = '#10b981'; // Green
       } else if (highestAverage >= 80 && highestAverage <= 89) {
           color = '#38bdf8'; // Blue
       } else if (highestAverage >= 70 && highestAverage <= 79) {
           color = '#fbbf24'; // Yellow
       } else if (highestAverage >= 60 && highestAverage <= 69) {
           color = '#fb923c'; // Orange
       } else {
           color = '#ef4444'; // Red
       }
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight dark:text-white">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-white">Welcome Back {auth.user.name}!</div>
                        {studentName &&
                        <h5 className="text-start ml-4 mb-2 text-lg">Student With the highest grade: <span className="text-emerald-600 dark:text-emerald-400">{studentName}</span>
                        <span className="block">Average Grade for the above student: <span style={{color: color}}>{highestAverage}</span>/100</span>
                        </h5>
                        }
                        {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
                    </div>
                    <div className="m-5 text-center w-full">
                    <StudentsList/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}