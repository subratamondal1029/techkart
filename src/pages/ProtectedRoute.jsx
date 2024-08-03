import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({authontication=true, children, isSignUp=true, label}) => {
    const isLogin = useSelector((state) => state.auth.isLogin)
    const navigate = useNavigate()

    useEffect(() => {
        if (authontication && isLogin !== authontication) {
            navigate('/login', {state: {isSignUp, label}})
        }else if(!authontication && isLogin !== authontication) {
            navigate('/')
        }
        
    },[isLogin, authontication])

    return children
}

export default ProtectedRoute