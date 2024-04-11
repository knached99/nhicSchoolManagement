
import Footer
 from "@/Components/Footer";
export default function Banned({message}) {
  
  return (
    <>
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-tr from-red-400 to-indigo-500">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true"></div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
          {/* 🥺 */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl"><span className="text-white font-black mr-2">You are Banned! </span></h1>
            <p className="mt-6 text-2xl font-medium leading-8 text-white">{message}</p>
            <p className="mt-5 text-xl font-bold leading-8 text-white">If you feel that this is a mistake, please contact the NHIC school admin</p>
          </div>
        </div>
        <Footer/>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true"></div>

      </div>
    </>
  );
}
