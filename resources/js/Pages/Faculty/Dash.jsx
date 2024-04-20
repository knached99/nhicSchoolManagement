import React from 'react';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import AdminsTable from '@/Components/AdminComponents/AdminsTable';
import StudentsTable from '@/Components/AdminComponents/StudentsTable';
import ParentsTable from '@/Components/AdminComponents/ParentsTable';
import MyStudentsTable from '@/Components/AdminComponents/MyStudentsTable';
import MyAttendanceTable from '@/Components/AdminComponents/MyAttendanceTable';
import Cards from '@/Components/AdminComponents/Cards';
export default function Dash({ auth, notifications, facultyCount, studentsCount, parentsCount }) {

  // const userName = auth && auth.faculty ? auth.faculty.name : 'Guest';
  return (
    <AdminLayout
      user={auth.faculty}
      notifications={notifications}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Faculty Dashboard</h2>}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
         
          {auth.faculty && (
          (auth.faculty.role === 'Admin') && (
              <>
               {/* <div className="dark:bg-slate-600 bg-white overflow-hidden shadow-sm sm:rounded-lg">  */}
             <div className="p-6 text-gray-900 dark:text-white text-lg">
             {/* <Cards facultyCount={facultyCount} studentsCount={studentsCount} parentsCount={parentsCount} /> */}
            </div>
          {/* </div> */}
                  <AdminsTable auth={auth} />
                  <StudentsTable auth={auth} path="/showAllStudents"/>
                  <ParentsTable auth={auth} />
              </>
          )
      )}

    {auth.faculty && (
        auth.faculty.role === 'Teacher' && (
          <>

          <MyStudentsTable auth={auth} />
          <MyAttendanceTable auth={auth && auth.faculty && auth.faculty.faculty_id} />
          </>
        )
      )}
     




          
        </div>
      </div>
    </AdminLayout>
  );
}
