import DynamicChart from '@/Components/AdminComponents/DynamicChart';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';

export default function Analytics({auth, facultyData, studentsData, parentsData}) {
    const facultiesData = [10, 20, 40, 59, 98, 99, 100, 200, 220, 215, 214, 200];
    const studentData = [22, 20, 21, 44, 20, 49, 50, 44, 56, 59, 90, 10];
    const parentData = [80, 99, 90, 98, 95, 59, 99, 100, 120, 110, 115, 118];


  return (
    <AdminLayout
    user={auth.faculty}
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analytics</h2>}
  >
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
        <h1 className="mb-10 text-center font-medium text-4xl dark:text-white">Analytics</h1>
    <DynamicChart facultyData={facultiesData} studentsData={studentData} parentsData={parentData} type="line"/>
    </div>
    </AdminLayout>
  
  );
}
