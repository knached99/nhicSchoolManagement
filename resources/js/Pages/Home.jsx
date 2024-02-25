import { Link, Head } from '@inertiajs/react';
import HomeNav from '@/Components/HomeNav';
export default function Home({ auth, laravelVersion, phpVersion }) {
  
  return (
    <div className="bg-dark">
        {/* NAVBAR COMPONENT HERE*/}
    <HomeNav/>
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"><span className="text-emerald-500 font-black mr-2">NHICCT</span>EDU</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">Parents, login to the system to view your child's progress and track how well they're doing</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="/login" className="inline-flex items-center bg-transparent border-2 py-1 px-5 focus:outline-none hover:bg-white hover:text-blue-500 rounded-full text-base mt-4 md:mt-0">Login Here</a>
            <a href="/register" className="inline-flex items-center bg-transparent border-2 py-1 px-5 focus:outline-none hover:bg-white hover:text-blue-500 rounded-full text-base mt-4 md:mt-0">Don't have an account?</a>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      </div>
    </div>
  </div>
  
  );
}