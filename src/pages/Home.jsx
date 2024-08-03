import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
const userData = useSelector((state) => state.auth.userData)
console.log(userData);

  return (
    <div className='text-center mt-4'>
      <h1 className='font-bold text-3xl'>Home</h1>
      <Link to="/seller" className='text-blue-500 underline'>Seller</Link>
      {userData && <p>Wellcome {userData?.name}</p>}
    </div>
  )
}

export default Home