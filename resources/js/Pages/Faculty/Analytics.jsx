import DynamicChart from '@/Components/AdminComponents/DynamicChart';
import AdminBarChart from '@/Components/AdminComponents/AdminBarChart';
import PieChart from '@/Components/AdminComponents/PieChart';
import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout';
import StorageInformation from '@/Components/AdminComponents/StorageInformation.';

export default function Analytics({ auth, facultyData, studentData, parentData, totalSize, logsSize, wallpaperSize, profilePicsSize, storageLeft, totalFiles, logFiles, wallpaperFiles, profileFiles }) {
    const facultiesData = [100];
    const studentsData = [200];
    const parentsData = [450];

    return (
        <AdminLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Analytics</h2>}
        >
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 m-5">
                <h1 className="mb-10 text-center font-medium text-4xl dark:text-white">Analytics</h1>
                <div className="flex justify-center shadow-md"> {/* Centering container */}
                    <PieChart facultyData={facultiesData} studentsData={studentsData} parentsData={parentsData} />
                    <div className="ml-2">
                    <AdminBarChart/>
                    </div>

                    <div className="ml-2">
                    <StorageInformation totalSize={totalSize} logsSize={logsSize} wallpaperSize={wallpaperSize} profilePicsSize={profilePicsSize} storageLeft={storageLeft} totalFiles={totalFiles} logFiles={logFiles} wallpaperFiles={wallpaperFiles} profileFiles={profileFiles}/>
                    </div>

                </div>
                {/* <DynamicChart facultyData={facultiesData} studentsData={studentData} parentsData={parentData} type="line"/> */}
            </div>
        </AdminLayout>
    );
}
