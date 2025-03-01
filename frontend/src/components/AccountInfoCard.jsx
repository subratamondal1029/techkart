import React from 'react'

const AccountInfoCard = ({label, logo, value}) => {
  return (
    <div className='min-w-52 min-h-3 p-4 cursor-default bg-gray-50 rounded-md shadow-inner hover:shadow-md relative'>
    <h3 className='font-bold text-lg mb-2'>{label}</h3>
    <p>{value}</p>

    {logo}
  </div>
  )
}

export default AccountInfoCard