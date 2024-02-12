import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import HomeNav from '@/Components/HomeNav';
export default function FacultyGuestLayout({ children }) {
    return (
      <>
      <HomeNav/>
      <div className="bg-gradient-to-tr from-indigo-900 to-indigo-500 h-screen w-full flex justify-center items-center">
   <div className="bg-slate-600 w-full sm:w-1/2 md:w-9/12 lg:w-1/2 shadow-md flex flex-col md:flex-row items-center mx-5 sm:m-0 rounded">
      <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl">NHIC</h1>
        <p className="text-5xl font-extrabold">Admin Portal</p>
        <p className="text-lg font-normal m-3 text-center">Unauthorized access to this system will get your device permenantly banned from accessing this web page.</p>
      </div>
      <div className="bg-white shadow-lg w-full md:w-1/2 flex flex-col items-center py-32 px-8">
       {children}
        </div>
        </div> 
        </div>
        </>
    );
}
