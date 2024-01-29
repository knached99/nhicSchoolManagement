import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import UpdatePasswordForm from './Partials/UpdateFacultyPasswordForm';
import UpdateFacultyProfile from './Partials/UpdateFacultyProfile';
import { Head } from '@inertiajs/react';

export default function FacultyEdit({ auth }) {
    return (
        <AdminLayout
            user={auth.faculty}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateFacultyProfile className="max-w-xl"/>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
