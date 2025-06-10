import React from 'react'
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";


function LandingPage() {
  return (
    <div>
          <section id="home-section" className="bg-slateGray">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center"><div className="col-span-6 flex flex-col gap-8 ">
          <div className="flex gap-2 mx-auto lg:mx-0">
           </div><h1 className="text-midnight_text text-4xl sm:text-5xl font-semibold pt-3 lg:pt-0">Your Dream Job Starts With a Great Resume.</h1><h3 className="text-black/70 text-lg pt-5 lg:pt-0">Start Building your Resume — Trusted by Thousands of Job Seekers.</h3>
          <div className="relative rounded-full pt-5 lg:pt-0">
     <button className="bg-secondary p-5 rounded-full absolute right-2 top-2 "></button></div><div className="flex items-center justify-between pt-10 lg:pt-4">
      
      <div className="flex gap-5">
      
      <Link href="/resumeform?source=resume" className="bg-[#000042] hover:[#000042] cursor-pointer text-white font-semibold py-3 px-4 rounded-full transition duration-300">Upload Resume</Link>

      <Link href="/resumeform" className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-black flex items-center gap-x-2 font-semibold py-3 px-4 rounded-full transition duration-300">
  Without Resume <FaArrowRightLong /> </Link>

        
        </div>
        </div>
        </div>
        <div className="col-span-6 flex justify-center">
          <img alt="nothing" loading="lazy" width="1000" height="805" decoding="async" data-nimg="1" style={{color:"transparent"}} src="https://themewagon.github.io/E-learning/images/banner/mahila.png" /></div></div>
          </div>
    </section>
    </div>
  )
}

export default LandingPage