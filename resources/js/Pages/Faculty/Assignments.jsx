import React from 'react'
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';

export default function Assignments({auth, assignments}) {
  return (
    <AdminLayout
    user={auth.faculty}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Assignments</h2>}
    >

    <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="dark:bg-slate-600 bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-white text-lg">
            My Assignments
            </div>
          </div>
        </div>
    </div>

    </AdminLayout>
  )
}
