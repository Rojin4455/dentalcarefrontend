import React from 'react'
import ResultsPage from '../../components/User/ResultsPage'
import { useSelector } from 'react-redux'

function ClinicResultsPage() {
    const location = useSelector((state) => state.location)
    console.log("first", location)
    // console.log("location: ", location, answers)
  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-10xl mx-auto px-4 py-8">
      {/* Paper-like container with elevation */}
      <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
        <ResultsPage location={location.location} answers={location.answers} />
    </div>
    </div>
    </div>
  )
}

export default ClinicResultsPage