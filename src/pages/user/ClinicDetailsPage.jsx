import React from 'react'
import ClinicDetails from '../../components/User/ClinicDetails'
import Header from '../../components/User/Header'
import PromoHeader from '../../components/User/PromoHeader'

function ClinicDetailsPage() {
  return (
    <div className='bg-white'>
            {/* <Header/> */}
            <PromoHeader/>

      <ClinicDetails />
    </div>  )
}

export default ClinicDetailsPage