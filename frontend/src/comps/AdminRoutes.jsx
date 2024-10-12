import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoutes = (props) => {
  return (
    props.isAuthenticated==true ? <Outlet/> : <Navigate to="authenticate"/>
  );
}

export default AdminRoutes