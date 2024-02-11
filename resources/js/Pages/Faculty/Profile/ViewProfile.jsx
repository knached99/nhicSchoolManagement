import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout'
import React, {useState, useEffect} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import defaultProfilePic from '../../../../../public/assets/images/default_profile_pic.png';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import StudentsTable from '@/Components/AdminComponents/StudentsTable';
export default function ViewProfile({auth, user, students}) {

  //   const formatPermissions = (permissions) => {
  //     if (!permissions || !Array.isArray(permissions)) {
  //         return 'N/A';
  //     }
  
  //     // Replace underscores with spaces and join permissions with spaces
  //     return permissions.map(permission => permission.replace(/_/g, ' ')).join(', ');
  // };



  return (
    <>
      <AdminLayout
        user={auth}
        header={<h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">{user.name}'s Profile Page</h2>}
      >
    <div className="bg-gray-100">
    <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div className="col-span-4 sm:col-span-3">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center">
            
                        <AccountCircleIcon style={{fontSize: 100, color: 'gray'}}/>
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <p className="text-gray-700 text-center font-bold"><MailOutlineOutlinedIcon/> <span className="font-normal">{user.email}</span></p>

                    </div>
                    <hr className="my-6 border-t border-gray-300" />
                    <div className="flex flex-col">
                        <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Teacher Information</span>
                        <ul>
                        {/* <li className="mb-2">Permissions:  <span className="font-normal">{user.role==='Admin' && 'All Permissions' || user.role==='Teacher' && formatPermissions(user.permissions)}</span></li>                       */}
                        <li className="mb-2"><SmartphoneOutlinedIcon/> {user.phone ?? 'N/A'}</li>
                        <li className="mb-2"><WorkOutlineOutlinedIcon/> {user.role}</li>  
                        </ul>
                    </div>
              
                   
                </div>
            </div>
            <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Teacher's Information</h2>
                 
                
                        
<div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Students
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">{students.length}</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Total Assignments
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <p class="font-bold text-2xl text-center">10</p>
        </p>
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-96">
    <div class="relative mt-6 text-gray-700 bg-white border-slate-900 border-2 shadow-md bg-clip-border rounded-xl">
      <div class="p-6">
        <h5 class="text-center block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Faculty Since
        </h5>
        <p class="block font-sans text-base antialiased font-light leading-relaxed text-inherit">
        <p className="font-bold text-2xl text-center">
          {new Date(user.created_at).toLocaleDateString()}
      </p>

        </p>
      </div>
    </div>
  </div>
  
</div>
                    <h2 className="text-xl font-bold mt-6 mb-4">Students</h2>
                    <StudentsTable auth={auth} path={`/showStudentsForTeacher/${user.faculty_id}`}/>

                    {/* <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between flex-wrap gap-2 w-full">
                            <span className="text-gray-700 font-bold">Web Developer</span>
                            <p>
                                <span className="text-gray-700 mr-2">at ABC Company</span>
                                <span className="text-gray-700">2017 - 2019</span>
                            </p>
                        </div>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae
                            tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit.
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
</div>

</AdminLayout>
</>
  );
}
