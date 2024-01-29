import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import HomeNav from '@/Components/HomeNav';
export default function FacultyGuestLayout({ children }) {
    return (
      <>
      <HomeNav/>
      <div class="bg-gradient-to-tr from-slate-900 to-slate-600 h-screen w-full flex justify-center items-center">
   <div class="bg-green-600 w-full sm:w-1/2 md:w-9/12 lg:w-1/2 shadow-md flex flex-col md:flex-row items-center mx-5 sm:m-0 rounded">
      <div class="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center text-white">
        <h1 class="text-3xl">NHIC</h1>
        <p class="text-5xl font-extrabold">Quran & Arabic</p>
        <p class="text-lg font-normal m-3 text-center">Unauthorized access to this system will get your device permenantly banned from accessing this web page.</p>
      </div>
      <div class="bg-white shadow-lg w-full md:w-1/2 flex flex-col items-center py-32 px-8">
       {children}
        </div>
        </div> 
        </div>
        </>
    );
}
