import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // ✅ pakai custom hook

type ProtectedRouteProps = {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { token } = useAuth() // ✅ token pasti ada karena useAuth sudah type-safe

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute