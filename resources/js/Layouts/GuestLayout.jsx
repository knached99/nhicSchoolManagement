import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import HomeNav from '@/Components/HomeNav';
export default function Guest({ children }) {
    return (
      <>
        <HomeNav/>
      
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-tr from-purple-600 to-indigo-500">
          

            <div className="dark:bg-slate-800 w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-lg overflow-hidden sm:rounded-lg">
            <div className="m-3 text-center">
                <Link href="/">
                    <h1 className="text-emerald-500 font-black text-3xl">NHICCT <span className="text-slate-900 dark:text-white">EDU</span></h1>
                    {/* <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" /> */}
                </Link>
            </div>
                {children}
            </div>
        </div>
        </>
    );
}
