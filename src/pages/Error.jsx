import React from 'react'
import { Link } from 'react-router-dom'
import resistanceBand from "../assets/resistance-band.svg"
import { ArrowLeft } from 'lucide-react'

const Error = () => {
  return (
    <div className="py-12 flex items-center justify-center px-2 md:py-24 md:px-0">
    <div className="lg:flex lg:items-center lg:space-x-10">
      <img
        src={resistanceBand}
        alt="question-mark"
        className="h-[300px] w-auto"
      />
      <div>
        <p className="mt-6 text-sm font-semibold text-black">404 error</p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-4 text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex items-center space-x-3">
          <Link
            to="/"
            type="button"
            className="inline-flex items-center rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go back
          </Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Error