import React from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import AdminProtectedRoute from './AdminProtectedRoute'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import ClinicAdminPortal from '../components/Admin/ClinicPortal'


function AdminRouter() {
  return (
    <Routes>
        <Route path='/' element={<AdminLoginPage/>} />
        <Route path='/home' element={<AdminProtectedRoute><ClinicAdminPortal/></AdminProtectedRoute>} />
        </Routes>
  )
}

export default AdminRouter