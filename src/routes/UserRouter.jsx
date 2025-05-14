import React from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import ClinicPortal from '../components/User/DentalClinicPortal'
import ClinicDetails from '../components/User/ClinicDetails'
import DentalClinicPage from '../pages/user/DentalClinicPage'
import ClinicDetailsPage from '../pages/user/ClinicDetailsPage'
import ResultsPage from '../components/User/ResultsPage'
import ClinicResultsPage from '../pages/user/ClinicResultsPage'
// import AdminProtectedRoute from './AdminProtectedRoute'
// import AdminLoginPage from '../pages/AdminLoginPage'
// import ClinicAdminPortal from '../components/Admin/ClinicPortal'


function UserRouter() {
  return (
    <Routes>
        {/* <Route path='/user-login' element={<UserLoginPage/>} /> */}
        <Route path='/' element={<DentalClinicPage/>} />
        <Route path="/clinic-details" element={<ClinicDetailsPage />} />
        <Route path="/clinic-results" element={<ClinicResultsPage />} />

        </Routes>
  )
}

export default UserRouter