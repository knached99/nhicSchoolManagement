import AdminLayout from '@/Layouts/AdminLayouts/AdminLayout'
import React from 'react'
import defaultProfilePic from '../../../../../public/assets/images/default_profile_pic.png';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
export default function ViewProfile({auth, user}) {
  return (
    <>
      <AdminLayout
        user={auth}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{user.name}'s Profile Page</h2>}
      >
    <div className="bg-white md:mx-auto rounded shadow-xl w-full md:w-1/2 overflow-hidden mt-5">
    
  <div className="h-[140px] bg-gradient-to-r from-slate-500 to-emerald-500"></div>
  <div className="px-5 py-2 flex flex-col gap-3 pb-6">
    <div className="h-[90px] shadow-md w-[90px] rounded-full border-4 overflow-hidden -mt-14 border-white bg-slate-100">
    <img src={defaultProfilePic} className="w-full h-full rounded-full object-center object-cover" />
    </div>

    <div className="flex gap-3 flex-wrap"><span className="rounded-sm bg-blue-500 px-3 py-3 text-xs font-medium text-white"><MailOutlineOutlinedIcon/>{user.email}</span><span className="rounded-sm bg-blue-500 px-3 py-3 text-xs font-medium text-white"><SmartphoneOutlinedIcon/> {user.phone_number ? user.phone_number : 'N/A'}</span><span className="rounded-sm bg-blue-500 px-3 py-3 text-xs font-medium text-white"><WorkOutlineOutlinedIcon/> {user.role}</span></div>
    {/* <div className="flex gap-2"><button type="button" className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center space-x-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 active:bg-white hover:bg-gray-100 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">Send Message</button><button type="button" className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center space-x-1 rounded border border-gray-200 bg-blue-700 px-3 py-2 text-sm font-medium text-white transition hover:border-blue-300 hover:bg-blue-600 active:bg-blue-700 focus:blue-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300">Add to projects</button></div> */}
    <h4 className="text-md font-medium leading-3">About</h4>
    <p className="text-sm text-stone-500">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere dolores aliquid sequi sunt iusto ipsum earum natus omnis asperiores architecto praesentium dignissimos pariatur, ipsa cum? Voluptate vero eius at voluptas?</p>
    <h4 className="text-md font-medium leading-3">Experiences</h4>
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-8 w-8 text-slate-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
        </svg>
        <div className="leading-3">
          <p className=" text-sm font-bold text-slate-700">Ui Designer</p><span className="text-xs text-slate-600">5 years</span>
        </div>
        <p className="text-sm text-slate-500 self-start ml-auto">As Ui Designer on Front Page</p>
      </div>
      <div className="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-8 w-8 text-slate-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
        </svg>
        <div className="leading-3">
          <p className=" text-sm font-bold text-slate-700">Ui Designer</p><span className="text-xs text-slate-600">5 years</span>
        </div>
        <p className="text-sm text-slate-500 self-start ml-auto">As Ui Designer on Front Page</p>
      </div>
      <div className="flex items-center gap-3 px-2 py-3 bg-white rounded border w-full "><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" className="h-8 w-8 text-slate-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
        </svg>
        <div className="leading-3">
          <p className=" text-sm font-bold text-slate-700">Ui Designer</p><span className="text-xs text-slate-600">5 years</span>
        </div>
        <p className="text-sm text-slate-500 self-start ml-auto">As Ui Designer on Front Page</p>
      </div>
    </div>
  </div>
</div>
</AdminLayout>
</>
  );
}
