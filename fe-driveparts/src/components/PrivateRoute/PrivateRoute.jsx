import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'

const PrivateRoute = ({ children }) => {
  const { user, token } = useContext(UserContext)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
