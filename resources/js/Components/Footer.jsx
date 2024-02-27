import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
  return (
    <footer className="bg-dark-grey max-w flex text-white border-b-2 border-white w-full">
  <div className="container mx-auto text-center">
    <div className="py-32">
      {/* <h1 className="text-5xl">Don't be shy. Say hi 👋</h1>
      <p className="text-2xl text-hairline py-6">Do you have a project or an idea that could use some help? <br />Let's work together</p> */}
    </div>
    <div className="flex justify-start items-start">
      <ul className="list-reset flex pt-16 pb-16">
        <li className="mr-8">
          <Link href="/" className="no-underline hover:underline text-white">
            <h2 className="text-3xl text-bold">NHICCT EDU</h2>
          </Link>
        </li>
        <li className="mr-8 mt-2">
          <Link className="text-grey-darker no-underline hover:text-white" href="#">Terms of Use</Link>
        </li>
        <li className="mr-8 mt-2">
          <Link className="text-grey-darker no-underline hover:text-white" href="#">Privacy</Link>
        </li>
      </ul>
      
      <ul className="list-reset flex pt-16 pb-16 ml-auto">
      <li className="mr-8"> 
          <a className="text-grey-darker no-underline hover:text-white" href="https://nhicct.org/" target="_blank" rel="noopener noreferrer">Official Website</a>
        </li>
        <li className="mr-8">
          <a className="text-grey-darker no-underline hover:text-white" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/nhic_orange_ct/">Instagram</a>
        </li>
        <li className="mr-8">
          <a className="text-grey-darker no-underline hover:text-white" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/profile.php?id=100085270422116">Facebook</a>
        </li>
      
      </ul>
    </div>
  </div>
</footer>
  )
}
