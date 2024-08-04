import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const ProtectedRoute = ({authontication=true, children, isSignUp=true, redirect}) => {
    const isLogin = useSelector((state) => state.auth.isLogin)
    const navigate = useNavigate()

    useEffect(() => {
        if (authontication && isLogin !== authontication) {
            navigate('/login', {state: {isSignUp, redirect}})
        }else if(!authontication && isLogin !== authontication) {
            navigate('/')
        }
    },[isLogin, authontication])

    return children
}

export default ProtectedRoute