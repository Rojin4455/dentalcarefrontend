import React from 'react'
import ResultsPage from '../../components/User/ResultsPage'
import { useSelector } from 'react-redux'
import Header from '../../components/User/Header'

function ClinicResultsPage() {
    const location = useSelector((state) => state.location)
    console.log("first", location)
    // console.log("location: ", location, answers)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-8">
          <ResultsPage location={location.location} answers={location.answers} />
        </div>
      </div>
    </div>
  )
}

export default ClinicResultsPage