import React from 'react'
import { Logo } from './index';
import { Link } from 'react-router-dom';

export default function Footer() {
    const thisYear = new Date().getFullYear();
    
  return (
    <footer className="relative overflow-hidden py-10 border-t mt-10">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap text-center">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <Link to="/" className="mb-4 inline-flex items-center justify-center select-none">
                <Logo classname="w-20" width="50px"/>
                <span className="ml-4 text-lg font-bold">Tech kart</span>
              </Link>
              <div className='select-none'>
                <p className="mb-4  text-base font-medium">One place for every electronics</p>
                <p className="text-sm text-gray-600">
                  &copy; Copyright {thisYear}. All Rights Reserved by TechKart.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/shipment">
                    Shipment Portal
                  </Link>
                </li>
                <li className="mb-4">
                <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/account">
                    Account
                  </Link>
                </li>
                <li className="mb-4">
                <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                  Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/delivery">
                    Delivery Portal
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Help
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Customer Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-500">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/seller">
                    Seller Portal
                  </Link>
                </li>
                <li className="mb-4">
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link className=" text-base font-medium text-gray-900 hover:text-gray-700" to="/">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
