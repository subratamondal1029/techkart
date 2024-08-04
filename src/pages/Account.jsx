import React from 'react'
import { useParams } from 'react-router-dom'

const Account = () => {
    const {userId} = useParams()

  return (
    <div>Account {userId}</div>
  )
}

export default Account