import React from 'react';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import AdminsTable from '@/Components/AdminComponents/AdminsTable';
import StudentsTable from '@/Components/AdminComponents/StudentsTable';
import ParentsTable from '@/Components/AdminComponents/ParentsTable';
import MyStudentsTable from '@/Components/AdminComponents/MyStudentsTable';
import MyAttendanceTable from '@/Components/AdminComponents/MyAttendanceTable';
export default function Dash({ auth }) {
  // Check if auth object is defined before accessing its properties
  const userName = auth && auth.faculty ? auth.faculty.name : 'Guest';

  return (
    <AdminLayout
      user={auth.faculty}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Faculty Dashboard</h2>}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              Welcome back, {userName}!
            </div>
          </div>
          {auth.faculty && (
          (auth.faculty.role === 'Admin') && (
              <>
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
          <MyAttendanceTable facultyID={auth.faculty.faculty_id} />
          </>
        )
      )}
     




          
        </div>
      </div>
    </AdminLayout>
  );
}
