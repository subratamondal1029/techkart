import React from 'react'
import {Logo} from "./index"

const MainLoader = () => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <Logo classname="w-70 animate-bounce-slow" width="500px" />
    </div>
  )
}

export default MainLoader