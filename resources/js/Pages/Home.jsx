import { Link, Head } from '@inertiajs/react';
import HomeNav from '@/Components/HomeNav';
import Footer
 from '@/Components/Footer';
import GeolocationMap from '@/Components/GeoLocationMap';
export default function Home({ auth, laravelVersion, phpVersion }) {
  
  return (
    <>
    <HomeNav/>
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-tr from-purple-600 to-indigo-500">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl"><span className="text-emerald-400 font-black mr-2">NHICCT</span>EDU</h1>
          <p className="mt-6 text-2xl font-bold leading-8 text-white ">Parents, you login to the system to view your child's progress and track how well they're doing</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login" className="bg-slate-800 shadow-lg hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full">Login</Link>
            <Link href="/register" className="bg-slate-800 shadow-lg hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full">Create Account</Link>
          </div>
          {/* <GeolocationMap/> */}
        </div>
      </div>
      {/* footer */}
      <Footer/>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">

        
      </div>
    </div>
    </>
  );
}