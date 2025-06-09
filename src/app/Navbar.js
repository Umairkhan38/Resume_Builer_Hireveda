"use client"
import Link from "next/link"

import React from 'react'

function Navbar() {

return (
<div>
<nav className="bg-[#000042] border-gray-200 dark:bg-gray-900">
  <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
    
    <div className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img
          src="https://hireveda.com/_next/image?url=%2Fimages%2FHireVeda.png&w=3840&q=75"
          className="h-12"
          alt="Hireveda Logo"
        />
      </Link>

      {/* Desktop nav menu */}
      <div className="hidden md:block">
        <ul className="font-medium flex space-x-6">
          <li>
            <Link
              href="/"
              className="block text-white py-1 px-3  font-semibold rounded-none  
              hover:rounded-s-full hover:rounded-e-full 
              hover:bg-white hover:text-[#000042] "
              aria-current="page" >
              Home
            </Link>
          </li>
        </ul>
      </div>
    </div>

    <button
      data-collapse-toggle="navbar-default"
      type="button"
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-default"
      aria-expanded="false"
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 17 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg>
    </button>
  </div>

  {/* Mobile nav menu */}
  <div className="md:hidden px-4 pb-4" id="navbar-default">
    <ul className="font-medium flex flex-col space-y-2 bg-[#000042] p-4 rounded-lg">
      <li>
        <a
          href="/"
          className="block text-white py-2 px-3 rounded-s-lg rounded-e-lg font-semibold transition-colors duration-200 hover:bg-white hover:text-[#000042] active:bg-white active:text-[#000042]"
          aria-current="page"
        >
          Home
        </a>
      </li>
    </ul>
  </div>
</nav>

</div>
  )
}

export default Navbar

